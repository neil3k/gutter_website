variable "s3_bucket_regional_domain" {
  description = "Regional domain name of the S3 origin bucket"
  type        = string
}

variable "s3_bucket_id" {
  description = "Name (ID) of the S3 origin bucket"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS"
  type        = string
}

variable "domain_name" {
  description = "Apex domain name (e.g. warboysgutterclearing.co.uk)"
  type        = string
}

variable "aliases" {
  description = "List of domain aliases for the distribution (apex + www)"
  type        = list(string)
}
