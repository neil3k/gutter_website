# Implementation Plan: Contact Form Backend

## Overview

Serverless backend for the contact form using API Gateway, Lambda, DynamoDB, and SES — all provisioned via Terraform modules alongside the existing infrastructure. The Lambda handler is a single ESM file (Node.js 20.x) with no bundler. Frontend changes are minimal: add a honeypot field and include it in the JSON payload.

## Tasks

- [x] 1. Create DynamoDB Terraform module
  - [x] 1.1 Create `infra/modules/dynamodb/main.tf` with `aws_dynamodb_table` resource
    - Partition key `id` (S), sort key `submittedAt` (S), billing mode PAY_PER_REQUEST
    - _Requirements: 6.1, 6.2_
  - [x] 1.2 Create `infra/modules/dynamodb/variables.tf` and `infra/modules/dynamodb/outputs.tf`
    - Output `table_name` and `table_arn` for use by the Lambda module
    - _Requirements: 6.1_

- [x] 2. Create SES Terraform module
  - [x] 2.1 Create `infra/modules/ses/main.tf` with `aws_ses_email_identity` resource
    - Verified email identity for the sender address
    - _Requirements: 7.4, 7.5_
  - [x] 2.2 Create `infra/modules/ses/variables.tf` and `infra/modules/ses/outputs.tf`
    - Input: `sender_email`; output: `sender_email` for downstream modules
    - _Requirements: 7.4_

- [x] 3. Create Lambda Terraform module
  - [x] 3.1 Create `infra/modules/lambda/main.tf` with Lambda function, IAM role, and CloudWatch log group
    - Node.js 20.x runtime, 128 MB memory, 10s timeout
    - IAM role with least-privilege: DynamoDB PutItem on the submissions table ARN, SES SendEmail
    - Environment variables: TABLE_NAME, NOTIFY_EMAIL, SES_SENDER_EMAIL
    - Source code path: `infra/lambda/contact-form/index.mjs`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 3.2 Create `infra/modules/lambda/variables.tf` and `infra/modules/lambda/outputs.tf`
    - Inputs: `table_name`, `table_arn`, `ses_sender_email`, `notify_email`
    - Outputs: `invoke_arn`, `function_name`
    - _Requirements: 8.3_

- [x] 4. Create API Gateway Terraform module
  - [x] 4.1 Create `infra/modules/api-gateway/main.tf` with HTTP API, stage, route, integration, and Lambda permission
    - POST `/contact` route integrated with the Lambda
    - CORS: allow origin `https://warboysgutterclearing.co.uk`, method POST, headers Content-Type
    - Rate limit: 10 req/s, burst 20
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 5.1, 5.2_
  - [x] 4.2 Create `infra/modules/api-gateway/variables.tf` and `infra/modules/api-gateway/outputs.tf`
    - Inputs: `lambda_invoke_arn`, `lambda_function_name`, `domain_name`
    - Output: `api_endpoint`
    - _Requirements: 10.5_

- [x] 5. Wire new modules into root Terraform configuration
  - [x] 5.1 Add `notify_email` and `ses_sender_email` variables to `infra/variables.tf`
    - _Requirements: 10.3, 10.4_
  - [x] 5.2 Add module blocks for `dynamodb`, `ses`, `lambda`, and `api_gateway` in `infra/main.tf`
    - Wire outputs from dynamodb/ses into lambda, lambda into api_gateway
    - _Requirements: 10.1, 10.2_
  - [x] 5.3 Add `contact_api_endpoint_url` output to `infra/outputs.tf`
    - Full URL including `/contact` path
    - _Requirements: 9.4, 10.5_

- [x] 6. Checkpoint — Verify Terraform configuration
  - Ensure all Terraform modules are syntactically valid and properly wired. Ask the user if questions arise.

