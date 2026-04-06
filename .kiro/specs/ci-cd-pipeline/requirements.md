# Requirements Document

## Introduction

The Warboys Gutter Clearing website is currently deployed manually: the developer builds the Astro site locally, syncs the output to S3, and invalidates the CloudFront cache by hand. This process is error-prone, unrepeatable, and blocks deployment behind a single person's workstation. This document defines the requirements for a GitHub Actions CI/CD pipeline that automates testing, building, and deploying the site on every push to the main branch, runs tests on pull requests, and supports manual re-deployment triggers. The pipeline authenticates to AWS using OIDC federation (no long-lived access keys). Terraform infrastructure management remains a separate, manual process.

## Glossary

- **Pipeline**: The GitHub Actions CI/CD workflow that automates testing, building, and deploying the Website
- **Workflow_File**: The YAML file stored at `.github/workflows/` that defines the Pipeline
- **Main_Branch**: The `main` branch of the GitHub repository, used as the production deployment trigger
- **Pull_Request**: A GitHub pull request targeting the Main_Branch
- **OIDC_Provider**: The GitHub Actions OpenID Connect identity provider configured in AWS IAM, allowing the Pipeline to assume an IAM role without long-lived access keys
- **IAM_Deploy_Role**: The AWS IAM role assumed by the Pipeline via OIDC federation, granting permissions to sync files to the S3_Bucket and invalidate the CloudFront_Distribution
- **S3_Bucket**: The Amazon S3 bucket storing the built Website files (bucket name: `warboysgutterclearing-website`)
- **CloudFront_Distribution**: The Amazon CloudFront CDN distribution serving the Website
- **Build_Output**: The static files produced by the `astro build` command, located in the `site/dist/` directory
- **GitHub_Secrets**: Encrypted environment variables stored in the GitHub repository settings, used to pass sensitive values to the Pipeline
- **GOOGLE_PLACES_API_KEY_Secret**: A GitHub_Secret containing the Google Places API key, made available to the build step as the `GOOGLE_PLACES_API_KEY` environment variable
- **GA_MEASUREMENT_ID_Secret**: A GitHub_Secret containing the Google Analytics measurement ID, made available to the build step as the `GA_MEASUREMENT_ID` environment variable
- **Manual_Trigger**: A `workflow_dispatch` event that allows a developer to re-run the deployment Pipeline on demand from the GitHub Actions UI
- **Test_Suite**: The Vitest test suite executed via `npm run test` within the `site/` directory
- **CloudFront_Invalidation**: An API call that clears the CloudFront edge cache so that updated content is served to visitors immediately after deployment

## Requirements

### Requirement 1: Automated Deployment on Push to Main

**User Story:** As a developer, I want the website to be automatically built and deployed when I push to the main branch, so that production is always up to date without manual intervention.

#### Acceptance Criteria

1. WHEN a push event occurs on the Main_Branch, THE Pipeline SHALL execute the full build and deploy sequence.
2. THE Pipeline SHALL execute the following steps in order: install dependencies, run the Test_Suite, build the Astro site, sync the Build_Output to the S3_Bucket, and create a CloudFront_Invalidation.
3. IF the Test_Suite fails, THEN THE Pipeline SHALL stop execution and not proceed to the build or deploy steps.
4. IF the build step fails, THEN THE Pipeline SHALL stop execution and not proceed to the deploy steps.

### Requirement 2: Pull Request Testing

**User Story:** As a developer, I want tests to run automatically on pull requests, so that I can catch issues before merging to main.

#### Acceptance Criteria

1. WHEN a Pull_Request targeting the Main_Branch is opened or updated, THE Pipeline SHALL install dependencies, run the Test_Suite, and build the Astro site.
2. THE Pipeline SHALL NOT sync files to the S3_Bucket or create a CloudFront_Invalidation for Pull_Request events.
3. WHEN the Test_Suite or build step fails on a Pull_Request, THE Pipeline SHALL report the failure status to the Pull_Request checks.

### Requirement 3: Manual Re-Deployment Trigger

**User Story:** As a developer, I want to manually trigger a deployment from the GitHub Actions UI, so that I can re-deploy the site without pushing a new commit.

#### Acceptance Criteria

1. THE Pipeline SHALL support a Manual_Trigger via the `workflow_dispatch` event.
2. WHEN a Manual_Trigger is activated, THE Pipeline SHALL execute the full build and deploy sequence identical to a push on the Main_Branch.

### Requirement 4: AWS Authentication via OIDC

**User Story:** As a developer, I want the pipeline to authenticate to AWS using OIDC federation, so that no long-lived access keys are stored in the repository.

#### Acceptance Criteria

1. THE Pipeline SHALL authenticate to AWS by assuming the IAM_Deploy_Role via the OIDC_Provider.
2. THE Pipeline SHALL NOT use long-lived AWS access keys (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY) stored as GitHub_Secrets.
3. THE IAM_Deploy_Role SHALL grant the minimum permissions required: `s3:PutObject`, `s3:DeleteObject`, and `s3:ListBucket` on the S3_Bucket, and `cloudfront:CreateInvalidation` on the CloudFront_Distribution.
4. THE OIDC_Provider trust policy SHALL restrict role assumption to the specific GitHub repository (`neil3k/gutter_website`) and the Main_Branch for deploy jobs.

### Requirement 5: Secure Handling of Environment Variables

**User Story:** As a developer, I want sensitive environment variables to be stored as GitHub Secrets and injected at build time, so that API keys and measurement IDs are not exposed in the repository.

#### Acceptance Criteria

1. THE Pipeline SHALL read the GOOGLE_PLACES_API_KEY_Secret and GA_MEASUREMENT_ID_Secret from GitHub_Secrets.
2. THE Pipeline SHALL pass the GOOGLE_PLACES_API_KEY_Secret as the `GOOGLE_PLACES_API_KEY` environment variable to the build step.
3. THE Pipeline SHALL pass the GA_MEASUREMENT_ID_Secret as the `GA_MEASUREMENT_ID` environment variable to the build step.
4. THE Pipeline SHALL NOT echo, print, or log the values of GitHub_Secrets in workflow output.

### Requirement 6: S3 Sync and CloudFront Invalidation

**User Story:** As a developer, I want the pipeline to sync the build output to S3 and invalidate the CloudFront cache, so that visitors see the latest version of the site immediately after deployment.

#### Acceptance Criteria

1. THE Pipeline SHALL sync the contents of the `site/dist/` directory to the root of the S3_Bucket using the `aws s3 sync` command with the `--delete` flag to remove stale files.
2. WHEN the S3 sync completes successfully, THE Pipeline SHALL create a CloudFront_Invalidation for the path `/*` to clear all cached content.
3. IF the S3 sync fails, THEN THE Pipeline SHALL stop execution and not create a CloudFront_Invalidation.

### Requirement 7: Terraform Exclusion

**User Story:** As a developer, I want the CI/CD pipeline to handle only site builds and deployments, so that Terraform infrastructure changes remain a deliberate, manual process.

#### Acceptance Criteria

1. THE Pipeline SHALL NOT execute any Terraform commands (plan, apply, destroy, or init).
2. THE Pipeline SHALL operate only within the `site/` directory for dependency installation, testing, and building.
