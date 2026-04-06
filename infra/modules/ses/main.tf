# SES domain identity verification via Route 53
resource "aws_ses_domain_identity" "sender" {
  domain = var.domain_name
}

resource "aws_route53_record" "ses_verification" {
  zone_id = var.zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.sender.verification_token]
}

resource "aws_ses_domain_identity_verification" "sender" {
  domain     = aws_ses_domain_identity.sender.id
  depends_on = [aws_route53_record.ses_verification]
}

# DKIM for better deliverability
resource "aws_ses_domain_dkim" "sender" {
  domain = aws_ses_domain_identity.sender.domain
}

resource "aws_route53_record" "ses_dkim" {
  count   = 3
  zone_id = var.zone_id
  name    = "${aws_ses_domain_dkim.sender.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  records = ["${aws_ses_domain_dkim.sender.dkim_tokens[count.index]}.dkim.amazonses.com"]
}
