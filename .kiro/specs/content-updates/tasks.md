# Implementation Plan: Content Updates

## Overview

Update textual content across the Warboys Gutter Clearing Astro site to match the refreshed brand copy. Changes span the services data file, hero section, about section, services section, "Why Choose Us" section, CTA banner, contact page, and content-check tests.

## Tasks

- [x] 1. Update services data in business-info.ts
  - [x] 1.1 Replace the `services` array with 4 entries: "Gutter Clearing", "Gutter Guard Installation", "Downpipe Clearing & Minor Maintenance", "Domestic & Small Commercial Properties" with their new descriptions
    - Update `site/src/data/business-info.ts`
    - Remove the old 3-service array and replace with the 4-service array from the design document
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 2. Update HeroSection with tagline and welcome text
  - [x] 2.1 Add tagline and welcome paragraph to HeroSection.astro
    - In `site/src/components/HeroSection.astro`, insert a `<p class="hero__tagline">Local. Reliable. Family Run.</p>` and a `<p class="hero__welcome">Welcome to Warboys Gutter Clearing — your trusted local experts for keeping gutters clean, clear, and working as they should.</p>` after the `<h1>` element
    - Preserve existing heading, trust bullets, and CTA buttons unchanged
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Update AboutSection with new copy
  - [x] 3.1 Replace the about paragraph in AboutSection.astro
    - In `site/src/components/AboutSection.astro`, replace the existing `<p class="about__text">` content with: "We're a friendly, family-run business with years of experience serving Warboys and the surrounding areas. We take pride in offering a reliable, professional service with a personal touch — no fuss, no mess, just the job done properly."
    - _Requirements: 2.1, 2.2_

- [x] 4. Update ServicesSection to render 4 service cards
  - [x] 4.1 Rewrite ServicesSection.astro to render 4 cards from business-info.ts data
    - In `site/src/components/ServicesSection.astro`, import `businessInfo` from the data file and iterate over `businessInfo.services` to render 4 cards dynamically
    - Each card displays the service `name` as heading and `description` as paragraph
    - Update the CSS grid to handle 4 cards (e.g. `repeat(auto-fit, minmax(280px, 1fr))` or `repeat(2, 1fr)`)
    - Remove the old hardcoded 3-card markup
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 5. Update WhyChooseUs with new differentiator items
  - [x] 5.1 Replace the 5 differentiator items in WhyChooseUs.astro
    - In `site/src/components/WhyChooseUs.astro`, replace the existing 5 `<li>` items with the new 5 items: "Family-run and well established", "Friendly, honest, and reliable", "Local to Warboys — we care about our community", "Fully insured for your peace of mind", "Modern equipment for a thorough clean every time"
    - Retain the existing SVG icons and component structure
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 6. Update CtaBanner with new CTA paragraph
  - [x] 6.1 Add the new CTA paragraph to CtaBanner.astro
    - In `site/src/components/CtaBanner.astro`, add a paragraph containing "Whether your gutters are overflowing, blocked with moss and leaves, or you just want to stay on top of maintenance, we're here to help." before or alongside the existing quote line
    - Preserve the existing "Get a Free Quote" and "Call Now" buttons
    - _Requirements: 6.1, 6.2_

- [x] 7. Update contact page intro text
  - [x] 7.1 Replace the intro paragraph in contact.astro
    - In `site/src/pages/contact.astro`, replace the `<p class="contact-page__intro">` content with: "Contact us today for a free quote and let us take care of your gutters — quickly, safely, and professionally."
    - _Requirements: 7.1_

- [x] 8. Checkpoint - Verify content changes
  - Ensure all content changes render correctly, ask the user if questions arise.

- [x] 9. Update content-checks test file
  - [x] 9.1 Update content-checks.test.ts to verify all new content
    - In `site/src/components/__tests__/content-checks.test.ts`, update the following test sections:
    - Update "Hero section content" tests to assert the tagline "Local. Reliable. Family Run." and welcome text "Welcome to Warboys Gutter Clearing" are present
    - Update "Services section content" tests to check for all 4 new service names: "Gutter Clearing", "Gutter Guard Installation", "Downpipe Clearing & Minor Maintenance", "Domestic & Small Commercial Properties"
    - Remove assertions for old content no longer present (e.g. "Predator", "by hand", "Downpipe Unblocking", "Downpipe Gutter Guards")
    - Update "Why Choose Us content" tests to assert the 5 new differentiator texts
    - Add a "CTA Banner content" test asserting "Whether your gutters are overflowing"
    - Add a "Contact page intro" test asserting "Contact us today for a free quote"
    - Add a test importing `businessInfo` from the data file to verify `services.length === 4` and each entry has non-empty `name` and `description`
    - _Requirements: 1.1, 1.2, 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 7.1, 8.1_

- [x] 10. Final checkpoint - Verify build and tests
  - Run `npm run test` from the `site/` directory to ensure all content-check tests pass
  - Run `npm run build` from the `site/` directory to ensure the Astro build completes without errors
  - Verify JSON-LD structured data includes all 4 service entries
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 8.2, 8.3_

## Notes

- No tasks are marked optional since the design notes that property-based tests are not applicable for these static content changes
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation before and after test updates