- [x] 7. Implement Lambda handler
  - [x] 7.1 Create `infra/lambda/contact-form/index.mjs` with the handler and helper functions
    - `parseBody(event)` — parse JSON body, throw on malformed input
    - `isSpam(body)` — return true if `body.honeypot` is non-empty
    - `validate(body)` — check required fields (name, email, telephone, address), email format; return `{ valid, errors }`
    - `storeSubmission(item)` — DynamoDB PutItem with UUID id and ISO 8601 submittedAt
    - `sendNotification(item)` — SES SendEmail to business owner
    - `handler(event)` — orchestrate: parse → honeypot check → validate → store → notify → respond
    - _Requirements: 1.4, 1.5, 1.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.3, 4.4, 4.5, 6.3, 6.4, 7.1, 7.2, 7.3, 7.6_

  - [ ]* 7.2 Write property test: Validation rejects incomplete payloads (Property 1)
    - **Property 1: Validation rejects incomplete payloads and lists all invalid fields**
    - Use fast-check to generate payloads with random combinations of missing/empty/whitespace required fields and invalid email formats
    - Assert `validate` returns `{ valid: false }` with correct `errors` array
    - **Validates: Requirements 1.5, 3.1, 3.2, 3.3, 3.4, 3.6**

  - [ ]* 7.3 Write property test: Honeypot silently discards spam (Property 2)
    - **Property 2: Honeypot silently discards spam without side effects**
    - Use fast-check to generate valid payloads with random non-empty honeypot strings
    - Mock DynamoDB and SES clients; assert handler returns 200, neither mock is called
    - **Validates: Requirements 4.3, 4.4, 4.5**

  - [ ]* 7.4 Write property test: Valid submission stores complete record (Property 3)
    - **Property 3: Valid submission stores a complete record in DynamoDB**
    - Use fast-check to generate fully valid payloads (with and without optional message)
    - Assert DynamoDB PutItem called with item containing UUID id, ISO timestamp, all field values; message defaults to `""`
    - **Validates: Requirements 6.3, 6.4, 3.5**

  - [ ]* 7.5 Write property test: Valid submission sends correct notification (Property 4)
    - **Property 4: Valid submission sends a correct notification email**
    - Use fast-check to generate fully valid payloads
    - Assert SES SendEmail called with correct source, destination, subject containing name, body containing all field values
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**

  - [ ]* 7.6 Write property test: Valid submission returns success response (Property 5)
    - **Property 5: Valid submission returns success response**
    - Use fast-check to generate fully valid payloads
    - Assert handler returns `{ statusCode: 200, body: '{"message":"Submission received"}' }`
    - **Validates: Requirements 1.4**

  - [ ]* 7.7 Write unit tests for Lambda handler edge cases
    - Test malformed JSON returns 400 with `{"message": "Invalid request body"}`
    - Test DynamoDB failure returns 500
    - Test SES failure still returns 200 (Req 7.6)
    - Test `isSpam` with empty, whitespace, and non-empty honeypot values
    - Test file: `infra/lambda/contact-form/__tests__/handler.test.mjs`
    - _Requirements: 1.5, 1.6, 4.3, 7.6_

- [x] 8. Checkpoint — Verify Lambda handler and tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Update ContactForm.astro with honeypot field
  - [x] 9.1 Add honeypot input field to the form HTML
    - Hidden via CSS (`position: absolute; left: -9999px; opacity: 0`), `aria-hidden="true"`, `tabindex="-1"`, `name="honeypot"`
    - _Requirements: 4.1, 9.3_
  - [x] 9.2 Include honeypot value in the JSON payload in the submit handler script
    - The existing `Object.fromEntries(formData.entries())` already picks up all named inputs, so the honeypot will be included automatically — verify this is the case
    - _Requirements: 4.2, 9.1_
  - [x] 9.3 Ensure form does not submit when `PUBLIC_FORM_ACTION_URL` is unset
    - The existing code already checks `actionUrl === '#'` — verify no changes needed
    - _Requirements: 9.2_

  - [ ]* 9.4 Write unit test for honeypot field rendering
    - Verify ContactForm.astro renders an input with `name="honeypot"`, `aria-hidden="true"`, `tabindex="-1"`, and hidden CSS
    - Test file: `site/src/components/__tests__/honeypot-field.test.ts`
    - _Requirements: 4.1, 9.3_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Lambda uses AWS SDK v3 clients available in the Node.js 20.x runtime (no bundler needed)
- Property tests use fast-check (already a dev dependency)
- Test framework: Vitest (already configured)
