# Tasks

## Task 1: Create consent utility module

- [x] 1.1 Create `site/src/lib/consent.ts` with `CONSENT_KEY`, `ConsentValue` type, `getConsent()`, and `setConsent()` functions
- [x] 1.2 `getConsent()` returns `null` when localStorage is unavailable, returns `"accepted"` or `"rejected"` for valid stored values, and returns `null` for any other stored value
- [x] 1.3 `setConsent()` stores the provided value (`"accepted"` or `"rejected"`) in localStorage under the `cookie-consent` key

## Task 2: Create AnalyticsHead component

- [x] 2.1 Create `site/src/components/AnalyticsHead.astro` that reads `PUBLIC_GA_MEASUREMENT_ID` from `import.meta.env`
- [x] 2.2 When the measurement ID is set, render an inline script that initialises `window.dataLayer`, defines the `gtag` function, sets `gtag('consent', 'default', { analytics_storage: 'denied' })`, and calls `gtag('js', new Date())`
- [x] 2.3 Include the measurement ID as a `data-measurement-id` attribute on the script element for client-side access
- [x] 2.4 When the measurement ID is not set, render nothing

## Task 3: Create CookieConsent banner component

- [x] 3.1 Create `site/src/components/CookieConsent.astro` that only renders when `PUBLIC_GA_MEASUREMENT_ID` is set
- [x] 3.2 Render a fixed-bottom banner with a message explaining analytics cookie usage, an "Accept" button, and a "Reject" button
- [x] 3.3 Style the banner using Design_System tokens: `#111111` background, `#FFD200` accent, `--font-body` text, `--font-heading` for any heading, z-index above 1100
- [x] 3.4 Style the Accept button with `--color-primary` background and `--color-secondary` text (matching `.cta-button--primary`), and the Reject button with a transparent/outline style
- [x] 3.5 Ensure both buttons have minimum 44px × 44px touch targets and are keyboard-focusable with appropriate ARIA attributes (`role="dialog"`, `aria-label` on the banner)
- [x] 3.6 Add inline `<script>` that on page load: reads consent from localStorage; if "accepted" hides banner and loads GA4; if "rejected" hides banner; if no preference shows banner
- [x] 3.7 On Accept click: store "accepted" in localStorage, hide banner, dynamically create and append the `gtag.js` script element, call `gtag('consent', 'update', { analytics_storage: 'granted' })` and `gtag('config', measurementId)`
- [x] 3.8 On Reject click: store "rejected" in localStorage, hide banner, do not load any analytics scripts

## Task 4: Integrate components into BaseLayout

- [x] 4.1 Import `AnalyticsHead` in `site/src/layouts/BaseLayout.astro` and add `<AnalyticsHead />` inside `<head>` after the favicon link
- [x] 4.2 Import `CookieConsent` in `site/src/layouts/BaseLayout.astro` and add `<CookieConsent />` before `</body>` after `<StickyMobileCta />`

## Task 5: Write tests for consent module

- [x] 5.1 Create `site/src/lib/__tests__/consent.test.ts` with unit tests: `getConsent()` returns null when empty, returns valid values, returns null for invalid values; `setConsent()` stores correct values
- [x] 5.2 [PBT] Add property-based test: for any random string stored in localStorage under the consent key, `getConsent()` returns only `"accepted"`, `"rejected"`, or `null` — never any other value (Property 3: Consent value integrity)

## Task 6: Write tests for cookie consent banner

- [x] 6.1 Create `site/src/components/__tests__/cookie-consent.test.ts` with unit tests verifying banner renders with correct buttons, correct ARIA attributes, correct styling classes, and correct z-index when measurement ID is set
- [x] 6.2 Add unit test verifying banner is not rendered when measurement ID is absent
