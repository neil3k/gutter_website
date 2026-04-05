# Root module composition — wires all child modules together.
#
# Dependency order (enforced implicitly via variable references):
#   1. ACM  — certificate must exist before CloudFront can reference it
#   2. S3   — bucket created early; bucket *policy* depends on CloudFront ARN
#   3. CloudFront — depends on ACM cert + S3 bucket domain/id
#   4. DNS  — alias records point to the CloudFront distribution

# ------------------------------------------------------------------------------
# ACM — TLS certificate in us-east-1 (required by CloudFront)
# ------------------------------------------------------------------------------
module "acm" {
  source = "./modules/acm"

  providers = {
    aws = aws.us_east_1
  }

  domain_name = var.domain_name
  zone_id     = var.hosted_zone_id
}

# ------------------------------------------------------------------------------
# S3 — private bucket for static website files
# ------------------------------------------------------------------------------
module "s3" {
  source = "./modules/s3"

  bucket_name                = var.bucket_name
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
}

# ------------------------------------------------------------------------------
# CloudFront — CDN distribution with OAC, custom domain, and security headers
# ------------------------------------------------------------------------------
module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_regional_domain = module.s3.bucket_regional_domain_name
  s3_bucket_id              = module.s3.bucket_id
  acm_certificate_arn       = module.acm.certificate_arn
  domain_name               = var.domain_name
  aliases                   = [var.domain_name, "www.${var.domain_name}"]
}

# ------------------------------------------------------------------------------
# DNS — Route 53 alias records for apex and www → CloudFront
# ------------------------------------------------------------------------------
module "dns" {
  source = "./modules/dns"

  zone_id                                = var.hosted_zone_id
  domain_name                            = var.domain_name
  cloudfront_distribution_domain_name    = module.cloudfront.distribution_domain_name
  cloudfront_distribution_hosted_zone_id = module.cloudfront.distribution_hosted_zone_id
}
