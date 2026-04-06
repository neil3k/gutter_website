# Requirements Document

## Introduction

The Warboys Gutter Clearing website currently has a ContactForm component that collects visitor enquiries (name, email, telephone, address, optional message) and POSTs JSON to a configurable endpoint URL. However, no backend exists to receive these submissions. This document defines the requirements for a serverless backend that receives contact form submissions via AWS API Gateway and Lambda, stores them in DynamoDB for record-keeping, sends email notifications to the business owner via SES, and includes basic spam protection. All infrastructure is provisioned via Terraform alongside the existing S3/CloudFront setup.

## Glossary

- **Contact_API**: An AWS API Gateway HTTP API that exposes a public HTTPS endpoint for receiving contact form submissions from the Website
- **Submission_Lambda**: An AWS Lambda function invoked by the Contact_API that processes incoming contact form submissions, validates the payload, stores the submission, and triggers an email notification
- **Submissions_Table**: An AWS DynamoDB table that stores all contact form submissions for record-keeping
- **Notification_Email**: An email sent via SES to the business owner containing the details of a new contact form submission
- **SES_Identity**: An Amazon SES verified email identity (sender address) used by the Submission_Lambda to send Notification_Emails
- **Honeypot_Field**: A hidden form field not visible to human users, used to detect automated spam submissions; if the field contains a value, the submission is treated as spam
- **CORS_Policy**: The Cross-Origin Resource Sharing configuration on the Contact_API that permits requests from the Website domain
- **Submission_Payload**: The JSON body sent by the ContactForm component to the Contact_API, containing name, email, telephone, address, optional message, and the Honeypot_Field
- **ContactForm_Component**: The existing Astro component (`ContactForm.astro`) that renders the contact form and submits data via fetch to the Contact_API endpoint
- **Endpoint_URL**: The public HTTPS URL of the Contact_API, configured in the Astro build via the `PUBLIC_FORM_ACTION_URL` environment variable
- **Rate_Limit**: A throttling configuration on the Contact_API that limits the number of requests per second to prevent abuse
- **Business_Owner_Email**: The email address of the Warboys Gutter Clearing business owner, configured as a Terraform variable, used as the recipient for Notification_Emails

## Requirements

### Requirement 1: API Gateway Endpoint

**User Story:** As a website visitor, I want my contact form submission to be received by a backend endpoint, so that my enquiry reaches the business.

#### Acceptance Criteria

1. THE Terraform configuration SHALL provision a Contact_API using AWS API Gateway HTTP API in the eu-west-2 region.
2. THE Contact_API SHALL expose a single POST route at the path `/contact`.
3. THE Contact_API SHALL integrate the POST `/contact` route with the Submission_Lambda.
4. THE Contact_API SHALL return a JSON response with an HTTP 200 status code and a body containing `{"message": "Submission received"}` when the Submission_Lambda processes a valid submission successfully.
5. IF the Submission_Payload fails validation, THEN THE Contact_API SHALL return a JSON response with an HTTP 400 status code and a body describing the validation error.
6. IF the Submission_Lambda encounters an internal error, THEN THE Contact_API SHALL return a JSON response with an HTTP 500 status code and a body containing `{"message": "Internal server error"}`.

### Requirement 2: CORS Configuration

**User Story:** As a website visitor, I want the contact form to submit successfully from the live website domain, so that my browser does not block the request.

#### Acceptance Criteria

1. THE Contact_API SHALL configure a CORS_Policy that allows the origin `https://warboysgutterclearing.co.uk`.
2. THE CORS_Policy SHALL allow the HTTP method POST.
3. THE CORS_Policy SHALL allow the headers `Content-Type`.
4. THE CORS_Policy SHALL expose the headers `Content-Type`.

### Requirement 3: Submission Validation

**User Story:** As a business owner, I want only valid submissions to be processed, so that I receive complete and useful enquiries.

#### Acceptance Criteria

1. WHEN the Submission_Lambda receives a Submission_Payload, THE Submission_Lambda SHALL validate that the `name` field is a non-empty string.
2. WHEN the Submission_Lambda receives a Submission_Payload, THE Submission_Lambda SHALL validate that the `email` field is a non-empty string matching a standard email format.
3. WHEN the Submission_Lambda receives a Submission_Payload, THE Submission_Lambda SHALL validate that the `telephone` field is a non-empty string.
4. WHEN the Submission_Lambda receives a Submission_Payload, THE Submission_Lambda SHALL validate that the `address` field is a non-empty string.
5. WHEN the Submission_Lambda receives a Submission_Payload, THE Submission_Lambda SHALL accept the `message` field as an optional string.
6. IF any required field is missing or empty, THEN THE Submission_Lambda SHALL return a 400 response listing all invalid fields.

### Requirement 4: Spam Protection via Honeypot

**User Story:** As a business owner, I want basic spam protection on the contact form, so that I do not receive automated junk submissions.

#### Acceptance Criteria

