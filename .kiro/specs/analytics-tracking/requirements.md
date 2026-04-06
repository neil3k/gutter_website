# Requirements Document

## Introduction

The Warboys Gutter Clearing website needs visitor analytics so the business owner can understand traffic volumes, referral sources, and page views. Google Analytics 4 (GA4) is the chosen analytics platform. Because the site targets UK visitors, it must comply with GDPR and PECR regulations — meaning analytics cookies cannot be set until the visitor gives explicit consent. This feature adds the GA4 tracking script to the site, gated behind a cookie consent banner that matches the existing yellow/black design system.

## Glossary

- **GA4_Script**: The Google Analytics 4 measurement JavaScript snippet (`gtag.js`) that sends page view and event data to Google Analytics
- **Measurement_ID**: The GA4 property identifier (format `G-XXXXXXXXXX`) used to configure the GA4_Script, provided via the `PUBLIC_GA_MEASUREMENT_ID` environment variable
- **Cookie_Consent_Banner**: A UI banner displayed to Visitors who have not yet recorded a consent preference, requesting permission to load analytics cookies
- **Consent_Preference**: The Visitor's recorded choice (accepted or rejected) regarding analytics cookies, stored in the browser's localStorage
- **BaseLayout**: The root Astro layout component (`src/layouts/BaseLayout.astro`) that provides the HTML shell for all pages
- **Visitor**: A person browsing the Website
- **Website**: The Warboys Gutter Clearing public-facing website
- **Design_System**: The set of colours, typography, and visual style rules applied consistently across the Website (Primary_Colour #FFD200, Secondary_Colour #111111)
- **localStorage**: The browser Web Storage API used to persist the Consent_Preference across sessions without expiry

## Requirements

### Requirement 1: GA4 Script Injection

**User Story:** As a business owner, I want Google Analytics 4 tracking on my website, so that I can monitor visitor traffic, page views, and referral sources.

#### Acceptance Criteria

1. WHEN the Measurement_ID environment variable is set and the Visitor has accepted the Consent_Preference, THE BaseLayout SHALL inject the GA4_Script into the page `<head>`.
2. THE GA4_Script SHALL use the Measurement_ID value from the `PUBLIC_GA_MEASUREMENT_ID` environment variable to configure the `gtag('config', ...)` call.
3. IF the `PUBLIC_GA_MEASUREMENT_ID` environment variable is not set, THEN THE BaseLayout SHALL not inject the GA4_Script and SHALL not render the Cookie_Consent_Banner.
4. WHEN the GA4_Script is injected, THE GA4_Script SHALL load the `gtag.js` library from `https://www.googletagmanager.com/gtag/js` and initialise the data layer.

### Requirement 2: Cookie Consent Banner

**User Story:** As a visitor, I want to be asked for consent before analytics cookies are set, so that my privacy is respected in accordance with UK GDPR and PECR regulations.

#### Acceptance Criteria

1. WHEN a Visitor loads any page and the Consent_Preference is not stored in localStorage and the Measurement_ID is set, THE Website SHALL display the Cookie_Consent_Banner.
2. THE Cookie_Consent_Banner SHALL display a clear message explaining that the Website uses cookies for analytics purposes.
3. THE Cookie_Consent_Banner SHALL display an "Accept" button and a "Reject" button.
4. WHEN the Visitor clicks the "Accept" button, THE Cookie_Consent_Banner SHALL store the Consent_Preference as "accepted" in localStorage, dismiss the banner, and load the GA4_Script.
5. WHEN the Visitor clicks the "Reject" button, THE Cookie_Consent_Banner SHALL store the Consent_Preference as "rejected" in localStorage and dismiss the banner without loading the GA4_Script.
6. WHEN a Visitor loads any page and the Consent_Preference is stored as "accepted" in localStorage and the Measurement_ID is set, THE Website SHALL load the GA4_Script without displaying the Cookie_Consent_Banner.
7. WHEN a Visitor loads any page and the Consent_Preference is stored as "rejected" in localStorage, THE Website SHALL not load the GA4_Script and SHALL not display the Cookie_Consent_Banner.

### Requirement 3: Consent Banner Design

**User Story:** As a business owner, I want the cookie consent banner to match the site's visual identity, so that it feels like a natural part of the website rather than a jarring overlay.

#### Acceptance Criteria

1. THE Cookie_Consent_Banner SHALL use the Design_System colours: Secondary_Colour (#111111) background with Primary_Colour (#FFD200) accent elements.
2. THE Cookie_Consent_Banner SHALL use the Design_System typography: Heading_Font for the banner heading (if present) and Body_Font for the message text.
3. THE Cookie_Consent_Banner SHALL be positioned fixed at the bottom of the viewport.
4. THE Cookie_Consent_Banner SHALL be displayed above the Sticky_Mobile_CTA_Bar on mobile viewports (z-index higher than 1100).
5. THE "Accept" button SHALL use the Primary_Colour (#FFD200) background with Secondary_Colour (#111111) text, matching the existing CTA button style.
6. THE "Reject" button SHALL use a transparent or subtle style that is visually distinct from the "Accept" button while remaining clearly clickable.
7. THE Cookie_Consent_Banner SHALL maintain a minimum touch target of 44px by 44px for both buttons.
8. THE Cookie_Consent_Banner SHALL be accessible, with appropriate ARIA attributes and keyboard navigability.

### Requirement 4: Consent Persistence

**User Story:** As a visitor, I want my cookie preference to be remembered across sessions, so that I am not asked for consent every time I visit the site.

#### Acceptance Criteria

1. THE Website SHALL store the Consent_Preference in localStorage under a consistent key name.
2. THE Consent_Preference stored in localStorage SHALL be one of two values: "accepted" or "rejected".
3. WHEN a Visitor returns to the Website, THE Website SHALL read the Consent_Preference from localStorage and apply the stored preference without displaying the Cookie_Consent_Banner.
4. THE Website SHALL not use cookies to store the Consent_Preference itself (localStorage only).

### Requirement 5: Privacy and Compliance

**User Story:** As a business owner, I want the analytics implementation to comply with UK GDPR and PECR, so that the business avoids regulatory penalties.

#### Acceptance Criteria

1. THE Website SHALL not load the GA4_Script or set any analytics cookies before the Visitor has explicitly accepted the Consent_Preference.
2. THE Cookie_Consent_Banner message SHALL inform the Visitor about the purpose of the cookies (analytics/traffic measurement).
3. THE "Reject" option SHALL be equally accessible and prominent as the "Accept" option in terms of button size and placement (no dark patterns).
4. THE GA4_Script SHALL configure `analytics_storage` as `'denied'` by default and update to `'granted'` only after the Visitor accepts consent.
