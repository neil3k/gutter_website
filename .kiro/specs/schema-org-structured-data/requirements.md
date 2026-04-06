# Requirements Document

## Introduction

The Warboys Gutter Clearing website currently lacks Schema.org structured data, which limits its visibility in Google rich results and local search. This feature adds JSON-LD structured data to the site, covering LocalBusiness information, service descriptions, aggregate ratings from Google reviews, and breadcrumb navigation. All structured data is rendered server-side at build time and injected into the page `<head>` as `<script type="application/ld+json">` blocks. Business details are maintained in a single central data file to ensure consistency across the site.

## Glossary

- **Website**: The Warboys Gutter Clearing Astro static site
- **JSON_LD_Block**: A `<script type="application/ld+json">` element containing Schema.org structured data serialised as JSON
- **Business_Data_File**: A central TypeScript data file (`src/data/business-info.ts`) exporting all business details (name, address, phone, email, URLs, service area, services)
- **LocalBusiness_Schema**: A Schema.org LocalBusiness JSON-LD object describing the business identity, contact details, address, service area, and aggregate rating
- **Service_Schema**: A Schema.org Service JSON-LD object describing an individual service offered by the business
- **AggregateRating_Schema**: A Schema.org AggregateRating JSON-LD object summarising the overall review rating and count
- **BreadcrumbList_Schema**: A Schema.org BreadcrumbList JSON-LD object describing the navigation path to the current page
- **Homepage**: The index page (`src/pages/index.astro`) of the Website
- **Contact_Page**: The contact page (`src/pages/contact.astro`) of the Website
- **ReviewData**: The build-time review data object returned by `fetchGoogleReviews()`, containing `overallRating`, `reviews` array, `source`, and `profileUrl`
- **SchemaGenerator**: A TypeScript module (`src/lib/schema.ts`) that exports functions to build Schema.org JSON-LD objects from the Business_Data_File and ReviewData
- **BaseLayout**: The root Astro layout component (`src/layouts/BaseLayout.astro`) used by all pages

## Requirements

### Requirement 1: Central Business Data File

**User Story:** As a developer, I want all business details stored in a single data file, so that structured data and site content stay consistent and are easy to update.

#### Acceptance Criteria

1. THE Business_Data_File SHALL export the following business details: business name, street address, locality, region, postal code, country, telephone number, email address, website URL, and Google Business Profile URL.
2. THE Business_Data_File SHALL export a list of service area localities as an array of strings.
3. THE Business_Data_File SHALL export a list of services offered, each with a name and short description.
4. THE Business_Data_File SHALL be the single source of truth for business details used in all JSON_LD_Blocks.

### Requirement 2: LocalBusiness Schema on Homepage

**User Story:** As a business owner, I want LocalBusiness structured data on the homepage, so that Google can display rich business information in search results.

#### Acceptance Criteria

1. WHEN the Homepage is rendered, THE SchemaGenerator SHALL produce a LocalBusiness JSON-LD object containing the business name, address, telephone, email, URL, and opening hours from the Business_Data_File.
2. WHEN the Homepage is rendered, THE Website SHALL inject the LocalBusiness JSON_LD_Block into the `<head>` element of the page.
3. THE LocalBusiness_Schema SHALL set the `@type` field to `LocalBusiness`.
4. THE LocalBusiness_Schema SHALL include an `areaServed` property listing all service area localities from the Business_Data_File.
5. THE LocalBusiness_Schema SHALL include a `hasOfferCatalog` property referencing the services from the Business_Data_File.

### Requirement 3: AggregateRating in LocalBusiness Schema

**User Story:** As a business owner, I want the Google review rating included in the structured data, so that Google can display star ratings in search results.

#### Acceptance Criteria

1. WHEN ReviewData with `source` equal to `google` is available at build time, THE LocalBusiness_Schema SHALL include an `aggregateRating` property with the `ratingValue` set to the `overallRating` and `reviewCount` set to the number of Google reviews (excluding hardcoded testimonials).
2. WHEN ReviewData with `source` equal to `hardcoded` is available at build time, THE LocalBusiness_Schema SHALL omit the `aggregateRating` property.
3. THE AggregateRating_Schema SHALL set `bestRating` to 5 and `worstRating` to 1.

### Requirement 4: Service Schema for Each Service

**User Story:** As a business owner, I want each service described with structured data, so that Google understands the specific services offered.

#### Acceptance Criteria

1. THE SchemaGenerator SHALL produce a Service JSON-LD object for each service defined in the Business_Data_File.
2. WHEN the Homepage is rendered, THE Website SHALL inject all Service JSON_LD_Blocks into the `<head>` element of the page.
3. Each Service_Schema SHALL include the `@type` set to `Service`, a `name`, a `description`, and a `provider` referencing the LocalBusiness by name and URL.
4. Each Service_Schema SHALL include an `areaServed` property matching the service area from the Business_Data_File.

### Requirement 5: BreadcrumbList Schema on Contact Page

**User Story:** As a business owner, I want breadcrumb structured data on the contact page, so that Google displays a breadcrumb trail in search results.

#### Acceptance Criteria

1. WHEN the Contact_Page is rendered, THE SchemaGenerator SHALL produce a BreadcrumbList JSON-LD object with two items: "Home" pointing to the site root URL and "Contact Us" pointing to the Contact_Page URL.
2. WHEN the Contact_Page is rendered, THE Website SHALL inject the BreadcrumbList JSON_LD_Block into the `<head>` element of the page.
3. THE BreadcrumbList_Schema SHALL set the `@type` to `BreadcrumbList` and each item SHALL have a `position`, `name`, and `item` (URL).

### Requirement 6: JSON-LD Rendering

**User Story:** As a developer, I want all structured data rendered as valid JSON-LD script tags in the page head, so that search engines can parse the data reliably.

#### Acceptance Criteria

1. THE Website SHALL render each JSON-LD object inside a `<script type="application/ld+json">` element within the `<head>` of the page.
2. THE Website SHALL include the `@context` property set to `https://schema.org` in every JSON-LD object.
3. FOR ALL JSON-LD objects produced by the SchemaGenerator, serialising to JSON and parsing back SHALL produce an equivalent object (round-trip property).
4. THE Website SHALL produce valid JSON in every JSON_LD_Block, with no trailing commas, unescaped characters, or syntax errors.

### Requirement 7: Schema Validation

**User Story:** As a developer, I want the structured data to conform to Schema.org specifications, so that Google and other search engines accept and use the data.

#### Acceptance Criteria

1. THE LocalBusiness_Schema SHALL include all required Schema.org properties: `@context`, `@type`, `name`, `address` (with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`), and `telephone`.
2. THE Service_Schema SHALL include all required Schema.org properties: `@context`, `@type`, `name`, and `description`.
3. THE BreadcrumbList_Schema SHALL include all required Schema.org properties: `@context`, `@type`, and `itemListElement` with each element containing `@type` as `ListItem`, `position`, `name`, and `item`.
4. IF the AggregateRating_Schema is included, THEN THE AggregateRating_Schema SHALL include `@type`, `ratingValue`, `reviewCount`, `bestRating`, and `worstRating`.
