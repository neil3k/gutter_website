# Requirements Document

## Introduction

This document defines the requirements for updating textual content across the Warboys Gutter Clearing Astro website. The updates align the site copy with the business owner's refreshed brand messaging, emphasising the family-run, local, and reliable nature of the business. Changes span the hero section, about section, services section, "Why Choose Us" section, CTA banner, contact page, and the centralised services data file.

## Glossary

- **HeroSection**: The Astro component (`HeroSection.astro`) that renders the top-of-page hero area on the homepage, including the headline, tagline, welcome text, trust bullets, and call-to-action buttons.
- **AboutSection**: The Astro component (`AboutSection.astro`) that renders the "About Warboys Gutter Clearing" paragraph on the homepage.
- **ServicesSection**: The Astro component (`ServicesSection.astro`) that renders the grid of service cards on the homepage.
- **WhyChooseUs**: The Astro component (`WhyChooseUs.astro`) that renders the list of differentiator items on the homepage.
- **CtaBanner**: The Astro component (`CtaBanner.astro`) that renders the full-width call-to-action banner on the homepage.
- **ContactPage**: The Astro page (`contact.astro`) that renders the contact form and introductory text.
- **BusinessData**: The TypeScript data file (`business-info.ts`) that exports the `businessInfo` object containing service definitions and business metadata.
- **ServiceInfo**: The TypeScript interface defining a service entry with `name` (string) and `description` (string) fields.

## Requirements

### Requirement 1: Hero Section Tagline and Welcome Text

**User Story:** As a site visitor, I want to see a clear tagline and welcome message in the hero section, so that I immediately understand the business identity and offering.

#### Acceptance Criteria

1. WHEN the homepage is rendered, THE HeroSection SHALL display the tagline text "Local. Reliable. Family Run." below the main heading.
2. WHEN the homepage is rendered, THE HeroSection SHALL display a welcome paragraph starting with "Welcome to Warboys Gutter Clearing" below the tagline.
3. WHEN the homepage is rendered, THE HeroSection SHALL preserve the existing heading, trust bullets, and call-to-action buttons unchanged.

### Requirement 2: About Section Copy

**User Story:** As a site visitor, I want to read an updated about paragraph, so that I understand the business is family-run and locally focused.

#### Acceptance Criteria

1. WHEN the homepage is rendered, THE AboutSection SHALL display a paragraph containing the text "friendly, family-run business".
2. WHEN the homepage is rendered, THE AboutSection SHALL display a paragraph containing the text "reliable, professional service with a personal touch".

### Requirement 3: Services Data Update

**User Story:** As a developer, I want the services data file to contain exactly 4 service entries with updated descriptions, so that all service-dependent components render the correct information.

#### Acceptance Criteria

1. THE BusinessData SHALL export a services array containing exactly 4 ServiceInfo entries.
2. THE BusinessData SHALL include a service with the name "Gutter Clearing".
3. THE BusinessData SHALL include a service with the name "Gutter Guard Installation".
4. THE BusinessData SHALL include a service with the name "Downpipe Clearing & Minor Maintenance".
5. THE BusinessData SHALL include a service with the name "Domestic & Small Commercial Properties".
6. THE BusinessData SHALL ensure each ServiceInfo entry has a non-empty name and a non-empty description.

### Requirement 4: Services Section Rendering

**User Story:** As a site visitor, I want to see 4 service cards on the homepage, so that I understand the full range of services offered.

#### Acceptance Criteria

1. WHEN the homepage is rendered, THE ServicesSection SHALL display exactly 4 service cards.
2. WHEN the homepage is rendered, THE ServicesSection SHALL display each service card with a heading matching the corresponding ServiceInfo name.
3. WHEN the homepage is rendered, THE ServicesSection SHALL display each service card with a description matching the corresponding ServiceInfo description.

### Requirement 5: Why Choose Us Section

**User Story:** As a site visitor, I want to see updated differentiator items, so that I understand the key reasons to choose this business.

#### Acceptance Criteria

1. WHEN the homepage is rendered, THE WhyChooseUs SHALL display exactly 5 differentiator items.
2. WHEN the homepage is rendered, THE WhyChooseUs SHALL include the item "Family-run and well established".
3. WHEN the homepage is rendered, THE WhyChooseUs SHALL include the item "Friendly, honest, and reliable".
4. WHEN the homepage is rendered, THE WhyChooseUs SHALL include the item "Local to Warboys — we care about our community".
5. WHEN the homepage is rendered, THE WhyChooseUs SHALL include the item "Fully insured for your peace of mind".
6. WHEN the homepage is rendered, THE WhyChooseUs SHALL include the item "Modern equipment for a thorough clean every time".

### Requirement 6: CTA Banner Copy

**User Story:** As a site visitor, I want to see an updated CTA message about overflowing gutters, so that I feel motivated to get in touch.

#### Acceptance Criteria

1. WHEN the homepage is rendered, THE CtaBanner SHALL display a paragraph containing the text "Whether your gutters are overflowing, blocked with moss and leaves, or you just want to stay on top of maintenance".
2. WHEN the homepage is rendered, THE CtaBanner SHALL preserve the existing "Get a Free Quote" and "Call Now" action buttons.

### Requirement 7: Contact Page Intro Text

**User Story:** As a site visitor, I want to see an updated introduction on the contact page, so that I am encouraged to request a free quote.

#### Acceptance Criteria

1. WHEN the contact page is rendered, THE ContactPage SHALL display an introductory paragraph containing the text "Contact us today for a free quote".

### Requirement 8: Data Integrity and Build Stability

**User Story:** As a developer, I want the content updates to preserve the existing data interfaces and build process, so that no regressions are introduced.

#### Acceptance Criteria

1. THE BusinessData SHALL preserve the existing ServiceInfo interface with `name` (string) and `description` (string) fields unchanged.
2. WHEN the site is built after content updates, THE Astro build process SHALL complete without errors.
3. WHEN the site is built after content updates, THE JSON-LD structured data SHALL include all 4 service entries from the BusinessData.
