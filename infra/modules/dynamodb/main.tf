resource "aws_dynamodb_table" "submissions" {
  name         = "contact-form-submissions"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "id"
  range_key = "submittedAt"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "submittedAt"
    type = "S"
  }
}
