import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Property 9: CTA touch target minimum size
 * Validates: Requirements 15.4
 *
 * For all CTA button elements on the Website, the computed width and height
 * shall each be at least 44px. Since this is a static site without a browser
 * environment in tests, we verify:
 *   1. The CSS custom property --cta-min-size is defined as 44px in global.css
 *   2. The shared .cta-button class uses min-width/min-height referencing --cta-min-size
 *   3. All CTA-containing components either use the shared .cta-button class or
 *      define their own min-width/min-height of at least 44px (or reference --cta-min-size)
 */

const MINIMUM_TOUCH_TARGET_PX = 44;

// --- Helpers ---

function readSource(relativePath: string): string {
  return readFileSync(resolve(__dirname, relativePath), 'utf-8');
}

function parsePxValue(raw: string): number {
  const match = raw.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 0;
}

// --- Source files ---

const globalCss = readSource('../../styles/global.css');
const heroSource = readSource('../HeroSection.astro');
const ctaBannerSource = readSource('../CtaBanner.astro');
const stickyMobileCtaSource = readSource('../StickyMobileCta.astro');
const contactFormSource = readSource('../ContactForm.astro');

// --- Component descriptors ---

interface CtaComponent {
  name: string;
  source: string;
}

const CTA_COMPONENTS: CtaComponent[] = [
  { name: 'HeroSection', source: heroSource },
  { name: 'CtaBanner', source: ctaBannerSource },
  { name: 'StickyMobileCta', source: stickyMobileCtaSource },
  { name: 'ContactForm', source: contactFormSource },
];

describe('Property 9: CTA touch target minimum size', () => {
  /**
   * **Validates: Requirements 15.4**
   *
   * Verify the global CSS custom property --cta-min-size is set to at least 44px.
   */
  it('global.css defines --cta-min-size as at least 44px', () => {
    const match = globalCss.match(/--cta-min-size:\s*(\d+)px/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET_PX);
  });

  /**
   * **Validates: Requirements 15.4**
   *
   * Verify the shared .cta-button class in global.css sets both min-width and
   * min-height using the --cta-min-size custom property.
   */
  it('global.css .cta-button class enforces min-width and min-height via --cta-min-size', () => {
    // Extract the .cta-button rule block from global.css
    const ctaBlockMatch = globalCss.match(/\.cta-button\s*\{[^}]+\}/);
    expect(ctaBlockMatch).not.toBeNull();
    const ctaBlock = ctaBlockMatch![0];

    expect(ctaBlock).toMatch(/min-width:\s*var\(--cta-min-size\)/);
    expect(ctaBlock).toMatch(/min-height:\s*var\(--cta-min-size\)/);
  });

  /**
   * **Validates: Requirements 15.4**
   *
   * For each CTA-containing component, verify it either:
   *   a) Uses the shared .cta-button class (which inherits the 44px minimum), or
   *   b) Defines its own min-width/min-height of at least 44px or references --cta-min-size
   */
  it('all CTA components reference cta-button class or enforce ≥44px touch targets', () => {
    const componentArb = fc.constantFrom(...CTA_COMPONENTS);

    fc.assert(
      fc.property(componentArb, (component) => {
        const src = component.source;

        // The component must reference the shared .cta-button class
        const usesCtaButtonClass = src.includes('cta-button');

        // Or it must define its own minimum dimensions
        const definesMinSize =
          /min-height:\s*(var\(--cta-min-size\)|\d{2,}px)/.test(src) &&
          /min-width:\s*(var\(--cta-min-size\)|\d{2,}px)/.test(src);

        expect(
          usesCtaButtonClass || definesMinSize,
          `${component.name} must use .cta-button class or define min-width/min-height ≥44px`,
        ).toBe(true);

        // If the component defines explicit px values for min-height/min-width,
        // verify they are at least 44px
        const minHeightMatches = [...src.matchAll(/min-height:\s*(\d+)px/g)];
        for (const m of minHeightMatches) {
          expect(parsePxValue(m[0])).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET_PX);
        }

        const minWidthMatches = [...src.matchAll(/min-width:\s*(\d+)px/g)];
        for (const m of minWidthMatches) {
          expect(parsePxValue(m[0])).toBeGreaterThanOrEqual(MINIMUM_TOUCH_TARGET_PX);
        }
      }),
      { numRuns: 100 },
    );
  });
});
