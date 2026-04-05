# Warboys Gutter Clearing Website

Static marketing website for Warboys Gutter Clearing, built with [Astro](https://astro.build/) and hosted on AWS (S3 + CloudFront), provisioned via [Terraform](https://www.terraform.io/).

## Project Structure

```
├── site/          # Astro static site
│   ├── src/
│   │   ├── components/    # Astro UI components
│   │   ├── data/          # Hardcoded testimonials fallback
│   │   ├── layouts/       # Base HTML layout
│   │   ├── lib/           # Build-time helpers (Google reviews fetch)
│   │   ├── pages/         # Route pages (index, contact)
│   │   └── styles/        # Global CSS and design tokens
│   └── public/            # Static assets (images, favicon)
├── infra/         # Terraform infrastructure
│   ├── main.tf            # Root module composition
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Outputs (CloudFront URL, S3 bucket)
│   ├── providers.tf       # AWS provider config
│   └── modules/           # S3, CloudFront, ACM, DNS modules
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Terraform](https://www.terraform.io/) (v1.0+)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GOOGLE_PLACE_ID` | Google Business Profile Place ID | No |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | No |

Both variables are used at build time to fetch live reviews from the Google Places API. If either is missing, the site falls back to hardcoded testimonials. No API keys are exposed in the built output.

## Development

```bash
cd site
npm install
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run test       # Run tests (Vitest)
```

## Deployment

1. Build the site:

   ```bash
   cd site
   npm run build
   ```

2. Provision infrastructure (first time or on changes):

   ```bash
   cd infra
   terraform init
   terraform plan
   terraform apply
   ```

   Required Terraform variables:
   - `hosted_zone_id` — existing Route 53 hosted zone ID
   - `domain_name` — apex domain (default: `warboysgutterclearing.co.uk`)
   - `bucket_name` — S3 bucket name (default: `warboysgutterclearing-website`)

3. Upload the built site to S3:

   ```bash
   aws s3 sync site/dist/ s3://<bucket-name> --delete
   ```

4. Invalidate the CloudFront cache:

   ```bash
   aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
   ```
