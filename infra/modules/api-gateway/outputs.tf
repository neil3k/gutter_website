output "api_endpoint" {
  description = "Base URL of the HTTP API (without trailing path)"
  value       = aws_apigatewayv2_api.contact.api_endpoint
}
