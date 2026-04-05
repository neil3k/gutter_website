variable "bucket_name" {
  description = "Name of the S3 bucket for website files"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution allowed to read from this bucket"
  type        = string
}
