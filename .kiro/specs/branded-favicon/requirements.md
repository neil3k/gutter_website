# Requirements Document

## Introduction

The Warboys Gutter Clearing website currently uses a placeholder favicon. This feature replaces the placeholder with a branded favicon set that uses the site's yellow (#FFD200) and black (#111111) colour scheme, adds multiple icon formats for cross-browser and device compatibility, and includes a web app manifest for PWA-style icon support. The favicon design features a gutter/roof silhouette consistent with the existing logo and brand identity.

## Glossary

- **Favicon_SVG**: The scalable vector graphic favicon file (`favicon.svg`) served as the primary browser tab icon
- **Favicon_ICO**: The legacy bitmap favicon file (`favicon.ico`) at 32×32 pixels for older browsers
- **Apple_Touch_Icon**: A 180×180 pixel PNG icon (`apple-touch-icon.png`) used by iOS devices when bookmarking or adding the site to the home screen
- **Web_App_Manifest**: A JSON file (`site.webmanifest`) that provides metadata about the web application including icon references, name, and theme colour
- **BaseLayout**: The root Astro layout component (`src/layouts/BaseLayout.astro`) that renders the HTML `<head>` for all pages
- **Brand_Colours**: The primary yellow (#FFD200) and secondary black (#111111) colours defined in the site's Design_System
- **Favicon_Design**: The visual design of the favicon, featuring a gutter/roof silhouette motif consistent with the existing site logo

## Requirements

### Requirement 1: Branded SVG Favicon

**User Story:** As a visitor, I want to see a branded favicon in the browser tab, so that I can easily identify the Warboys Gutter Clearing site among open tabs.

#### Acceptance Criteria

1. THE Favicon_SVG SHALL display a gutter/roof silhouette motif using the Brand_Colours (yellow #FFD200 on a black #111111 background).
2. THE Favicon_SVG SHALL use a square viewBox and render clearly at sizes from 16×16 to 512×512 pixels.
3. THE Favicon_SVG SHALL be located at `public/favicon.svg` in the Astro project, replacing the existing placeholder file.

### Requirement 2: Legacy ICO Favicon

**User Story:** As a visitor using an older browser, I want the site to display a favicon, so that I have a consistent branded experience regardless of browser.

#### Acceptance Criteria

1. THE Favicon_ICO SHALL be a 32×32 pixel bitmap icon file located at `public/favicon.ico`.
2. THE Favicon_ICO SHALL render the same gutter/roof silhouette motif as the Favicon_SVG using the Brand_Colours.

### Requirement 3: Apple Touch Icon

**User Story:** As an iOS user, I want to see a branded icon when I bookmark or add the site to my home screen, so that the site looks professional alongside other apps.

#### Acceptance Criteria

1. THE Apple_Touch_Icon SHALL be a 180×180 pixel PNG file located at `public/apple-touch-icon.png`.
2. THE Apple_Touch_Icon SHALL render the gutter/roof silhouette motif using the Brand_Colours.

### Requirement 4: Web App Manifest

**User Story:** As a visitor, I want the site to provide a web app manifest, so that the site can be installed as a PWA-style shortcut with correct branding.

#### Acceptance Criteria

1. THE Web_App_Manifest SHALL be located at `public/site.webmanifest`.
2. THE Web_App_Manifest SHALL include the `name` field set to "Warboys Gutter Clearing".
3. THE Web_App_Manifest SHALL include the `short_name` field set to "WGC".
4. THE Web_App_Manifest SHALL include an `icons` array referencing the Favicon_SVG (type `image/svg+xml`, purpose `any`) and the Apple_Touch_Icon (type `image/png`, sizes `180x180`).
5. THE Web_App_Manifest SHALL set `theme_color` to "#FFD200" and `background_color` to "#111111".

### Requirement 5: BaseLayout Icon References

**User Story:** As a developer, I want the HTML head to reference all icon formats correctly, so that browsers and devices can discover and use the appropriate favicon.

#### Acceptance Criteria

1. THE BaseLayout SHALL include a `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` element.
2. THE BaseLayout SHALL include a `<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">` element.
3. THE BaseLayout SHALL include a `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` element.
4. THE BaseLayout SHALL include a `<link rel="manifest" href="/site.webmanifest">` element.
5. THE BaseLayout SHALL include a `<meta name="theme-color" content="#FFD200">` element.
