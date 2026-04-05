# A record for apex domain → CloudFront
# allow_overwrite handles pre-existing records (e.g. from Lightsail)
resource "aws_route53_record" "apex_a" {
  zone_id         = var.zone_id
  name            = var.domain_name
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record for apex domain → CloudFront
resource "aws_route53_record" "apex_aaaa" {
  zone_id         = var.zone_id
  name            = var.domain_name
  type            = "AAAA"
  allow_overwrite = true

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# A record for www subdomain → CloudFront
resource "aws_route53_record" "www_a" {
  zone_id         = var.zone_id
  name            = "www.${var.domain_name}"
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record for www subdomain → CloudFront
resource "aws_route53_record" "www_aaaa" {
  zone_id         = var.zone_id
  name            = "www.${var.domain_name}"
  type            = "AAAA"
  allow_overwrite = true

  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}
