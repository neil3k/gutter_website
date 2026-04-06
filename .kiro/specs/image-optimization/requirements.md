# Requirements Document

## Introduction

The Warboys Gutter Clearing website currently serves before/after gutter photos as unoptimized JPG files from the `public/images/` directory. These images are delivered as-is to the browser without format conversion, responsive sizing, or build-time processing. This feature introduces build-time image optimization using Astro's built-in `<Image>` component and `sharp` integration, converting images to modern formats (WebP with fallback), generating responsive srcset variants, and preventing layout shift through explicit dimension attributes and appropriate loading strategies.

## Glossary

- **Image_Component**: The Astro built-in `<Image>` component imported from `astro:assets`, which processes images at build time to generate optimized output
- **Source_Image**: An original JPG photograph stored in `src/assets/images/` that serves as input to the build-time optimization pipeline
- **Optimized_Image**: A processed image output by the Image_Component during the Astro build, converted to a modern format and resized to specified dimensions
- **WebP_Format**: A modern image format developed by Google that provides superior compression compared to JPG, supported by all modern browsers
- **Fallback_Format**: The original JPG format served to browsers that do not support WebP_Format
- **Srcset**: An HTML attribute on `<img>` elements that provides the browser with a set of image sources at different widths, allowing the browser to select the most appropriate size for the current viewport
- **Layout_Shift**: A visual instability metric (Cumulative Layout Shift / CLS) caused by images loading without reserved space, pushing surrounding content around
- **Eager_Loading**: A loading strategy (`loading="eager"`) that instructs the browser to fetch the image immediately, used for above-the-fold content
- **Lazy_Loading**: A loading strategy (`loading="lazy"`) that defers image fetching until the image is near the viewport, reducing initial page load time
- **Hero_Image**: The before/after image pair displayed in the HeroSection component, which is above the fold and visible on initial page load
- **Gallery_Image**: A before/after image pair displayed in the BeforeAfterGallery component, which is below the fold
- **Build_Time_Optimization**: The process during `astro build` where the sharp library processes Source_Images into Optimized_Images with format conversion and resizing
- **Sharp_Library**: The Node.js image processing library used internally by Astro to perform Build_Time_Optimization
- **Assets_Directory**: The `src/assets/images/` directory where Source_Images are stored so that Astro can import and process them at build time
- **HeroSection_Component**: The Astro component (`src/components/HeroSection.astro`) that renders the hero banner including the Hero_Image pair
- **Gallery_Component**: The Astro component (`src/components/BeforeAfterGallery.astro`) that renders the grid of Gallery_Image pairs

## Requirements

### Requirement 1: Image Relocation to Assets Directory

**User Story:** As a developer, I want images stored in the Astro assets directory, so that the build pipeline can process and optimize them automatically.

#### Acceptance Criteria

1. THE Assets_Directory SHALL contain all Source_Images previously located in `public/images/` (hero-before.jpg, hero-after.jpg, gallery-1-before.jpg, gallery-1-after.jpg, gallery-2-before.jpg, gallery-2-after.jpg, gallery-3-before.jpg, gallery-3-after.jpg).
2. WHEN the Source_Images have been moved to the Assets_Directory, THE `public/images/` directory SHALL no longer contain the relocated image files.
3. THE Assets_Directory path SHALL be `src/assets/images/` within the Astro project.

### Requirement 2: Build-Time Image Optimization

**User Story:** As a site owner, I want images automatically optimized during the build process, so that visitors receive smaller, faster-loading images without manual processing.

#### Acceptance Criteria

1. WHEN the Astro build runs, THE Build_Time_Optimization process SHALL convert each Source_Image into WebP_Format.
2. WHEN the Astro build runs, THE Build_Time_Optimization process SHALL generate multiple size variants for each Source_Image at widths of 400px, 800px, and 1200px.
3. THE Astro project SHALL include the Sharp_Library as a dependency to enable Build_Time_Optimization.
4. IF a browser does not support WebP_Format, THEN THE Image_Component SHALL serve the Fallback_Format (JPG) to that browser.

### Requirement 3: Responsive Image Delivery

**User Story:** As a visitor on a mobile device, I want to receive appropriately sized images, so that I do not download unnecessarily large files on a small screen.

#### Acceptance Criteria

1. THE Image_Component SHALL output an `<img>` element with a `srcset` attribute containing sources at 400w, 800w, and 1200w widths.
2. THE Image_Component SHALL output a `sizes` attribute that guides the browser to select the appropriate image width based on the viewport.
3. WHEN a visitor views the Website on a viewport narrower than 480px, THE browser SHALL have a 400w image variant available for selection.
4. WHEN a visitor views the Website on a viewport between 480px and 1024px, THE browser SHALL have an 800w image variant available for selection.
5. WHEN a visitor views the Website on a viewport wider than 1024px, THE browser SHALL have a 1200w image variant available for selection.

### Requirement 4: Layout Shift Prevention

**User Story:** As a visitor, I want images to load without pushing content around, so that the page feels stable and professional.

#### Acceptance Criteria

1. THE Image_Component SHALL output explicit `width` and `height` attributes on every `<img>` element to allow the browser to reserve space before the image loads.
2. FOR ALL images rendered by the Image_Component, THE Cumulative Layout Shift contribution from image loading SHALL be zero.

### Requirement 5: Loading Strategy

**User Story:** As a visitor, I want above-the-fold images to load immediately and below-the-fold images to load on demand, so that the page appears fast without wasting bandwidth.

#### Acceptance Criteria

1. THE HeroSection_Component SHALL render the Hero_Image pair with `loading="eager"` so that the images load immediately on page load.
2. THE Gallery_Component SHALL render all Gallery_Image pairs with `loading="lazy"` so that the images load only when the visitor scrolls near them.
3. THE HeroSection_Component SHALL include `fetchpriority="high"` on the Hero_Image pair to signal the browser to prioritize fetching those images.

### Requirement 6: Component Migration to Image Component

**User Story:** As a developer, I want the HeroSection and BeforeAfterGallery components to use Astro's Image component, so that all image rendering benefits from the optimization pipeline.

#### Acceptance Criteria

1. THE HeroSection_Component SHALL import and use the Image_Component from `astro:assets` to render the Hero_Image pair instead of plain `<img>` tags with static paths.
2. THE Gallery_Component SHALL import and use the Image_Component from `astro:assets` to render all Gallery_Image pairs instead of plain `<img>` tags with static paths.
3. THE HeroSection_Component SHALL import each Hero_Image Source_Image from the Assets_Directory using ESM import statements.
4. THE Gallery_Component SHALL import each Gallery_Image Source_Image from the Assets_Directory using ESM import statements.
5. WHEN the Image_Component renders an image, THE output HTML SHALL contain the optimized image path generated by the Astro build rather than the original Source_Image path.
6. THE visual appearance and layout of the HeroSection_Component and Gallery_Component SHALL remain unchanged after the migration to the Image_Component.
