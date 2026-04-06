# Tasks

## Task 1: Add sharp dependency

- [x] 1.1 Add `sharp` to the `dependencies` section of `site/package.json`
- [x] 1.2 Run `npm install` in the `site/` directory to install sharp and update the lock file

## Task 2: Move images from public/images/ to src/assets/images/

- [x] 2.1 Create the `site/src/assets/images/` directory
- [x] 2.2 Move `hero-before.jpg`, `hero-after.jpg`, `gallery-1-before.jpg`, `gallery-1-after.jpg`, `gallery-2-before.jpg`, `gallery-2-after.jpg`, `gallery-3-before.jpg`, `gallery-3-after.jpg` from `site/public/images/` to `site/src/assets/images/`
- [x] 2.3 Remove the JPG files from `site/public/images/` (keep `.gitkeep`)

## Task 3: Update HeroSection.astro to use the Image component

- [x] 3.1 Add `import { Image } from 'astro:assets'` to the frontmatter
- [x] 3.2 Add ESM imports for `hero-before.jpg` and `hero-after.jpg` from `../assets/images/`
- [x] 3.3 Replace the before `<img>` tag with `<Image src={heroBefore} alt="Blocked gutter before clearing" widths={[400, 800, 1200]} sizes="(max-width: 767px) 100vw, 50vw" loading="eager" fetchpriority="high" />`
- [x] 3.4 Replace the after `<img>` tag with `<Image src={heroAfter} alt="Clean gutter after clearing" widths={[400, 800, 1200]} sizes="(max-width: 767px) 100vw, 50vw" loading="eager" fetchpriority="high" />`

## Task 4: Update BeforeAfterGallery.astro to use the Image component

- [x] 4.1 Add `import { Image } from 'astro:assets'` to the frontmatter
- [x] 4.2 Add ESM imports for all 6 gallery images from `../assets/images/`
- [x] 4.3 Update the `galleryItems` array to include `before` and `after` properties referencing the imported image objects
- [x] 4.4 Replace the before `<img>` tags in the template with `<Image src={item.before} alt={...} widths={[400, 800, 1200]} sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 25vw, 20vw" loading="lazy" />`
- [x] 4.5 Replace the after `<img>` tags in the template with `<Image src={item.after} alt={...} widths={[400, 800, 1200]} sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 25vw, 20vw" loading="lazy" />`

## Task 5: Write tests for image optimization

- [x] 5.1 Create `site/src/components/__tests__/image-optimization.test.ts` with tests verifying: HeroSection imports Image from astro:assets, HeroSection uses eager loading and fetchpriority="high", BeforeAfterGallery imports Image from astro:assets, BeforeAfterGallery uses lazy loading, no component references `/images/` static paths, all 8 source images exist in `src/assets/images/`, and sharp is listed in package.json dependencies
- [x] 5.2 Run `npm test` in the `site/` directory to verify all tests pass

## Task 6: Verify build succeeds

- [x] 6.1 Run `npm run build` in the `site/` directory to confirm the Astro build completes without errors and generates optimized image output
