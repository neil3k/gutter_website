# Implementation Plan: Warboys Gutter Clearing Website

## Overview

Build a static marketing website for Warboys Gutter Clearing using Astro (TypeScript), hosted on AWS (S3 + CloudFront) provisioned via Terraform. The site has a single-page homepage with anchor-linked sections, a dedicated Contact page, build-time Google Places API integration for testimonials, and a bold yellow/black trade aesthetic. Tests use Vitest + fast-check.

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialise Astro project in `site/` directory
    - Create `site/` with `package.json`, `astro.config.mjs`, `tsconfig.json`
    - Configure Astro for static output mode
    - Add dependencies: `astro`, `vitest`, `fast-check`, `@astrojs/sitemap`
    - Create `public/images/` and `public/favicon.svg` placeholder
    - _Requirements: 17.1, 17.2_
  - [x] 1.2 Create Terraform directory structure in `infra/`
    - Create `infra/providers.tf` with AWS provider (default region + us-east-1 alias)
    - Create `infra/variables.tf` with `domain_name`, `hosted_zone_id`, `bucket_name` variables
    - Create `infra/outputs.tf` with CloudFront URL and S3 bucket name outputs
    - Create `infra/main.tf` as root module composition (empty module blocks for now)
    - Create module directories: `infra/modules/s3/`, `infra/modules/cloudfront/`, `infra/modules/acm/`, `infra/modules/dns/`
    - _Requirements: 17.1, 17.2, 17.3, 17.5, 17.6, 17.7_
  - [x] 1.3 Create `README.md` at project root
    - Document project structure, build commands, environment variables, and deployment steps
    - _Requirements: 10.2_

- [x] 2. Design system and global styles
  - [x] 2.1 Create `site/src/styles/global.css` with CSS custom properties and resets
    - Define all Design_System tokens: colours, typography, spacing, borders, shadows, CTA min size
    - Add CSS reset / normalize rules
    - Import Google Fonts (Oswald, Montserrat, Open Sans) via `@import` or document preconnect approach
    - _Requirements: 15.1, 15.2, 15.4, 15.5, 15.6_
  - [x] 2.2 Write property test for colour contrast compliance
    - **Property 10: Colour contrast compliance**
    - Generate all foreground/background colour pairs from the Design_System and verify contrast ratios meet WCAG thresholds (4.5:1 normal, 3:1 large)
    - **Validates: Requirements 15.5**

- [x] 3. Base layout component
  - [x] 3.1 Create `site/src/layouts/BaseLayout.astro`
    - Render `<html>`, `<head>` with meta tags, Open Graph tags, Google Fonts preconnect links, global CSS import
    - Accept `title` and optional `description` props for per-page SEO
    - Include `Navigation`, `StickyMobileCta`, and `Footer` component slots
    - Define `:root` CSS custom properties from Design_System
    - _Requirements: 1.1, 1.2, 1.3, 2.4, 13.1, 15.1, 15.2, 15.6_

- [x] 4. Navigation component
  - [x] 4.1 Create `site/src/components/Navigation.astro`
    - Sticky top bar with `position: sticky; top: 0; z-index: 1000`
    - Desktop: horizontal link list with all 9 destinations (Home, Services, How It Works, Why Choose Us, Gallery, About, Testimonials, Service Area, Contact Us)
    - Mobile (<768px): hamburger toggle with slide-down menu
    - Anchor links for on-page sections (`/#services`, `/#how-it-works`, etc.) with smooth-scroll
    - "Contact Us" links to `/contact`
    - Inline `<script>` for mobile toggle (no framework JS)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 1.2_

