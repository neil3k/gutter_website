terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Default provider — eu-west-2 (London), appropriate for UK-based business
provider "aws" {
  region = "eu-west-2"
}

# us-east-1 alias — required for ACM certificates used by CloudFront
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