1. THE ContactForm_Component SHALL include a Honeypot_Field that is hidden from human users using CSS (`display: none` or equivalent).
2. THE ContactForm_Component SHALL include the Honeypot_Field value in the Submission_Payload sent to the Contact_API.
3. WHEN the Submission_Lambda receives a Submission_Payload where the Honeypot_Field contains a non-empty value, THE Submission_Lambda SHALL discard the submission silently and return an HTTP 200 response with `{"message": "Submission received"}`.
4. THE Submission_Lambda SHALL NOT store a honeypot-detected submission in the Submissions_Table.
5. THE Submission_Lambda SHALL NOT send a Notification_Email for a honeypot-detected submission.

### Requirement 5: Rate Limiting

**User Story:** As a business owner, I want the API to be protected from excessive requests, so that the backend is not overwhelmed by abuse or denial-of-service attempts.

#### Acceptance Criteria

1. THE Contact_API SHALL configure a Rate_Limit of 10 requests per second with a burst limit of 20 requests.
2. WHEN a request exceeds the Rate_Limit, THE Contact_API SHALL return an HTTP 429 status code.

### Requirement 6: DynamoDB Storage

**User Story:** As a business owner, I want all valid contact form submissions stored in a database, so that I have a record of enquiries even if the email notification is missed.

#### Acceptance Criteria

1. THE Terraform configuration SHALL provision a Submissions_Table in DynamoDB with a partition key of `id` (string) and a sort key of `submittedAt` (string, ISO 8601 timestamp).
2. THE Terraform configuration SHALL configure the Submissions_Table with on-demand billing mode.
3. WHEN the Submission_Lambda processes a valid, non-spam submission, THE Submission_Lambda SHALL write a record to the Submissions_Table containing the fields: `id` (UUID), `submittedAt` (ISO 8601 timestamp), `name`, `email`, `telephone`, `address`, and `message`.
4. THE Submissions_Table record SHALL store the `message` field as an empty string when the Visitor does not provide a message.

### Requirement 7: Email Notification via SES

**User Story:** As a business owner, I want to receive an email notification when someone submits the contact form, so that I can respond to enquiries promptly.

#### Acceptance Criteria

1. WHEN the Submission_Lambda processes a valid, non-spam submission, THE Submission_Lambda SHALL send a Notification_Email via SES to the Business_Owner_Email address.
2. THE Notification_Email SHALL contain the submission details: name, email, telephone, address, and message.
3. THE Notification_Email SHALL use a clear subject line that includes the submitter name, such as "New Contact Form Submission from [name]".
4. THE Notification_Email sender address SHALL be the SES_Identity configured via a Terraform variable.
5. THE Terraform configuration SHALL provision the SES_Identity as a verified email identity for the sender address.
6. IF the SES email send fails, THEN THE Submission_Lambda SHALL log the error and still return a success response to the Visitor, because the submission is already stored in the Submissions_Table.

### Requirement 8: Lambda Configuration

**User Story:** As a developer, I want the Lambda function to be properly configured and deployable, so that the backend runs reliably.

#### Acceptance Criteria

1. THE Terraform configuration SHALL provision the Submission_Lambda using the Node.js 20.x runtime.
2. THE Terraform configuration SHALL configure the Submission_Lambda with a timeout of 10 seconds and a memory allocation of 128 MB.
3. THE Terraform configuration SHALL create an IAM execution role for the Submission_Lambda with permissions to write to the Submissions_Table and send emails via SES.
4. THE Submission_Lambda IAM role SHALL follow the principle of least privilege, granting only the permissions required for DynamoDB PutItem on the Submissions_Table and SES SendEmail.
5. THE Submission_Lambda source code SHALL be stored in the repository at `infra/lambda/contact-form/index.mjs`.

### Requirement 9: Frontend Integration

**User Story:** As a developer, I want the ContactForm component to submit to the real backend endpoint, so that the form works end-to-end on the live site.

#### Acceptance Criteria

1. THE ContactForm_Component SHALL read the Contact_API Endpoint_URL from the `PUBLIC_FORM_ACTION_URL` environment variable at build time.
2. WHEN the `PUBLIC_FORM_ACTION_URL` environment variable is not set, THE ContactForm_Component SHALL set the form action to `#` and the form SHALL NOT submit.
3. THE ContactForm_Component SHALL include the Honeypot_Field in the rendered HTML form, hidden from sighted users via CSS and labelled with `aria-hidden="true"` and `tabindex="-1"` to also hide it from assistive technologies.
4. THE Terraform configuration SHALL output the Contact_API Endpoint_URL so that it can be used to set the `PUBLIC_FORM_ACTION_URL` environment variable during the site build.

### Requirement 10: Infrastructure Integration

**User Story:** As a developer, I want the contact form backend infrastructure to be managed alongside the existing Terraform configuration, so that all AWS resources are provisioned consistently.

#### Acceptance Criteria

1. THE Terraform configuration for the contact form backend SHALL be organised as new modules within the existing `infra/modules/` directory structure.
2. THE root Terraform module (`infra/main.tf`) SHALL wire the new contact form backend modules alongside the existing S3, CloudFront, ACM, and DNS modules.
3. THE Terraform configuration SHALL accept the Business_Owner_Email as an input variable.
4. THE Terraform configuration SHALL accept the SES sender email address as an input variable.
5. THE Terraform configuration SHALL output the full Contact_API Endpoint_URL (including the `/contact` path).
