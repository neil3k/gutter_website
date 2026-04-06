# Design Document

## Overview

This design describes the implementation of a branded favicon set for the Warboys Gutter Clearing website. The existing placeholder `favicon.svg` is replaced with a polished gutter/roof silhouette icon using the brand colours (#FFD200 yellow, #111111 black). Additional icon formats (ICO, Apple Touch Icon) and a web app manifest are added for full cross-browser and device coverage. The `BaseLayout.astro` component is updated to reference all icon formats.

## Architecture

```
site/public/
├── favicon.svg            # Branded SVG favicon (replaces placeholder)
├── favicon.ico            # 32×32 legacy bitmap favicon
├── apple-touch-icon.png   # 180×180 PNG for iOS
└── site.webmanifest       # Web app manifest with icon references

site/src/layouts/
└── BaseLayout.astro       # Updated <head> with all icon/manifest links
```

No new dependencies are required. The SVG favicon is hand-authored. The ICO and PNG files are generated from the SVG source using a build-time conversion script or a one-off CLI tool (e.g. `sharp`, `svg2png`, or an online converter).

## Components and Interfaces

### Favicon SVG Design

The branded `favicon.svg` retains the same gutter/roof silhouette motif already present in the placeholder and the site logo, but refined for clarity at small sizes:

- **ViewBox**: `0 0 48 48` (square)
- **Background**: Rounded rectangle (#111111, rx=8)
- **Roof**: Inverted-V path (#FFD200, stroke)
- **Gutter trough**: Horizontal rectangle (#FFD200, fill)
- **Downpipe**: Vertical rectangle (#FFD200, fill)
- **Water drop**: Circle (#FFD200, reduced opacity)

The existing `favicon.svg` already follows this pattern. The design will be refined with slightly adjusted proportions and stroke weights for better rendering at 16px and 32px.

### Favicon ICO (32×32)

A 32×32 pixel ICO file generated from the SVG. Placed at `public/favicon.ico`. This serves legacy browsers that do not support SVG favicons.

### Apple Touch Icon (180×180)

A 180×180 pixel PNG generated from the SVG with appropriate padding. Placed at `public/apple-touch-icon.png`. Used by iOS when adding the site to the home screen.

### Web App Manifest (`site.webmanifest`)

```json
{
  "name": "Warboys Gutter Clearing",
  "short_name": "WGC",
  "icons": [
    {
      "src": "/favicon.svg",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "theme_color": "#FFD200",
  "background_color": "#111111",
  "display": "standalone"
}
```

### BaseLayout Changes

The `<head>` section of `BaseLayout.astro` is updated to replace the single favicon link with the full set:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#FFD200" />
```

## Data Models

No new data models are introduced. The web app manifest follows the [W3C Web App Manifest spec](https://www.w3.org/TR/appmanifest/).

## Correctness Properties

### Property 1: SVG favicon uses brand colours

*For the* `favicon.svg` file, the SVG content SHALL contain both brand colour values `#FFD200` and `#111111` (case-insensitive).

**Validates: Requirement 1.1**

### Property 2: Web app manifest schema completeness

*For the* `site.webmanifest` file, the parsed JSON SHALL contain the fields `name`, `short_name`, `icons`, `theme_color`, and `background_color` with the correct values as specified in Requirement 4.

**Validates: Requirements 4.2, 4.3, 4.4, 4.5**

### Property 3: BaseLayout contains all icon references

*For the* `BaseLayout.astro` source, the file SHALL contain link elements for `image/svg+xml` favicon, `image/x-icon` favicon, `apple-touch-icon`, `manifest`, and a `theme-color` meta tag.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

## Error Handling

This feature is purely static asset and markup changes. There are no runtime error scenarios. If any icon file is missing, the browser will silently fall back to the next available format or show no favicon — this is standard browser behaviour and does not affect site functionality.

## Testing Strategy

### Example-Based Tests (Vitest)

1. **Favicon SVG brand colours**: Read `public/favicon.svg`, verify it contains `#FFD200` and `#111111`.
2. **Favicon SVG square viewBox**: Parse the SVG, verify the viewBox has equal width and height.
3. **Favicon files exist**: Verify `public/favicon.svg`, `public/favicon.ico`, and `public/apple-touch-icon.png` all exist.
4. **Web app manifest validity**: Parse `public/site.webmanifest` as JSON, verify `name` is "Warboys Gutter Clearing", `short_name` is "WGC", `theme_color` is "#FFD200", `background_color` is "#111111", and `icons` array has the expected entries.
5. **BaseLayout icon references**: Read `src/layouts/BaseLayout.astro` source, verify it contains all five required link/meta elements.

### Test File

```
site/src/lib/__tests__/branded-favicon.test.ts
```
