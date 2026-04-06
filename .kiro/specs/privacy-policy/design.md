# Design Document

## Overview

This design describes the implementation of a dedicated privacy policy page for the Warboys Gutter Clearing website. The page is a static Astro page at `/privacy` that uses the existing BaseLayout and design system. It contains structured privacy policy content covering UK GDPR compliance, data collection (contact form and analytics cookies), data usage, sharing, retention, and visitor rights. A "Privacy Policy" link is added to the Footer component's quick links section.

## Architecture

```mermaid
graph TD
    A[Footer Component] -->|"Privacy Policy" link| B[/privacy page]
    B -->|uses| C[BaseLayout]
    C -->|includes| A
    C -->|includes| D[Navigation]
    C -->|includes| E[StickyMobileCta]
```

No new components, data fetching, or build-time logic is required. This feature adds one new page file and modifies one existing component.

### Files Changed

| File | Action | Description |
|---|---|---|
| `site/src/pages/privacy.astro` | Create | New privacy policy page using BaseLayout |
| `site/src/components/Footer.astro` | Modify | Add "Privacy Policy" link to navLinks array |

## Components and Interfaces

### Privacy Page (`src/pages/privacy.astro`)

A static Astro page that renders the privacy policy content.

- Uses `BaseLayout` with `title="Privacy Policy"` and a descriptive `description` prop.
- Contains all privacy policy content inline as structured HTML (no CMS, no external data source).
- Uses semantic heading hierarchy: `<h1>` for page title, `<h2>` for major sections, `<h3>` for subsections.
- Content sections:
  1. Introduction — identifies the Data Controller (Warboys Gutter Clearing) and contact email
  2. What Data We Collect — contact form fields and analytics cookies
  3. How We Use Your Data — enquiry responses and traffic analysis
  4. Who We Share Data With — Google (GA4), AWS (hosting/SES); no selling
  5. How Long We Keep Your Data — retention periods for form submissions, analytics, consent preferences
  6. Cookies — types used, consent requirement, browser management
  7. Your Rights — six UK GDPR rights, how to exercise them, ICO complaint right
  8. Changes to This Policy — last updated date
- Scoped `<style>` block for page-specific layout (max-width container, prose spacing).
- All typography and colours reference existing CSS custom properties from the Design_System.

### Footer Modification (`src/components/Footer.astro`)

Add a new entry to the `navLinks` array:

```typescript
{ label: 'Privacy Policy', href: '/privacy' }
```

This places the link in the existing "Quick Links" section, inheriting the `footer__link` class styling automatically.

## Data Models

No new data models. The privacy policy content is static HTML within the Astro page.

## Correctness Properties

### Property 1: UK GDPR rights completeness

*For any* rendering of the Privacy_Page, the output HTML shall contain all six UK GDPR visitor rights: right of access, right to rectification, right to erasure, right to restrict processing, right to data portability, and right to object.

**Validates: Requirement 5.1**

### Property 2: Semantic heading hierarchy

*For any* rendering of the Privacy_Page, the heading elements shall follow a valid hierarchy where no heading level is skipped (e.g. h1 followed by h2, not h1 followed by h3).

**Validates: Requirement 8.4**

### Property 3: Footer contains privacy link

*For any* rendering of the Footer component, the output HTML shall contain a link with `href="/privacy"` and text content "Privacy Policy".

**Validates: Requirement 7.1**

## Error Handling

No error handling is required. The privacy policy page is entirely static content with no data fetching, form submission, or external API calls.

## Testing Strategy

### Unit Tests (Example-Based)

Use Vitest to verify the privacy page content and Footer modification.

**Scope:**
- Privacy page file exists at `src/pages/privacy.astro` (Req 1.3)
- Privacy page content mentions the business name and contact email (Req 2.1)
- Privacy page content mentions all contact form data fields: name, email, telephone, address, message (Req 2.2)
- Privacy page content mentions analytics cookies and consent requirement (Req 2.3, 2.4)
- Privacy page content mentions Google and AWS as third parties (Req 3.3)
- Privacy page content states data is not sold (Req 3.4)
- Privacy page content mentions data retention periods (Req 4.1, 4.2)
- Privacy page content mentions ICO with website URL (Req 5.3)
- Privacy page content mentions cookie types and browser management (Req 6.1, 6.3)
- Footer navLinks array includes Privacy Policy entry with href="/privacy" (Req 7.1, 7.2)

### Property-Based Tests

Use `fast-check` with Vitest. Minimum 100 iterations per property.

1. **Feature: privacy-policy, Property 1: UK GDPR rights completeness**
   Read the privacy page source and verify all six rights strings are present regardless of content ordering.

2. **Feature: privacy-policy, Property 2: Semantic heading hierarchy**
   Parse heading elements from the privacy page and verify no heading level is skipped.

3. **Feature: privacy-policy, Property 3: Footer contains privacy link**
   Verify the Footer component source contains a navLinks entry with label "Privacy Policy" and href "/privacy".

### Test File Structure

```
site/src/pages/__tests__/
  privacy-content.test.ts    # Content completeness and heading hierarchy tests
site/src/components/__tests__/
  footer-privacy-link.test.ts  # Footer privacy link test
```

### Test Configuration

```json
{
  "testRunner": "vitest",
  "pbtLibrary": "fast-check",
  "pbtMinIterations": 100
}
```
