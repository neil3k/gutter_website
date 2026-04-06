import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const filePath = resolve(__dirname, '..', '404.astro');

function readPage(): string {
  return readFileSync(filePath, 'utf-8');
}

describe('404 page structure and content', () => {
  it('file exists at site/src/pages/404.astro (Req 1.1)', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  it('imports and uses BaseLayout (Req 1.3)', () => {
    const src = readPage();
    expect(src).toContain("import BaseLayout from '../layouts/BaseLayout.astro'");
    expect(src).toContain('<BaseLayout');
  });

  it('title prop is set to "Page Not Found" (Req 4.4, 6.2)', () => {
    const src = readPage();
    expect(src).toContain('title="Page Not Found"');
  });

  it('contains <meta name="robots" content="noindex"> (Req 6.1)', () => {
    const src = readPage();
    expect(src).toMatch(/<meta\s+name="robots"\s+content="noindex"/);
  });

  it('contains exactly one <h1> element (Req 4.3)', () => {
    const src = readPage();
    const h1Matches = src.match(/<h1[\s>]/g);
    expect(h1Matches).not.toBeNull();
    expect(h1Matches!.length).toBe(1);
  });

  it('heading text includes "Page Not Found" (Req 2.1)', () => {
    const src = readPage();
    expect(src).toMatch(/<h1[^>]*>.*Page Not Found.*<\/h1>/s);
  });

  it('contains a descriptive <p> message (Req 2.2)', () => {
    const src = readPage();
    expect(src).toMatch(/<p\s+class="error-page__message">/);
  });

  it('contains a "404" visual text element with aria-hidden="true" (Req 2.5)', () => {
    const src = readPage();
    expect(src).toMatch(/<span[^>]*aria-hidden="true"[^>]*>404<\/span>/);
  });

  it('contains <a href="/"> with text "Back to Homepage" using cta-button--primary (Req 2.3, 3.4)', () => {
    const src = readPage();
    expect(src).toMatch(/<a\s+href="\/"\s+class="[^"]*cta-button--primary[^"]*">Back to Homepage<\/a>/);
  });

  it('contains <a href="/contact"> with text "Contact Us" using cta-button--secondary (Req 2.4, 3.4)', () => {
    const src = readPage();
    expect(src).toMatch(/<a\s+href="\/contact"\s+class="[^"]*cta-button--secondary[^"]*">Contact Us<\/a>/);
  });

  it('contains a media query at 768px for responsive CTA stacking (Req 5.3)', () => {
    const src = readPage();
    expect(src).toMatch(/@media\s*\(\s*max-width:\s*768px\s*\)/);
  });

  it('CTA elements use .cta-button class (Req 4.2)', () => {
    const src = readPage();
    const ctaLinks = src.match(/<a[^>]*class="[^"]*cta-button[^"]*"[^>]*>/g);
    expect(ctaLinks).not.toBeNull();
    expect(ctaLinks!.length).toBeGreaterThanOrEqual(2);
    for (const link of ctaLinks!) {
      expect(link).toMatch(/class="[^"]*\bcta-button\b[^"]*"/);
    }
  });
});
