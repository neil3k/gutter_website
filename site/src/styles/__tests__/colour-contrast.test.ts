import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Property 10: Colour contrast compliance
 * Validates: Requirements 15.5
 *
 * For all foreground/background colour pairs defined in the Design_System
 * and used for text rendering, the contrast ratio shall be at least 4.5:1
 * for normal text and at least 3:1 for large text (≥18pt or ≥14pt bold).
 */

// Design System colour tokens from global.css
const COLOURS = {
  primary: '#FFD200',
  secondary: '#111111',
  bgWhite: '#FFFFFF',
  bgGrey: '#F5F5F5',
  textLight: '#FFFFFF',
  textDark: '#111111',
} as const;

// All foreground/background pairs actually used in the site for text rendering
const TEXT_COLOUR_PAIRS: Array<{
  name: string;
  fg: string;
  bg: string;
  isLargeText: boolean;
}> = [
  // Body text on white background (normal text)
  { name: 'text-dark on bg-white', fg: COLOURS.textDark, bg: COLOURS.bgWhite, isLargeText: false },
  // Body text on grey background (normal text, e.g. HowItWorks)
  { name: 'text-dark on bg-grey', fg: COLOURS.textDark, bg: COLOURS.bgGrey, isLargeText: false },
  // White text on dark background (normal text, e.g. WhyChooseUs, Footer)
  { name: 'text-light on secondary', fg: COLOURS.textLight, bg: COLOURS.secondary, isLargeText: false },
  // Primary CTA button: dark text on yellow (large text — bold uppercase headings font)
  { name: 'secondary on primary (CTA)', fg: COLOURS.secondary, bg: COLOURS.primary, isLargeText: true },
  // Headings on white background (large text)
  { name: 'text-dark on bg-white (heading)', fg: COLOURS.textDark, bg: COLOURS.bgWhite, isLargeText: true },
  // Headings on grey background (large text)
  { name: 'text-dark on bg-grey (heading)', fg: COLOURS.textDark, bg: COLOURS.bgGrey, isLargeText: true },
  // Headings on dark background (large text)
  { name: 'text-light on secondary (heading)', fg: COLOURS.textLight, bg: COLOURS.secondary, isLargeText: true },
  // Primary accent text on dark background (large text — headings/accents)
  { name: 'primary on secondary (accent)', fg: COLOURS.primary, bg: COLOURS.secondary, isLargeText: true },
];

/** Parse a hex colour string to RGB components */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

/** Convert an sRGB component (0-255) to relative luminance component */
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/** Calculate relative luminance per WCAG 2.x definition */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** Calculate WCAG contrast ratio between two colours */
function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Property 10: Colour contrast compliance', () => {
  /**
   * **Validates: Requirements 15.5**
   *
   * Generate all foreground/background colour pairs from the Design_System
   * and verify contrast ratios meet WCAG thresholds.
   */
  it('all Design_System text colour pairs meet WCAG contrast thresholds', () => {
    const pairArb = fc.constantFrom(...TEXT_COLOUR_PAIRS);

    fc.assert(
      fc.property(pairArb, (pair) => {
        const ratio = contrastRatio(pair.fg, pair.bg);
        const threshold = pair.isLargeText ? 3 : 4.5;

        expect(ratio).toBeGreaterThanOrEqual(threshold);
      }),
      { numRuns: 100 },
    );
  });
});
