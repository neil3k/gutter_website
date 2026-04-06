# Tasks

## Task 1: Create central business data file

- [x] 1.1 Create `site/src/data/business-info.ts` exporting the `BusinessInfo`, `BusinessAddress`, and `ServiceInfo` interfaces
- [x] 1.2 Export the `businessInfo` constant with all business details: name, address (streetAddress, addressLocality, addressRegion, postalCode, addressCountry), telephone, email, url, googleBusinessUrl, serviceAreaLocalities array, and services array (Gutter Clearing, Downpipe Unblocking, Supply & Installation of Downpipe Gutter Guards)

## Task 2: Create schema generator module

- [x] 2.1 Create `site/src/lib/schema.ts` with `buildLocalBusinessSchema(business, reviewData?)` function that produces a LocalBusiness JSON-LD object including @context, @type, name, address, telephone, email, url, areaServed, and hasOfferCatalog from the business data; include aggregateRating (with ratingValue, reviewCount, bestRating=5, worstRating=1) only when reviewData.source is "google", counting only Google reviews (total minus hardcoded count) for reviewCount
- [x] 2.2 Add `buildServiceSchemas(business)` function that returns an array of Service JSON-LD objects, one per service, each with @context, @type, name, description, provider (LocalBusiness name+url), and areaServed
- [x] 2.3 Add `buildBreadcrumbSchema(siteUrl, items)` function that returns a BreadcrumbList JSON-LD object with @context, @type, and itemListElement containing ListItem entries with position, name, and item (URL)

## Task 3: Create JsonLd Astro component

- [x] 3.1 Create `site/src/components/JsonLd.astro` that accepts a `schema` prop (single object or array), and renders each as a `<script type="application/ld+json">` tag with `set:html={JSON.stringify(s)}`

## Task 4: Add head slot to BaseLayout

- [x] 4.1 Modify `site/src/layouts/BaseLayout.astro` to add `<slot name="head" />` inside the `<head>` element, after existing meta tags

## Task 5: Inject structured data on homepage

- [x] 5.1 Modify `site/src/pages/index.astro` to import `businessInfo`, `buildLocalBusinessSchema`, `buildServiceSchemas`, and `JsonLd`; generate the LocalBusiness schema (passing reviewData) and Service schemas in the frontmatter; inject them via `<Fragment slot="head">` containing `<JsonLd>` components

## Task 6: Inject breadcrumb structured data on contact page

- [x] 6.1 Modify `site/src/pages/contact.astro` to import `businessInfo`, `buildBreadcrumbSchema`, and `JsonLd`; generate the BreadcrumbList schema with Home and Contact Us items; inject via `<Fragment slot="head">` containing a `<JsonLd>` component

## Task 7: Write tests for schema generators

- [x] 7.1 Create `site/src/lib/__tests__/schema.test.ts` with example-based unit tests: verify `buildLocalBusinessSchema` output has correct @context, @type, name, address, telephone, email, url; verify aggregateRating is present when source is "google" and absent when "hardcoded"; verify `buildServiceSchemas` returns 3 services with correct names; verify `buildBreadcrumbSchema` returns correct 2-item breadcrumb
- [x] 7.2 [PBT] Property 1: LocalBusiness schema mirrors business data — generate random BusinessInfo, verify output fields match input (name, telephone, email, url, address fields)
- [x] 7.3 [PBT] Property 2: AggregateRating presence depends on review source — generate random ReviewData with source "google" or "hardcoded", verify aggregateRating present/absent accordingly
- [x] 7.4 [PBT] Property 3: Service count matches input — generate random service arrays, verify output count and field values match
- [x] 7.5 [PBT] Property 4: All JSON-LD objects include @context — generate random inputs for all builder functions, verify @context is "https://schema.org"
- [x] 7.6 [PBT] Property 5: JSON-LD round-trip serialisation — generate random inputs, build schemas, verify JSON.parse(JSON.stringify(obj)) deep-equals obj
- [x] 7.7 [PBT] Property 6: areaServed completeness — generate random locality arrays, verify areaServed output has matching count and names
