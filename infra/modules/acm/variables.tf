variable "domain_name" {
  description = "Apex domain name for the ACM certificate"
  type        = string
}

variable "zone_id" {
  description = "Route 53 hosted zone ID for DNS validation"
  type        = string
}
