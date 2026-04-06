variable "domain_name" {
  description = "Domain name to verify with SES"
  type        = string
}

variable "zone_id" {
  description = "Route 53 hosted zone ID for DNS verification records"
  type        = string
}

variable "sender_email" {
  description = "The sender email address (e.g. noreply@domain.com)"
  type        = string
}
