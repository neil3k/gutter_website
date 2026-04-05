variable "zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Apex domain name (e.g. warboysgutterclearing.co.uk)"
  type        = string
}

variable "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  type        = string
}

variable "cloudfront_distribution_hosted_zone_id" {
  description = "Route 53 hosted zone ID for the CloudFront distribution"
  type        = string
}
