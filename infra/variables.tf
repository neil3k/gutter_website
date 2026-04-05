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
