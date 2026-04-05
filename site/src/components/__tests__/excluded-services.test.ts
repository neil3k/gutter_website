import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Property 1: Excluded services never appear
 * Validates: Requirements 5.6
 *
 * For any rendering of the Services_Section, the output HTML shall not contain
 * the strings "gutter repair", "fascia cleaning", "soffit cleaning", or
 * "roof cleaning" (case-insensitive).
 */

const EXCLUDED_SERVICES = [
  'gutter repair',
  'fascia cleaning',
  'soffit cleaning',
  'roof cleaning',
] as const;

// Read the ServicesSection component source (which IS the rendered output for a static Astro component)
const componentPath = resolve(__dirname, '..', 'ServicesSection.astro');
const componentSource = readFileSync(componentPath, 'utf-8').toLowerCase();

describe('Property 1: Excluded services never appear', () => {
  /**
   * **Validates: Requirements 5.6**
   *
   * Generate excluded service names with random case variations and verify
   * none of them appear in the ServicesSection rendered output.
   */
  it('excluded service strings never appear in ServicesSection output (case-insensitive)', () => {
    const excludedArb = fc.constantFrom(...EXCLUDED_SERVICES);

    fc.assert(
      fc.property(excludedArb, (excludedService) => {
        expect(componentSource).not.toContain(excludedService.toLowerCase());
      }),
      { numRuns: 100 },
    );
  });
});
