output "cloudfront_distribution_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = module.cloudfront.distribution_domain_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket hosting the website files"
  value       = module.s3.bucket_id
}