- [x] 5. Hero section component
  - [x] 5.1 Create `site/src/components/HeroSection.astro`
    - Dark background (#111111) with Primary_Colour accents
    - `<h1>` with "Blocked Gutters? We Clear Them Fast."
    - Three trust bullet `<li>` items with check/shield icons
    - Two CTA buttons: "Get a Free Quote" (`/contact`) and "Call Now" (`tel:PHONE`)
    - Before/after split image using CSS `clip-path` or side-by-side layout
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 6. Trust bar component
  - [x] 6.1 Create `site/src/components/TrustBar.astro`
    - Horizontal flex row of 4 trust signals with SVG icons
    - Items: "Local & Reliable", "Fully Insured", "Easy Booking", "Covering Cambridgeshire"
    - `flex-wrap: wrap` for mobile responsiveness
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 7. Services section component
  - [x] 7.1 Create `site/src/components/ServicesSection.astro`
    - White background, CSS grid of 3 service cards
    - Each card: black line SVG icon, Primary_Colour top border/accent, heading, short description
    - Services: Gutter Clearing, Downpipe Unblocking, Supply & Installation of Downpipe Gutter Guards
    - Describe hand clearing and Predator vacuum methods within Gutter Clearing card
    - Inline CTA link after the cards
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 14.3_
  - [x] 7.2 Write property test for excluded services
    - **Property 1: Excluded services never appear**
    - Verify rendered output never contains "gutter repair", "fascia cleaning", "soffit cleaning", or "roof cleaning" (case-insensitive)
    - **Validates: Requirements 5.6**

- [x] 8. How It Works component
  - [x] 8.1 Create `site/src/components/HowItWorks.astro`
    - Light grey (#F5F5F5) background
    - 3-step horizontal layout (desktop) / vertical stack (mobile)
    - Steps: "Book Your Slot" → "We Clear Your Gutters" → "Job Done – No Mess"
    - Numbered circles with Primary_Colour, connecting line/arrow on desktop
    - Inline CTA after the section
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 14.3_

- [x] 9. Why Choose Us component
  - [x] 9.1 Create `site/src/components/WhyChooseUs.astro`
    - Black (#111111) background, white text, Primary_Colour icon accents
    - 5 differentiator items in a grid/list with icons
    - Items: "No ladders = safer & faster", "Reach awkward areas", "Friendly local & reliable", "Competitive pricing", "Appointment reminders before arrival"
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 10. Before/After Gallery component
  - [x] 10.1 Create `site/src/components/BeforeAfterGallery.astro`
    - Responsive CSS grid: 1 column mobile, 2-3 columns desktop
    - 4-6 image pairs with "Before" / "After" labels
    - Primary_Colour border, hover scale effect
    - Images from `public/images/` as optimised formats
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 11. About section component
  - [x] 11.1 Create `site/src/components/AboutSection.astro`
    - Short paragraph about the business background and approach
    - Mention Cambridgeshire locality
    - _Requirements: 9.1, 9.2_

- [x] 12. Checkpoint - Core UI components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Google Places API integration and testimonials
  - [x] 13.1 Create `site/src/data/hardcoded-testimonials.ts`
    - Export array of at least 3 fallback `Review` objects matching the interface shape
    - Each with `authorName`, `rating`, `text`, `relativeTime`
    - _Requirements: 10.5, 10.7, 10.11_
  - [x] 13.2 Create `site/src/lib/google-reviews.ts`
    - Export `fetchGoogleReviews(): Promise<ReviewData>` function
    - Read `GOOGLE_PLACE_ID` and `GOOGLE_PLACES_API_KEY` from `import.meta.env`
    - If either missing → return hardcoded testimonials with `source: 'hardcoded'`
    - Call Google Places API (New) endpoint with field mask `reviews,rating` and `X-Goog-Api-Key` header
    - On failure, timeout (10s), or <3 reviews → fall back to hardcoded testimonials
    - On success (≥3 reviews) → return Google reviews with hardcoded appended, `source: 'google'`
    - Include `profileUrl` in returned data
    - _Requirements: 10.1, 10.2, 10.5, 10.7, 10.8, 10.10, 10.11_
  - [x] 13.3 Write property test for minimum review count invariant
    - **Property 3: Minimum review count invariant**
    - Generate random API response scenarios and verify output always has ≥3 reviews
    - **Validates: Requirements 10.5**
  - [x] 13.4 Write property test for review fetch fallback on unavailability
    - **Property 4: Review fetch fallback on unavailability**
    - Generate random failure scenarios (missing env vars, API errors, <3 reviews) and verify hardcoded fallback
    - **Validates: Requirements 10.7, 10.11**
  - [x] 13.5 Write property test for successful fetch appends hardcoded testimonials
    - **Property 5: Successful fetch appends hardcoded testimonials**
    - Generate random sets of ≥3 Google reviews and verify output starts with Google reviews and ends with hardcoded
    - **Validates: Requirements 10.8**
  - [x] 13.6 Write property test for no API key in build output
    - **Property 6: No API key in build output**
    - Generate random API key strings and verify they do not appear in any build output file content
    - **Validates: Requirements 10.10**

- [x] 14. Star Rating and Testimonials Section components
  - [x] 14.1 Create `site/src/components/StarRating.astro`
    - Accept `rating` number prop (1-5)
    - Render filled/empty star SVGs, support half-stars via `clip-path`
    - _Requirements: 10.3_
  - [x] 14.2 Create `site/src/components/TestimonialsSection.astro`
    - Receive `ReviewData` as a prop
    - Display overall Star_Rating (numeric + visual stars via StarRating component)
    - Render review cards: reviewer name, star rating, text, relative time
    - CSS scroll carousel or paginated view for >3 reviews
    - Link to Google Business Profile listing
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.9_
  - [x] 14.3 Write property test for review rendering completeness
    - **Property 2: Review rendering completeness**
    - Generate random Review objects and verify all fields (authorName, rating, text, relativeTime) appear in rendered output
    - **Validates: Requirements 10.4**

- [x] 15. Service Area and CTA Banner components
  - [x] 15.1 Create `site/src/components/ServiceAreaSection.astro`
    - List covered towns/villages in Cambridgeshire
    - Mention Warboys as primary base
    - _Requirements: 11.1, 11.2_
  - [x] 15.2 Create `site/src/components/CtaBanner.astro`
    - Full-width Primary_Colour (#FFD200) background
    - Heading + two CTA buttons (Get a Free Quote, Call Now)
    - Hazard_Stripe_Accent top/bottom border
    - _Requirements: 14.1, 14.2, 15.3_

- [x] 16. Footer and Sticky Mobile CTA components
  - [x] 16.1 Create `site/src/components/Footer.astro`
    - Dark background, white text
    - Phone (tel: link), email, service area summary
    - Navigation links mirroring main Navigation
    - Copyright with dynamic current year via Astro build
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - [x] 16.2 Create `site/src/components/StickyMobileCta.astro`
    - `position: fixed; bottom: 0; z-index: 1100`
    - Two buttons: "Call Now" (tel:) and "Get Quote" (/contact)
    - Primary_Colour background, Secondary_Colour text
    - Hidden on viewports ≥768px via CSS media query
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [x] 17. Contact Form component
  - [x] 17.1 Create `site/src/components/ContactForm.astro`
    - HTML `<form>` with fields: name, email, tel, address (all required), message (optional)
    - Client-side validation via HTML5 `required` + `type` attributes
    - `fetch()` POST to configurable form action URL on submit
    - Inline validation messages for missing required fields
    - Success confirmation message on successful submission
    - Error message with phone fallback on endpoint failure
    - _Requirements: 12.1, 12.4, 12.5, 12.6_
  - [x] 17.2 Write property test for contact form validation rejects incomplete submissions
    - **Property 7: Contact form validation rejects incomplete submissions**
    - Generate random ContactFormData with at least one required field empty and verify validation fails identifying correct missing fields
    - **Validates: Requirements 12.5**
  - [x] 17.3 Write property test for valid contact form submission sends data
    - **Property 8: Valid contact form submission sends data**
    - Generate random valid ContactFormData and verify submission handler calls endpoint with correct payload
    - **Validates: Requirements 12.4**

- [x] 18. Checkpoint - All components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Assemble pages
  - [x] 19.1 Create `site/src/pages/index.astro`
    - Use `BaseLayout`
    - Call `fetchGoogleReviews()` in frontmatter (build time)
    - Render sections in order: HeroSection → TrustBar → ServicesSection → (inline CTA) → HowItWorks → (inline CTA) → WhyChooseUs → BeforeAfterGallery → AboutSection → TestimonialsSection → (inline CTA) → ServiceAreaSection → CtaBanner
    - Add `id` attributes to each section for anchor navigation
    - _Requirements: 1.1, 1.3, 2.2, 3.6, 4.1, 14.3_
  - [x] 19.2 Create `site/src/pages/contact.astro`
    - Use `BaseLayout` with title "Contact Us"
    - Render ContactForm + business phone (tel: link) and email details
    - _Requirements: 12.1, 12.2, 12.3_

- [x] 20. SEO: sitemap, robots.txt, and meta tags
  - [x] 20.1 Configure Astro sitemap integration and create `public/robots.txt`
    - Enable `@astrojs/sitemap` in `astro.config.mjs` with site URL
    - Create `robots.txt` allowing all crawlers and referencing sitemap
    - Verify Open Graph meta tags are set in BaseLayout for homepage and contact page
    - _Requirements: 1.1_

- [x] 21. Terraform modules
  - [x] 21.1 Implement S3 module (`infra/modules/s3/`)
    - Create private S3 bucket (block all public access)
    - Configure bucket policy for CloudFront OAC read access
    - Variables: `bucket_name`, `cloudfront_distribution_arn`
    - Outputs: `bucket_id`, `bucket_regional_domain_name`
    - _Requirements: 17.1, 17.3_
  - [x] 21.2 Implement ACM module (`infra/modules/acm/`)
    - Provision ACM certificate in us-east-1 for apex domain + www SAN
    - DNS validation with Route 53
    - `create_before_destroy` lifecycle
    - Variables: `domain_name`, `zone_id`
    - Outputs: `certificate_arn`
    - _Requirements: 17.6_
  - [x] 21.3 Implement CloudFront module (`infra/modules/cloudfront/`)
    - CloudFront distribution with S3 OAC origin
    - `Price_Class_100`, custom domain aliases (apex + www)
    - ACM certificate reference, default root object `index.html`
    - Custom error response: 404 → `/404.html`
    - Response headers policy for Security_Headers (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy)
    - www → apex redirect via CloudFront Function
    - Variables: `s3_bucket_regional_domain`, `s3_bucket_id`, `acm_certificate_arn`, `domain_name`, `aliases`
    - Outputs: `distribution_domain_name`, `distribution_hosted_zone_id`, `distribution_arn`
    - _Requirements: 17.2, 17.3, 17.4, 17.5, 17.8_
  - [x] 21.4 Implement DNS module (`infra/modules/dns/`)
    - A and AAAA alias records for apex and www pointing to CloudFront
    - Variables: `zone_id`, `domain_name`, `cloudfront_distribution_domain_name`, `cloudfront_distribution_hosted_zone_id`
    - _Requirements: 17.7_
  - [x] 21.5 Wire modules together in `infra/main.tf`
    - Compose all modules with correct variable passing and dependencies
    - Ensure ACM is created before CloudFront, DNS after CloudFront
    - _Requirements: 17.1, 17.2, 17.3, 17.5, 17.6, 17.7_
  - [x] 21.6 Write property test for security headers completeness
    - **Property 11: Security headers completeness**
    - Validate the Terraform CloudFront response headers policy resource includes all 5 required security headers
    - **Validates: Requirements 17.4**

- [x] 22. Checkpoint - Infrastructure complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 23. Unit tests for component content
  - [x] 23.1 Create `site/src/components/__tests__/content-checks.test.ts`
    - Test Navigation contains all 9 required links (Req 2.1)
    - Test Hero section contains correct heading, trust bullets, and CTAs (Req 3.2, 3.3, 3.4)
    - Test Trust bar contains all 4 trust signals (Req 4.2)
    - Test Services section lists correct services and methods (Req 5.1, 5.3, 5.4, 5.5)
    - Test How It Works displays correct steps (Req 6.3, 6.4)
    - Test Why Choose Us displays all differentiators (Req 7.2, 7.3)
    - Test Footer contains phone, email, nav links, copyright (Req 13.1-13.4)
    - Test CTA banner contains correct buttons (Req 14.1, 14.2)
    - Test StarRating renders correct number of filled stars for rating values 1-5 (Req 10.3)
    - _Requirements: 2.1, 3.2, 3.3, 3.4, 4.2, 5.1, 5.3, 5.4, 5.5, 6.3, 6.4, 7.2, 7.3, 10.3, 13.1, 13.2, 13.3, 13.4, 14.1, 14.2_
  - [x] 23.2 Create `site/src/lib/__tests__/google-reviews.test.ts`
    - Unit test: returns hardcoded testimonials when env vars missing (Req 10.11)
    - Unit test: returns hardcoded testimonials on API error (Req 10.7)
    - Unit test: returns hardcoded testimonials when <3 reviews returned (Req 10.7)
    - Unit test: returns Google reviews + hardcoded appended on success (Req 10.8)
    - Unit test: reads from correct env vars (Req 10.2)
    - _Requirements: 10.2, 10.7, 10.8, 10.11_
  - [x] 23.3 Create `site/src/lib/__tests__/contact-form-validation.test.ts`
    - Unit test: rejects submission with missing required fields (Req 12.5)
    - Unit test: accepts submission with all required fields valid (Req 12.4)
    - Unit test: rejects invalid email format (Req 12.5)
    - _Requirements: 12.4, 12.5_
  - [x] 23.4 Write CTA touch target property test
    - **Property 9: CTA touch target minimum size**
    - Verify all CTA button elements maintain ≥44px dimensions
    - **Validates: Requirements 15.4**

- [x] 24. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The site uses TypeScript throughout; tests use Vitest + fast-check
- Placeholder images should be used in `public/images/` until real before/after photos are provided
