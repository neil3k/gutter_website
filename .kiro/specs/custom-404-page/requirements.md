# Requirements Document

## Introduction

The Warboys Gutter Clearing website currently has no custom 404 error page. When a visitor navigates to a non-existent URL, the CloudFront distribution serves `/404.html` (already configured in the Terraform CloudFront module), but no corresponding `404.astro` page exists in the Astro project. This results in a raw error or blank page. This feature adds a branded, accessible 404 page that matches the site's yellow/black trade aesthetic, reassures the visitor, and provides clear navigation paths back to useful content.

## Glossary

- **Website**: The Warboys Gutter Clearing public-facing website
- **Visitor**: A person browsing the Website
- **Error_Page**: The custom 404 page displayed when a Visitor requests a URL that does not exist on the Website
- **Navigation**: The site-wide sticky top navigation bar included via BaseLayout
- **Footer**: The site-wide footer included via BaseLayout
- **BaseLayout**: The root Astro layout component that renders the HTML shell, Navigation, Footer, StickyMobileCta, global styles, and meta tags
- **Design_System**: The set of colours, typography, spacing, and visual style tokens defined as CSS custom properties in global.css
- **Primary_Colour**: The yellow colour (#FFD200) used for highlights, CTAs, and accent elements
- **Secondary_Colour**: The black colour (#111111) used for backgrounds, headings, and text
- **Contact_Page**: The dedicated contact page at `/contact` containing the contact form and business details
- **Homepage**: The main landing page at `/` containing all service sections
- **CloudFront_Distribution**: The Amazon CloudFront CDN distribution serving the Website, already configured to return `/404.html` with a 404 status code for missing resources

## Requirements

### Requirement 1: Error Page Existence and Routing

**User Story:** As a visitor, I want to see a helpful branded page when I navigate to a URL that does not exist, so that I understand the page is missing and can find my way back to useful content.

#### Acceptance Criteria

1. THE Website SHALL include a `404.astro` page in the `src/pages/` directory that Astro builds to `/404.html` in the output.
2. WHEN a Visitor requests a URL that does not correspond to any page on the Website, THE CloudFront_Distribution SHALL serve the Error_Page with an HTTP 404 status code.
3. THE Error_Page SHALL use the BaseLayout component, rendering the Navigation, Footer, and StickyMobileCta consistently with all other pages of the Website.

### Requirement 2: Error Page Content

**User Story:** As a visitor who has landed on a missing page, I want a clear and friendly message explaining the situation, so that I do not feel confused or frustrated.

#### Acceptance Criteria

1. THE Error_Page SHALL display a prominent heading indicating the page was not found.
2. THE Error_Page SHALL display a short, friendly message explaining that the requested page does not exist or may have been moved.
3. THE Error_Page SHALL display a primary CTA button labelled "Back to Homepage" that links to the Homepage at `/`.
4. THE Error_Page SHALL display a secondary CTA button labelled "Contact Us" that links to the Contact_Page at `/contact`.
5. THE Error_Page SHALL display the "404" error code as a large visual element to clearly communicate the error type to the Visitor.

### Requirement 3: Visual Design Consistency

**User Story:** As a business owner, I want the 404 page to match the rest of the site's trade aesthetic, so that the brand feels consistent even when something goes wrong.

#### Acceptance Criteria

1. THE Error_Page SHALL use the Design_System colour tokens: Primary_Colour for accents and CTA highlights, Secondary_Colour for text and background elements.
2. THE Error_Page SHALL use the Design_System typography tokens: heading font (Oswald/Montserrat) for headings and body font (Open Sans) for descriptive text.
3. THE Error_Page SHALL use the Design_System spacing, border-radius, and shadow tokens for layout and component styling.
4. THE Error_Page CTA buttons SHALL use the existing `.cta-button`, `.cta-button--primary`, and `.cta-button--secondary` CSS classes defined in global.css.

### Requirement 4: Accessibility

**User Story:** As a visitor using assistive technology, I want the 404 page to be fully accessible, so that I can understand the error and navigate away regardless of how I browse.

#### Acceptance Criteria

1. THE Error_Page SHALL maintain a minimum colour contrast ratio of 4.5:1 for normal text and 3:1 for large text between all foreground and background colour pairs.
2. THE Error_Page CTA buttons SHALL have a minimum touch target size of 44px by 44px.
3. THE Error_Page SHALL use semantic HTML elements: a single `<h1>` for the main heading, paragraph elements for descriptive text, and anchor elements for navigation links.
4. THE Error_Page SHALL set a descriptive page title via the BaseLayout `title` prop that includes "Page Not Found" for screen reader and browser tab clarity.

### Requirement 5: Responsive Layout

**User Story:** As a mobile visitor, I want the 404 page to display correctly on any screen size, so that I can read the message and navigate away on any device.

#### Acceptance Criteria

1. THE Error_Page SHALL render a usable, vertically stacked layout on viewports from 320px to 2560px wide.
2. THE Error_Page content SHALL be horizontally centred within the viewport on all screen sizes.
3. WHEN the viewport width is below 768px, THE Error_Page CTA buttons SHALL stack vertically and expand to fill the available width up to a maximum of 320px.

### Requirement 6: SEO and Meta

**User Story:** As a business owner, I want the 404 page to have correct meta information, so that search engines handle the error correctly and do not index the error page as real content.

#### Acceptance Criteria

1. THE Error_Page SHALL include a `<meta name="robots" content="noindex">` tag to prevent search engines from indexing the Error_Page.
2. THE Error_Page SHALL set the page title to "Page Not Found" via the BaseLayout `title` prop, rendering as "Page Not Found | Warboys Gutter Clearing" in the browser tab.
