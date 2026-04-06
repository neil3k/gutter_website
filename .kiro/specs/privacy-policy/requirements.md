# Requirements Document

## Introduction

The Warboys Gutter Clearing website collects personal data through a contact form (name, email, telephone, address, message) and uses Google Analytics 4 with cookie consent for visitor analytics. As a UK-targeted business, the site must comply with the UK General Data Protection Regulation (UK GDPR) and the Privacy and Electronic Communications Regulations (PECR). This feature adds a dedicated privacy policy page that explains what data is collected, how it is used, who it is shared with, data retention periods, and visitor rights. The page uses the existing BaseLayout and matches the site's yellow/black design system.

## Glossary

- **Privacy_Page**: A dedicated page at the `/privacy` URL path that displays the full privacy policy content
- **Privacy_Policy_Content**: The static textual content of the privacy policy, covering data collection, usage, sharing, retention, and visitor rights
- **BaseLayout**: The root Astro layout component (`src/layouts/BaseLayout.astro`) that provides the HTML shell, Navigation, Footer, and StickyMobileCta for all pages
- **Footer**: The site-wide footer component displaying contact details, navigation links, and copyright
- **Visitor**: A person browsing the Website
- **Website**: The Warboys Gutter Clearing public-facing website
- **Contact_Form**: The form on the Contact page that collects name, email, telephone, address, and optional message from Visitors
- **GA4_Cookies**: The analytics cookies set by Google Analytics 4 after a Visitor accepts cookie consent
- **Data_Controller**: Warboys Gutter Clearing, the entity responsible for determining how personal data is processed
- **ICO**: The Information Commissioner's Office, the UK supervisory authority for data protection
- **Design_System**: The set of colours, typography, and visual style rules applied consistently across the Website (Primary_Colour #FFD200, Secondary_Colour #111111)

## Requirements

### Requirement 1: Privacy Policy Page

**User Story:** As a visitor, I want to read a clear privacy policy, so that I understand how my personal data is collected and used when I interact with the website.

#### Acceptance Criteria

1. THE Website SHALL serve the Privacy_Page at the URL path `/privacy`.
2. THE Privacy_Page SHALL use the BaseLayout component with the title "Privacy Policy".
3. THE Privacy_Page SHALL be a static Astro page file located at `src/pages/privacy.astro`.
4. THE Privacy_Page SHALL render the Privacy_Policy_Content as structured HTML with headings, paragraphs, and lists.

### Requirement 2: Privacy Policy Content — Data Collection

**User Story:** As a visitor, I want to know what personal data the website collects, so that I can make informed decisions about providing my information.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL identify the Data_Controller by business name and provide a contact email address.
2. THE Privacy_Policy_Content SHALL describe the personal data collected through the Contact_Form: name, email address, telephone number, postal address, and optional message.
3. THE Privacy_Policy_Content SHALL describe the data collected through GA4_Cookies: anonymised usage data including pages visited, visit duration, referral source, and device type.
4. THE Privacy_Policy_Content SHALL state that GA4_Cookies are only set after the Visitor provides explicit consent via the cookie consent banner.

### Requirement 3: Privacy Policy Content — Data Usage and Sharing

**User Story:** As a visitor, I want to know how my data is used and who it is shared with, so that I can trust the business with my information.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL state that Contact_Form data is used to respond to enquiries and provide quotes.
2. THE Privacy_Policy_Content SHALL state that analytics data is used to understand website traffic and improve the Website.
3. THE Privacy_Policy_Content SHALL list the third parties with whom data is shared: Google (for analytics via GA4) and Amazon Web Services (for hosting and email delivery via SES).
4. THE Privacy_Policy_Content SHALL state that personal data is not sold to third parties.

### Requirement 4: Privacy Policy Content — Data Retention

**User Story:** As a visitor, I want to know how long my data is kept, so that I understand the retention period for my personal information.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL state the retention period for Contact_Form submissions stored in the database.
2. THE Privacy_Policy_Content SHALL state the retention period for GA4 analytics data as configured in the Google Analytics property.
3. THE Privacy_Policy_Content SHALL state that cookie consent preferences are stored in the Visitor's browser localStorage until cleared by the Visitor.

### Requirement 5: Privacy Policy Content — Visitor Rights

**User Story:** As a visitor, I want to know my rights under UK GDPR, so that I can exercise control over my personal data.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL list the following Visitor rights under UK GDPR: right of access, right to rectification, right to erasure, right to restrict processing, right to data portability, and right to object.
2. THE Privacy_Policy_Content SHALL provide instructions for how a Visitor can exercise these rights, including a contact email address.
3. THE Privacy_Policy_Content SHALL inform the Visitor of the right to lodge a complaint with the ICO and provide the ICO website URL.

### Requirement 6: Privacy Policy Content — Cookies

**User Story:** As a visitor, I want to understand what cookies the website uses, so that I know what is stored on my device.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL list the types of cookies used by the Website: analytics cookies (GA4_Cookies) and consent preference storage (localStorage).
2. THE Privacy_Policy_Content SHALL explain that analytics cookies are only placed after explicit consent.
3. THE Privacy_Policy_Content SHALL explain how the Visitor can manage or delete cookies through browser settings.

### Requirement 7: Footer Privacy Link

**User Story:** As a visitor, I want a link to the privacy policy in the website footer, so that I can find the policy from any page.

#### Acceptance Criteria

1. THE Footer SHALL display a "Privacy Policy" link that navigates to the Privacy_Page at `/privacy`.
2. THE "Privacy Policy" link SHALL be positioned in the Footer quick links section alongside the existing navigation links.
3. THE "Privacy Policy" link SHALL use the same styling as the existing Footer navigation links.

### Requirement 8: Accessible and Plain Language

**User Story:** As a visitor, I want the privacy policy written in plain, accessible language, so that I can understand it without legal expertise.

#### Acceptance Criteria

1. THE Privacy_Policy_Content SHALL use plain English without legal jargon.
2. THE Privacy_Policy_Content SHALL use short paragraphs and bullet lists to aid readability.
3. THE Privacy_Page SHALL maintain a minimum colour contrast ratio of 4.5:1 for normal text and 3:1 for large text, consistent with the Design_System.
4. THE Privacy_Page SHALL use semantic HTML heading hierarchy (h1 for the page title, h2 for sections, h3 for subsections).

### Requirement 9: Visual Design Consistency

**User Story:** As a business owner, I want the privacy policy page to match the rest of the website's design, so that the brand experience is consistent.

#### Acceptance Criteria

1. THE Privacy_Page SHALL use the Design_System typography: Heading_Font for headings and Body_Font for body text.
2. THE Privacy_Page SHALL use the Design_System colours for text, backgrounds, and accent elements.
3. THE Privacy_Page SHALL include appropriate spacing and a maximum content width consistent with other pages on the Website.
