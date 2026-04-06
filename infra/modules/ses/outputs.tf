output "sender_email" {
  description = "SES sender email address"
  value       = var.sender_email
}

output "domain_identity_arn" {
  description = "ARN of the verified SES domain identity"
  value       = aws_ses_domain_identity.sender.arn
}
