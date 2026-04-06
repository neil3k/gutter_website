# Tasks

## Task 1: Create the privacy policy page

- [x] 1.1 Create `site/src/pages/privacy.astro` using BaseLayout with title "Privacy Policy" and a descriptive meta description
- [x] 1.2 Add the privacy policy content with semantic HTML structure: h1 page title, h2 section headings, h3 subsections, paragraphs, and bullet lists
- [x] 1.3 Include all required content sections: Data Controller identification with contact email, data collected via contact form (name, email, telephone, address, message), data collected via GA4 cookies (pages visited, visit duration, referral source, device type), consent-gated cookie statement, data usage purposes, third-party sharing (Google for GA4, AWS for hosting/SES), no-sale statement, data retention periods, cookie types and browser management, UK GDPR rights (access, rectification, erasure, restrict processing, data portability, object), instructions to exercise rights with contact email, ICO complaint right with ico.org.uk URL, and a last-updated date
- [x] 1.4 Add scoped styles for the privacy page: max-width content container, prose-friendly spacing for paragraphs and lists, consistent use of Design_System CSS custom properties for colours and typography

## Task 2: Add Privacy Policy link to Footer

- [x] 2.1 Add `{ label: 'Privacy Policy', href: '/privacy' }` to the `navLinks` array in `site/src/components/Footer.astro`

## Task 3: Write tests

- [x] 3.1 Create `site/src/pages/__tests__/privacy-content.test.ts` with example-based tests verifying: page file exists, content includes business name and contact email, content mentions all contact form fields, content mentions analytics cookies and consent, content lists Google and AWS as third parties, content includes no-sale statement, content mentions retention periods, content mentions ICO with URL, content lists cookie types and browser management instructions
- [x] 3.2 Add property-based test in `site/src/pages/__tests__/privacy-content.test.ts` for UK GDPR rights completeness (Property 1): verify all six rights appear in the page content
- [x] 3.3 Add property-based test in `site/src/pages/__tests__/privacy-content.test.ts` for semantic heading hierarchy (Property 2): parse headings and verify no level is skipped
- [x] 3.4 Create `site/src/components/__tests__/footer-privacy-link.test.ts` with a test verifying the Footer navLinks array contains an entry with label "Privacy Policy" and href "/privacy" (Property 3)
