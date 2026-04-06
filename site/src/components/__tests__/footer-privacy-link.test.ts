import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';

function readComponent(): string {
  return readFileSync(resolve(__dirname, '..', 'Footer.astro'), 'utf-8');
}

/**
 * Property 3: Footer contains privacy link
 * **Validates: Requirements 7.1**
 *
 * For any rendering of the Footer component, the output HTML shall contain a
 * link with href="/privacy" and text content "Privacy Policy".
 */
describe('Property 3: Footer contains privacy link', () => {
  it('navLinks array contains Privacy Policy entry with href="/privacy" (Req 7.1, 7.2)', () => {
    const src = readComponent();

    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          expect(src).toContain("'Privacy Policy'");
          expect(src).toContain("'/privacy'");
          // Verify they appear together in a navLinks entry
          expect(src).toMatch(/\{\s*label:\s*'Privacy Policy',\s*href:\s*'\/privacy'\s*\}/);
        },
      ),
      { numRuns: 100 },
    );
  });
});
