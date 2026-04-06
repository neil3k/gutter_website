import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { randomUUID } from "node:crypto";

const ddb = new DynamoDBClient();
const ses = new SESClient();

const TABLE_NAME = process.env.TABLE_NAME;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const SES_SENDER_EMAIL = process.env.SES_SENDER_EMAIL;

/**
 * Parse the JSON body from the API Gateway event.
 * Throws on malformed input.
 */
export function parseBody(event) {
  const raw = event.body;
  if (!raw) throw new Error("Missing body");
  return JSON.parse(raw);
}

/**
 * Returns true if the honeypot field is non-empty (spam).
 */
export function isSpam(body) {
  return typeof body.honeypot === "string" && body.honeypot.trim().length > 0;
}

/**
 * Validate required fields and email format.
 * Returns { valid: boolean, errors: string[] }.
 */
export function validate(body) {
  const errors = [];
  const required = ["name", "email", "telephone", "address"];

  for (const field of required) {
    if (
      typeof body[field] !== "string" ||
      body[field].trim().length === 0
    ) {
      errors.push(field);
    }
  }

  // Email format check (only if not already flagged as missing)
  if (
    !errors.includes("email") &&
    typeof body.email === "string" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    errors.push("email");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Store a submission in DynamoDB.
 */
export async function storeSubmission(item, client = ddb) {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      id: { S: item.id },
      submittedAt: { S: item.submittedAt },
      name: { S: item.name },
      email: { S: item.email },
      telephone: { S: item.telephone },
      address: { S: item.address },
      message: { S: item.message },
    },
  });
  await client.send(command);
}

/**
 * Send a notification email via SES.
 */
export async function sendNotification(item, client = ses) {
  const command = new SendEmailCommand({
    Source: SES_SENDER_EMAIL,
    Destination: { ToAddresses: [NOTIFY_EMAIL] },
    Message: {
      Subject: { Data: `New Contact Form Submission from ${item.name}` },
      Body: {
        Text: {
          Data: [
            "New contact form submission:",
            "",
            `Name:      ${item.name}`,
            `Email:     ${item.email}`,
            `Telephone: ${item.telephone}`,
            `Address:   ${item.address}`,
            `Message:   ${item.message}`,
            "",
            `Submitted at: ${item.submittedAt}`,
          ].join("\n"),
        },
      },
    },
  });
  await client.send(command);
}

/**
 * Lambda handler — orchestrates parse → honeypot → validate → store → notify → respond.
 */
export async function handler(event) {
  let body;
  try {
    body = parseBody(event);
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  // Honeypot check — silently discard spam
  if (isSpam(body)) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Submission received" }),
    };
  }

  // Validate required fields
  const validation = validate(body);
  if (!validation.valid) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Validation failed",
        errors: validation.errors,
      }),
    };
  }

  const item = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    name: body.name.trim(),
    email: body.email.trim(),
    telephone: body.telephone.trim(),
    address: body.address.trim(),
    message: typeof body.message === "string" ? body.message.trim() : "",
  };

  // Store in DynamoDB
  try {
    await storeSubmission(item);
  } catch (err) {
    console.error("DynamoDB PutItem failed:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }

  // Send notification email — failure is non-fatal (Req 7.6)
  try {
    await sendNotification(item);
  } catch (err) {
    console.error("SES SendEmail failed:", err);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Submission received" }),
  };
}
