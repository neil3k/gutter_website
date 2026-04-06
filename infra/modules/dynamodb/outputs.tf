output "table_name" {
  description = "Name of the DynamoDB submissions table"
  value       = aws_dynamodb_table.submissions.name
}

output "table_arn" {
  description = "ARN of the DynamoDB submissions table"
  value       = aws_dynamodb_table.submissions.arn
}
