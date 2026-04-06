variable "domain_name" {
  description = "Apex domain name"
  type        = string
  default     = "warboysgutterclearing.co.uk"
}

variable "hosted_zone_id" {
  description = "Existing Route 53 hosted zone ID"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for website files"
  type        = string
  default     = "warboysgutterclearing-website"
}

variable "notify_email" {
  description = "Business owner email address for contact form notifications"
  type        = string
}

variable "ses_sender_email" {
  description = "SES verified sender email address for contact form notifications"
  type        = string
}
