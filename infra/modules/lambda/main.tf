# --- IAM Role ---

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "contact-form-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "lambda_permissions" {
  # DynamoDB PutItem on the submissions table only
  statement {
    actions   = ["dynamodb:PutItem"]
    resources = [var.table_arn]
  }

  # SES SendEmail
  statement {
    actions   = ["ses:SendEmail"]
    resources = ["*"]
  }

  # CloudWatch Logs
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.lambda.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "contact-form-lambda-policy"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda_permissions.json
}

# --- CloudWatch Log Group ---

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/contact-form-handler"
  retention_in_days = 14
}

# --- Lambda Function ---

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/../../lambda/contact-form/index.mjs"
  output_path = "${path.module}/../../lambda/contact-form/function.zip"
}

resource "aws_lambda_function" "contact_form" {
  function_name    = "contact-form-handler"
  role             = aws_iam_role.lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  memory_size      = 128
  timeout          = 10
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      TABLE_NAME       = var.table_name
      NOTIFY_EMAIL     = var.notify_email
      SES_SENDER_EMAIL = var.ses_sender_email
    }
  }

  depends_on = [
    aws_iam_role_policy.lambda,
    aws_cloudwatch_log_group.lambda,
  ]
}
