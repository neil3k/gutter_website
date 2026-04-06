# Implementation Plan: Custom 404 Page

## Overview

Add a branded, accessible 404 page to the Astro site using the existing BaseLayout, design tokens, and CTA button classes. A minor BaseLayout modification adds a named `head` slot for per-page meta injection. All styles use scoped CSS with design tokens. Tests verify structure, content, design token usage, and colour contrast.

## Tasks

- [x] 1. Add named head slot to BaseLayout
  - [x] 1.1 Modify `site/src/layouts/BaseLayout.astro` to add `<slot name="head" />` inside `<head>` after the existing `<link>` tags and before `</head>`
    - This is a non-breaking change — no existing pages use this slot
    - _Requirements: 6.1_

- [x] 2. Create the 404 page
  - [x] 2.1 Create `site/src/pages/404.astro` using BaseLayout with `title="Page Not Found"` and a `description` prop
    - Import and wrap content in `BaseLayout`
    - Add `<meta name="robots" content="noindex" slot="head" />` for search engine exclusion
    - Add a `<section class="error-page">` containing:
      - `<span class="error-page__code" aria-hidden="true">404</span>` large visual element
      - `<h1 class="error-page__heading">Page Not Found</h1>`
      - `<p class="error-page__message">` with a short friendly message
      - `<div class="error-page__actions">` with two anchor CTAs:
        - `<a href="/" class="cta-button cta-button--primary">Back to Homepage</a>`
        - `<a href="/contact" class="cta-button cta-button--secondary">Contact Us</a>`
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.4, 4.3, 4.4, 6.1, 6.2_

  - [x] 2.2 Add scoped `<style>` block to `404.astro`
    - Centre content vertically and horizontally
    - Style `.error-page__code` as a large decorative text element using `--font-heading` and `--color-primary`
    - Use design tokens for all colours, fonts, spacing, border-radius, and shadows
    - Add flexbox layout for `.error-page__actions` with `flex-wrap` for responsive CTA stacking
    - Add a media query at `max-width: 768px` to stack CTAs vertically and expand to full width (max 320px)
    - Ensure the layout works from 320px to 2560px viewports
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2, 5.3_

- [x] 3. Checkpoint — Verify page builds and renders
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Write unit tests for 404 page structure and content
  - [x] 4.1 Create `site/src/pages/__tests__/404-page.test.ts` with Vitest tests that read the `404.astro` source file and assert:
    - File exists at `site/src/pages/404.astro`
    - Imports and uses `BaseLayout`
    - `title` prop is set to `"Page Not Found"`
    - Contains `<meta name="robots" content="noindex">`
    - Contains exactly one `<h1>` element
    - Heading text includes "Page Not Found"
    - Contains a descriptive `<p>` message
    - Contains a "404" visual text element with `aria-hidden="true"`
    - Contains `<a href="/">` with text "Back to Homepage" using `cta-button--primary`
    - Contains `<a href="/contact">` with text "Contact Us" using `cta-button--secondary`
    - Contains a media query at `768px` for responsive CTA stacking
    - CTA elements use `.cta-button` class
    - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.4, 4.2, 4.3, 4.4, 5.3, 6.1, 6.2_

- [ ] 5. Write property-based tests
  - [ ]* 5.1 Write property test for design token usage (Property 1)
    - **Property 1: Design token usage over hardcoded values**
    - Parse the scoped `<style>` block from `404.astro`, use fast-check to generate random selections of CSS declarations, and assert that colour/font/spacing/radius/shadow values use `var(--...)` syntax rather than hardcoded literals
    - Permitted literal exceptions: `0`, `auto`, `none`, `inherit`, `transparent`, percentage values, `currentColor`
    - Tag: `Feature: custom-404-page, Property 1: Design token usage over hardcoded values`
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [ ]* 5.2 Write property test for colour contrast (Property 2)
    - **Property 2: Colour contrast meets WCAG AA**
    - Extract foreground/background colour pairs from the page styles (resolving CSS custom properties to hex values from global.css), use fast-check to generate random pairs, and assert contrast ratio ≥ 4.5:1 for normal text and ≥ 3:1 for large text
    - Tag: `Feature: custom-404-page, Property 2: Colour contrast meets WCAG AA`
    - **Validates: Requirements 4.1**

- [x] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- No infrastructure changes needed — CloudFront already serves `/404.html` with 404 status
- The BaseLayout head slot addition is non-breaking and reusable for future pages
- All tests follow the existing project pattern of reading `.astro` source files and asserting on content
