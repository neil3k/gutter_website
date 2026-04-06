import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';

const filePath = resolve(__dirname, '..', 'privacy.astro');

function readPage(): string {
  return readFileSync(filePath, 'utf-8');
}

describe('Privacy policy page — example-based tests', () => {
  it('file exists at site/src/pages/privacy.astro (Req 1.3)', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('imports and uses BaseLayout (Req 1.2)', () => {
    const src = readPage();
    expect(src).toContain("import BaseLayout from '../layouts/BaseLayout.astro'");
    expect(src).toContain('<BaseLayout');
  });

  it('title prop is set to "Privacy Policy" (Req 1.2)', () => {
    const src = readPage();
    expect(src).toContain('title="Privacy Policy"');
  });

  it('contains business name and contact email (Req 2.1)', () => {
    const src = readPage();
    expect(src).toContain('Warboys Gutter Clearing');
    expect(src).toContain('warboysgutterclearing@btinternet.com');
  });

  it('mentions all contact form fields (Req 2.2)', () => {
    const src = readPage();
    const fields = ['Name', 'Email', 'Telephone', 'address', 'Message'];
    for (const field of fields) {
      expect(src.toLowerCase()).toContain(field.toLowerCase());
    }
  });

  it('mentions analytics cookies and consent (Req 2.3, 2.4)', () => {
    const src = readPage();
    expect(src).toContain('Google Analytics 4');
    expect(src.toLowerCase()).toContain('consent');
    expect(src.toLowerCase()).toContain('cookies');
  });

  it('lists Google and AWS as third parties (Req 3.3)', () => {
    const src = readPage();
    expect(src).toContain('Google');
    expect(src).toContain('AWS');
  });

  it('includes no-sale statement (Req 3.4)', () => {
    const src = readPage();
    expect(src.toLowerCase()).toContain('not sell');
  });

  it('mentions retention periods (Req 4.1, 4.2)', () => {
    const src = readPage();
    expect(src.toLowerCase()).toContain('retain');
  });

  it('mentions ICO with URL (Req 5.3)', () => {
    const src = readPage();
    expect(src).toContain('ico.org.uk');
    expect(src).toContain('Information Commissioner');
  });

  it('lists cookie types and browser management instructions (Req 6.1, 6.3)', () => {
    const src = readPage();
    expect(src.toLowerCase()).toContain('analytics cookies');
    expect(src.toLowerCase()).toContain('browser');
  });
});

/**
 * Property 1: UK GDPR rights completeness
 * **Validates: Requirements 5.1**
 *
 * For any rendering of the Privacy_Page, the output HTML shall contain all six
 * UK GDPR visitor rights.
 */
describe('Property 1: UK GDPR rights completeness', () => {
  const ukGdprRights = [
    'right of access',
    'right to rectification',
    'right to erasure',
    'right to restrict processing',
    'right to data portability',
    'right to object',
  ] as const;

  it('all six UK GDPR rights appear in the page content', () => {
    const src = readPage().toLowerCase();

    fc.assert(
      fc.property(
        fc.constantFrom(...ukGdprRights),
        (right) => {
          expect(src).toContain(right);
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 2: Semantic heading hierarchy
 * **Validates: Requirements 8.4**
 *
 * For any rendering of the Privacy_Page, heading elements shall follow a valid
 * hierarchy where no heading level is skipped.
 */
describe('Property 2: Semantic heading hierarchy', () => {
  it('no heading level is skipped', () => {
    const src = readPage();
    const headingRegex = /<h([1-6])[^>]*>/g;
    const levels: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(src)) !== null) {
      levels.push(parseInt(match[1], 10));
    }

    expect(levels.length).toBeGreaterThan(0);

    // Generate random pairs of consecutive headings and verify no level is skipped
    const pairs = levels.slice(0, -1).map((level, i) => ({
      current: level,
      next: levels[i + 1],
      index: i,
    }));

    fc.assert(
      fc.property(
        fc.constantFrom(...pairs),
        (pair) => {
          // Next heading can be same level, deeper by 1, or any shallower level
          const jump = pair.next - pair.current;
          expect(jump).toBeLessThanOrEqual(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
