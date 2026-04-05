output "apex_a_fqdn" {
  description = "FQDN of the apex A record"
  value       = aws_route53_record.apex_a.fqdn
}

output "apex_aaaa_fqdn" {
  description = "FQDN of the apex AAAA record"
  value       = aws_route53_record.apex_aaaa.fqdn
}

output "www_a_fqdn" {
  description = "FQDN of the www A record"
  value       = aws_route53_record.www_a.fqdn
}

output "www_aaaa_fqdn" {
  description = "FQDN of the www AAAA record"
  value       = aws_route53_record.www_aaaa.fqdn
}
