variable "lambda_invoke_arn" {
  description = "Invoke ARN of the Lambda function to integrate"
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function (for permission resource)"
  type        = string
}

variable "domain_name" {
  description = "Website domain name (used for CORS origin)"
  type        = string
}
