import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';

function readComponent(name: string): string {
  return readFileSync(resolve(__dirname, '..', name), 'utf-8');
}

describe('Image optimization — HeroSection', () => {
  const src = readComponent('HeroSection.astro');

  it('imports Image from astro:assets', () => {
    expect(src).toContain("import { Image } from 'astro:assets'");
  });

  it('imports hero-before.jpg from assets', () => {
    expect(src).toContain("from '../assets/images/hero-before.jpg'");
  });

  it('imports hero-after.jpg from assets', () => {
    expect(src).toContain("from '../assets/images/hero-after.jpg'");
  });

  it('uses eager loading', () => {
    expect(src).toContain('loading="eager"');
  });

  it('uses fetchpriority="high"', () => {
    expect(src).toContain('fetchpriority="high"');
  });

  it('specifies responsive widths', () => {
    expect(src).toContain('widths={[400, 800, 1200]}');
  });

  it('does not reference /images/ static paths', () => {
    expect(src).not.toContain('src="/images/');
  });
});

describe('Image optimization — BeforeAfterGallery', () => {
  const src = readComponent('BeforeAfterGallery.astro');

  it('imports Image from astro:assets', () => {
    expect(src).toContain("import { Image } from 'astro:assets'");
  });

  it('imports all 6 gallery images from assets', () => {
    for (let i = 1; i <= 3; i++) {
      expect(src).toContain(`gallery-${i}-before.jpg`);
      expect(src).toContain(`gallery-${i}-after.jpg`);
    }
  });

  it('uses lazy loading', () => {
    expect(src).toContain('loading="lazy"');
  });

  it('specifies responsive widths', () => {
    expect(src).toContain('widths={[400, 800, 1200]}');
  });

  it('does not reference /images/ static paths', () => {
    expect(src).not.toContain('src="/images/');
    expect(src).not.toMatch(/src=\{`\/images\//);
  });
});

describe('Image optimization — source images exist', () => {
  const assetsDir = resolve(__dirname, '..', '..', 'assets', 'images');
  const expectedImages = [
    'hero-before.jpg',
    'hero-after.jpg',
    'gallery-1-before.jpg',
    'gallery-1-after.jpg',
    'gallery-2-before.jpg',
    'gallery-2-after.jpg',
    'gallery-3-before.jpg',
    'gallery-3-after.jpg',
  ];

  it('all 8 source images exist in src/assets/images/', () => {
    for (const img of expectedImages) {
      expect(existsSync(resolve(assetsDir, img))).toBe(true);
    }
  });
});

describe('Image optimization — sharp dependency', () => {
  it('sharp is listed in package.json dependencies', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '..', '..', '..', 'package.json'), 'utf-8')
    );
    expect(pkg.dependencies).toHaveProperty('sharp');
  });
});

/**
 * Property-based test: No images reference public/images/ paths
 * **Validates: Requirements 6.1, 6.2, 6.5**
 */
describe('Property: No images reference public/images/ paths', () => {
  const heroSrc = readComponent('HeroSection.astro');
  const gallerySrc = readComponent('BeforeAfterGallery.astro');

  it('detects /images/ static path prefixes in any component source', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(heroSrc, gallerySrc),
        (componentSource: string) => {
          // No <img> or <Image> should use a /images/ static path
          const staticPathPattern = /src=["'`{]?\/?images\//g;
          return !staticPathPattern.test(componentSource);
        }
      ),
      { numRuns: 100 }
    );
  });
});
