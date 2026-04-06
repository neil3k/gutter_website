variable "table_name" {
  description = "DynamoDB submissions table name"
  type        = string
}

variable "table_arn" {
  description = "DynamoDB submissions table ARN"
  type        = string
}

variable "ses_sender_email" {
  description = "Verified SES sender email address"
  type        = string
}

variable "notify_email" {
  description = "Business owner email address for notifications"
  type        = string
}
