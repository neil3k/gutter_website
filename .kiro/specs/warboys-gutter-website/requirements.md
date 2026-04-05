# Requirements Document

## Introduction

Warboys Gutter Clearing is a local gutter cleaning business serving the Cambridgeshire area. Their current website is a minimal single-page site lacking modern design, contact functionality, imagery, and trust-building elements. This document defines the requirements for an improved website that better represents the business, makes it easy for potential customers to get in touch, and builds credibility through testimonials, service details, and professional presentation. The visual design follows an industrial "trade" aesthetic with a bold yellow-and-black colour scheme, high contrast, and thick interactive elements.

## Glossary

- **Website**: The improved Warboys Gutter Clearing public-facing website
- **Visitor**: A person browsing the Website
- **Contact_Form**: A form on the dedicated Contact_Page allowing Visitors to submit enquiries including name, email address, telephone number, address, and an optional message
- **Contact_Page**: A dedicated page of the Website accessible via the Navigation, containing the Contact_Form and business contact details
- **Navigation**: The site-wide menu allowing Visitors to move between sections and pages of the Website
- **Hero_Section**: The prominent banner area at the top of the homepage featuring a dark background, headline, trust bullets, dual CTAs, and a before/after gutter image
- **Services_Section**: The area of the Website describing the gutter clearing, downpipe unblocking, and downpipe gutter guard supply and installation services offered
- **About_Section**: The area of the Website describing the business background and approach
- **Testimonials_Section**: The area of the Website displaying customer reviews sourced from the Google_Business_Profile with a fallback to hardcoded testimonials
- **Google_Business_Profile**: The Google Business listing for Warboys Gutter Clearing, containing business information and customer reviews
- **Google_Places_API**: The Google Places API (New) used to fetch reviews and rating data for the Google_Business_Profile at build time
- **Place_ID**: A unique identifier assigned by Google to the Google_Business_Profile, configured via an environment variable
- **Build_Time_Review_Fetch**: The process during the Astro build that calls the Google_Places_API to retrieve the latest reviews and renders them as static HTML
- **Star_Rating**: The numeric rating (1 to 5) associated with a review or the overall Google_Business_Profile rating
- **Hardcoded_Testimonials**: A set of manually maintained customer testimonials stored in the Astro project source code, used as a fallback when the Google_Places_API is unavailable or returns insufficient reviews
- **Service_Area_Section**: The area of the Website showing the geographic coverage of the business
- **Footer**: The bottom section of every page containing contact details, links, and copyright
- **CTA**: A call-to-action element (button or link) prompting the Visitor to make contact or request a quote
- **Trust_Bar**: A horizontal strip displayed below the Hero_Section containing trust signal icons and labels
- **How_It_Works_Section**: The area of the Website displaying a three-step process explaining how the gutter clearing service works
- **Why_Choose_Us_Section**: The area of the Website highlighting the key differentiators and benefits of choosing Warboys Gutter Clearing
- **Before_After_Gallery**: The area of the Website displaying a grid of before-and-after gutter clearing images
- **Sticky_Mobile_CTA_Bar**: A fixed-position bar visible on mobile viewports containing quick-access call and quote buttons
- **Design_System**: The set of colours, typography, and visual style rules applied consistently across the Website
- **Primary_Colour**: The yellow colour (#FFD200) used for highlights, CTAs, and accent elements
- **Secondary_Colour**: The black colour (#111111) used for backgrounds, headings, and text
- **Hazard_Stripe_Accent**: A decorative visual motif inspired by industrial hazard stripes, using alternating yellow and black, applied as subtle accents throughout the Website
- **CTA_Banner**: A large, prominent call-to-action block with a Primary_Colour background positioned before the Footer, encouraging Visitors to get in touch
- **Heading_Font**: The bold sans-serif typeface (Oswald or Montserrat) used for all headings across the Website
- **Body_Font**: The clean sans-serif typeface (Open Sans) used for all body text across the Website
- **S3_Bucket**: An Amazon S3 bucket configured for static website hosting, storing the built Website files
- **CloudFront_Distribution**: An Amazon CloudFront CDN distribution serving the Website over HTTPS with edge caching
- **Terraform**: The Infrastructure as Code (IaC) tool used to provision and manage all AWS resources for the Website
- **Astro**: The static site generator framework used to build the Website into optimised static HTML, CSS, and JavaScript files
- **OAC**: Origin Access Control, the CloudFront mechanism that grants the CloudFront_Distribution read access to the S3_Bucket without making the bucket publicly accessible
- **Security_Headers**: HTTP response headers added by the CloudFront_Distribution to protect Visitors from common web vulnerabilities (Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy)
- **Price_Class_100**: The CloudFront pricing tier that limits edge locations to North America and Europe, providing the lowest cost for traffic originating in those regions
- **Route_53_Hosted_Zone**: The existing Amazon Route 53 hosted zone for the warboysgutterclearing.co.uk domain, containing DNS records that resolve the domain to the appropriate AWS resources
- **ACM_Certificate**: An AWS Certificate Manager TLS certificate provisioned in the us-east-1 region, used by the CloudFront_Distribution to serve the Website over HTTPS on the custom domain
- **DNS_Alias_Record**: A Route 53 alias record (A or AAAA) that maps a domain name directly to an AWS resource such as the CloudFront_Distribution, without requiring a static IP address
- **Apex_Domain**: The root domain warboysgutterclearing.co.uk without any subdomain prefix
- **WWW_Subdomain**: The www.warboysgutterclearing.co.uk subdomain

## Requirements

### Requirement 1: Responsive Layout

**User Story:** As a visitor, I want the website to display correctly on mobile, tablet, and desktop devices, so that I can browse comfortably on any device.

#### Acceptance Criteria

1. THE Website SHALL render a usable layout on viewports from 320px to 2560px wide.
2. WHEN the viewport width is below 768px, THE Navigation SHALL collapse into a toggleable mobile menu.
3. THE Website SHALL use a single-column layout on viewports below 768px and a multi-column layout on viewports at or above 768px.

### Requirement 2: Navigation

**User Story:** As a visitor, I want clear navigation, so that I can quickly find information about services, the business, and how to get in touch.

#### Acceptance Criteria

1. THE Navigation SHALL contain links to the following destinations: Home, Services, How It Works, Why Choose Us, Gallery, About, Testimonials, Service Area, and Contact Us.
2. WHEN a Visitor clicks a Navigation link for an on-page section, THE Website SHALL smooth-scroll to the corresponding section on the page.
3. WHEN a Visitor clicks the Contact Us Navigation link, THE Website SHALL navigate to the Contact_Page.
4. THE Navigation SHALL remain visible at the top of the viewport as the Visitor scrolls (sticky behaviour).

### Requirement 3: Hero Section

**User Story:** As a business owner, I want an eye-catching hero section, so that visitors immediately understand what the business offers and are compelled to get in touch.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a dark charcoal/black background (#111111) with Primary_Colour accent elements.
2. THE Hero_Section SHALL display the headline "Blocked Gutters? We Clear Them Fast." as the primary heading.
3. THE Hero_Section SHALL display the following trust bullets below the headline: "No Mess – Ground-Based Vacuum System", "Up To 4 Storeys – No Ladders Needed", and "Fully Insured Local Service".
4. THE Hero_Section SHALL display two CTAs: a "Get a Free Quote" button linking to the Contact_Form and a "Call Now" button displaying the business phone number and initiating a phone call via a tel: link.
5. THE Hero_Section SHALL include a before/after gutter image split visual showing the results of the gutter clearing service.
6. THE Hero_Section SHALL be the first visible content below the Navigation.

### Requirement 4: Trust Bar

**User Story:** As a visitor, I want to see trust signals immediately after the hero, so that I feel confident the business is reliable and professional.

#### Acceptance Criteria

1. THE Trust_Bar SHALL be positioned directly below the Hero_Section.
2. THE Trust_Bar SHALL display the following trust signals with accompanying icons: "Local & Reliable", "Fully Insured", "Easy Booking", and "Covering Cambridgeshire".
3. THE Trust_Bar SHALL display the trust signals in a horizontal row on desktop viewports and wrap to multiple rows on mobile viewports.

### Requirement 5: Services Section

**User Story:** As a visitor, I want to see a clear breakdown of services offered, so that I can understand what Warboys Gutter Clearing can do for me.

#### Acceptance Criteria

1. THE Services_Section SHALL list the following services: Gutter Clearing (debris removal from gutters), Downpipe Unblocking, and Supply and Installation of Downpipe Gutter Guards.
2. THE Services_Section SHALL use a white background with black line icons and Primary_Colour highlights for each service.
3. THE Services_Section SHALL describe the two gutter clearing methods: clearing by hand and clearing using the Predator specialist gutter vacuum.
4. THE Services_Section SHALL describe the capabilities of the Predator gutter vacuum: designed for wet and dry debris, reaches most 2-storey buildings, collects contents in a drum with no mess, and includes a high-resolution camera to verify gutters are fully cleared.
5. WHEN a Visitor views the Services_Section, THE Website SHALL display each service as a distinct card or block with a black line icon, a Primary_Colour highlight, and a short description.
6. THE Services_Section SHALL NOT list gutter repairs, fascia cleaning, soffit cleaning, or roof cleaning as offered services.

### Requirement 6: How It Works Section

**User Story:** As a visitor, I want to understand the booking and service process, so that I know what to expect when I hire Warboys Gutter Clearing.

#### Acceptance Criteria

1. THE How_It_Works_Section SHALL use a light grey background.
2. THE How_It_Works_Section SHALL display a three-step horizontal process on desktop viewports and a vertical stacked layout on mobile viewports.
3. THE How_It_Works_Section SHALL display the following steps: Step 1 "Book Your Slot" with the description "Call or message us", Step 2 "We Clear Your Gutters" with the description "Using high-powered vacuum systems", and Step 3 "Job Done – No Mess" with the description "All debris removed and disposed".
4. THE How_It_Works_Section SHALL display a numbered or icon indicator for each step.

### Requirement 7: Why Choose Us Section

**User Story:** As a visitor, I want to understand the advantages of choosing this business, so that I can compare the service against alternatives.

#### Acceptance Criteria

1. THE Why_Choose_Us_Section SHALL use a black (#111111) background with white text and Primary_Colour highlights.
2. THE Why_Choose_Us_Section SHALL display the following differentiators: "No ladders = safer & faster", "Reach awkward areas (extensions, conservatories)", "Friendly local & reliable", "Competitive pricing", and "Appointment reminders before arrival".
3. WHEN a Visitor views the Why_Choose_Us_Section, THE Website SHALL display each differentiator as a distinct item with an icon or visual indicator.

### Requirement 8: Before and After Gallery

**User Story:** As a visitor, I want to see visual proof of the gutter clearing results, so that I can trust the quality of the work.

#### Acceptance Criteria

1. THE Before_After_Gallery SHALL display a grid of 4 to 6 before-and-after gutter clearing images.
2. THE Before_After_Gallery SHALL apply Primary_Colour borders or hover effects to each image.
3. THE Before_After_Gallery SHALL label each image pair to distinguish the before state from the after state.
4. THE Before_After_Gallery SHALL use a responsive grid layout that adjusts from a single column on mobile to multiple columns on desktop.

### Requirement 9: About Section

**User Story:** As a visitor, I want to learn about the business, so that I can feel confident hiring a local, trustworthy company.

#### Acceptance Criteria

1. THE About_Section SHALL include a short paragraph describing the business background and approach.
2. THE About_Section SHALL mention that the business is local to the Cambridgeshire area.

### Requirement 10: Testimonials Section with Google Business Reviews

**User Story:** As a visitor, I want to read real reviews from Google alongside any additional testimonials, so that I can trust the quality of the service based on verified feedback.

#### Acceptance Criteria

1. WHEN the Astro build process runs, THE Build_Time_Review_Fetch SHALL call the Google_Places_API to retrieve the latest reviews for the Google_Business_Profile identified by the Place_ID.
2. THE Place_ID SHALL be configured via an environment variable named GOOGLE_PLACE_ID, and the Google_Places_API key SHALL be configured via an environment variable named GOOGLE_PLACES_API_KEY.
3. THE Testimonials_Section SHALL display the overall Star_Rating of the Google_Business_Profile as a numeric value and a visual star indicator.
4. THE Testimonials_Section SHALL display each Google review with the reviewer name, Star_Rating, review text, and relative time of the review.
5. THE Testimonials_Section SHALL display at least three reviews.
6. WHEN more than three reviews are present, THE Testimonials_Section SHALL allow the Visitor to browse through them using a carousel or paginated layout.
7. IF the Build_Time_Review_Fetch fails or returns fewer than three reviews, THEN THE Testimonials_Section SHALL fall back to displaying the Hardcoded_Testimonials.
8. IF the Build_Time_Review_Fetch succeeds with three or more reviews, THEN THE Testimonials_Section SHALL display the Google reviews and append any Hardcoded_Testimonials after them.
9. THE Testimonials_Section SHALL include a link to the Google_Business_Profile listing so that Visitors can read all reviews and leave a review of their own.
10. THE Build_Time_Review_Fetch SHALL store the fetched reviews as static data during the Astro build, ensuring no client-side API calls or API key exposure in the deployed Website.
11. IF the GOOGLE_PLACE_ID or GOOGLE_PLACES_API_KEY environment variable is not set, THEN THE Build_Time_Review_Fetch SHALL skip the API call and THE Testimonials_Section SHALL display only the Hardcoded_Testimonials.

### Requirement 11: Service Area Section

**User Story:** As a visitor, I want to see which areas the business covers, so that I can confirm the service is available in my location.

#### Acceptance Criteria

1. THE Service_Area_Section SHALL display a list or map of the geographic areas covered by the business within Cambridgeshire.
2. THE Service_Area_Section SHALL mention the primary coverage area including Warboys and surrounding villages and towns.

### Requirement 12: Contact Page

**User Story:** As a visitor, I want a dedicated contact page with a form and business details, so that I can easily get in touch to request a quote or ask a question.

#### Acceptance Criteria

1. THE Contact_Page SHALL display the Contact_Form with the following fields: name (required), email address (required), telephone number (required), address (required), and message (optional).
2. THE Contact_Page SHALL display the business phone number as a clickable tel: link.
3. THE Contact_Page SHALL display the business email address.
4. WHEN a Visitor submits the Contact_Form with all required fields completed, THE Website SHALL send the form data to the business.
5. IF a Visitor submits the Contact_Form with one or more required fields empty, THEN THE Contact_Form SHALL display a validation message identifying the missing fields.
6. WHEN the Contact_Form submission succeeds, THE Website SHALL display a confirmation message to the Visitor.

### Requirement 13: Footer

**User Story:** As a visitor, I want a consistent footer on every page, so that I can always find contact details and important links.

#### Acceptance Criteria

1. THE Footer SHALL appear on every page of the Website.
2. THE Footer SHALL display the business phone number, email address, and service area summary.
3. THE Footer SHALL display links to the Navigation destinations.
4. THE Footer SHALL display a copyright notice with the current year and business name.

### Requirement 14: Call-to-Action Sections

**User Story:** As a business owner, I want prominent call-to-action sections throughout the page, so that visitors are encouraged to get in touch at multiple points during their browsing.

#### Acceptance Criteria

1. THE Website SHALL display a large CTA section with a Primary_Colour (#FFD200) background positioned before the Footer on the homepage.
2. THE CTA section before the Footer SHALL contain a heading encouraging the Visitor to get in touch and buttons for "Get a Free Quote" linking to the Contact_Form and "Call Now" initiating a phone call via a tel: link.
3. THE Website SHALL display CTA elements within or after the Services_Section, How_It_Works_Section, and Testimonials_Section to encourage Visitor contact.

### Requirement 15: Visual Design and Theme

**User Story:** As a business owner, I want the website to have a bold, professional trade aesthetic, so that the brand feels trustworthy and stands out from competitors.

#### Acceptance Criteria

1. THE Design_System SHALL define the Primary_Colour as #FFD200 (yellow) and the Secondary_Colour as #111111 (black), with background colours of #FFFFFF (white) and #F5F5F5 (light grey).
2. THE Design_System SHALL specify bold sans-serif typefaces for headings (Oswald or Montserrat) and a clean sans-serif typeface for body text (Open Sans).
3. THE Website SHALL apply the Hazard_Stripe_Accent as subtle decorative elements on section dividers, borders, or accent bars.
4. THE Website SHALL use thick, high-contrast buttons with a minimum touch target of 44px by 44px for all CTA elements.
5. THE Website SHALL maintain a minimum colour contrast ratio of 4.5:1 for normal text and 3:1 for large text between foreground and background colours.
6. THE Design_System SHALL define consistent spacing, border-radius, and shadow values used across all components of the Website.

### Requirement 16: Sticky Mobile CTA Bar

**User Story:** As a mobile visitor, I want quick access to call or quote actions without scrolling, so that I can contact the business at any point during my visit.

#### Acceptance Criteria

1. WHEN the viewport width is below 768px, THE Sticky_Mobile_CTA_Bar SHALL be visible as a fixed bar at the bottom of the viewport.
2. THE Sticky_Mobile_CTA_Bar SHALL contain two buttons: "Call Now" initiating a phone call via a tel: link and "Get Quote" linking to the Contact_Form.
3. THE Sticky_Mobile_CTA_Bar SHALL use the Primary_Colour (#FFD200) background with Secondary_Colour (#111111) text for high visibility.
4. WHEN the viewport width is at or above 768px, THE Sticky_Mobile_CTA_Bar SHALL be hidden.
5. THE Sticky_Mobile_CTA_Bar SHALL remain visible above all other page content using a high z-index value.

### Requirement 17: Hosting and Infrastructure

**User Story:** As a business owner, I want the website hosted reliably on AWS with HTTPS and fast load times, so that visitors have a secure and responsive experience.

#### Acceptance Criteria

1. THE Terraform configuration SHALL provision an S3_Bucket to store the built Website files.
2. THE Terraform configuration SHALL provision a CloudFront_Distribution to serve the Website over HTTPS with edge caching.
3. THE CloudFront_Distribution SHALL use OAC to grant read access to the S3_Bucket without making the bucket publicly accessible.
4. THE CloudFront_Distribution SHALL add Security_Headers to all responses: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, and Referrer-Policy.
5. THE CloudFront_Distribution SHALL use Price_Class_100 to limit edge locations to North America and Europe.
6. THE Terraform configuration SHALL provision an ACM_Certificate in the us-east-1 region for the Apex_Domain and WWW_Subdomain.
7. THE Terraform configuration SHALL create DNS_Alias_Records in the Route_53_Hosted_Zone pointing the Apex_Domain and WWW_Subdomain to the CloudFront_Distribution.
8. WHEN a Visitor requests the WWW_Subdomain, THE CloudFront_Distribution SHALL redirect the request to the Apex_Domain.
