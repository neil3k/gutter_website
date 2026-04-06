# Tasks

## Task 1: Create branded SVG favicon

- [x] 1.1 Replace `site/public/favicon.svg` with a refined branded SVG favicon using the gutter/roof silhouette motif with brand colours (#FFD200 yellow on #111111 black background), square 48×48 viewBox, rounded-rect background, roof stroke, gutter trough, downpipe, and water drop elements

## Task 2: Generate bitmap favicon files

- [x] 2.1 Create `site/public/favicon.ico` as a 32×32 pixel ICO file derived from the branded SVG design
- [x] 2.2 Create `site/public/apple-touch-icon.png` as a 180×180 pixel PNG file derived from the branded SVG design

## Task 3: Create web app manifest

- [x] 3.1 Create `site/public/site.webmanifest` with `name` set to "Warboys Gutter Clearing", `short_name` set to "WGC", `icons` array referencing `/favicon.svg` (type `image/svg+xml`, purpose `any`) and `/apple-touch-icon.png` (type `image/png`, sizes `180x180`), `theme_color` set to "#FFD200", `background_color` set to "#111111", and `display` set to "standalone"

## Task 4: Update BaseLayout icon references

- [x] 4.1 Update `site/src/layouts/BaseLayout.astro` to replace the existing single favicon `<link>` with the full set: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`, `<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`, `<link rel="manifest" href="/site.webmanifest">`, and `<meta name="theme-color" content="#FFD200">`

## Task 5: Add favicon tests

- [x] 5.1 Create `site/src/lib/__tests__/branded-favicon.test.ts` with tests verifying: favicon.svg contains brand colours (#FFD200 and #111111), favicon.svg has a square viewBox, favicon files exist (favicon.svg, favicon.ico, apple-touch-icon.png), site.webmanifest is valid JSON with correct name/short_name/icons/theme_color/background_color values, and BaseLayout.astro contains all required icon link elements and theme-color meta tag
