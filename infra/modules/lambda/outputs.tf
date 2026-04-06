output "invoke_arn" {
  description = "Invoke ARN of the contact form Lambda function"
  value       = aws_lambda_function.contact_form.invoke_arn
}

output "function_name" {
  description = "Name of the contact form Lambda function"
  value       = aws_lambda_function.contact_form.function_name
}
