import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PUBLIC_DIR = resolve(__dirname, '../../../public');
const LAYOUTS_DIR = resolve(__dirname, '../../layouts');

describe('Branded Favicon', () => {
  describe('Property 1: SVG favicon uses brand colours', () => {
    /**
     * **Validates: Requirement 1.1**
     */
    it('favicon.svg contains brand colour #FFD200', () => {
      const svg = readFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), 'utf-8');
      expect(svg.toLowerCase()).toContain('#ffd200');
    });

    it('favicon.svg contains brand colour #111111', () => {
      const svg = readFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), 'utf-8');
      expect(svg.toLowerCase()).toContain('#111111');
    });
  });

  describe('SVG favicon has square viewBox', () => {
    /**
     * **Validates: Requirement 1.2**
     */
    it('favicon.svg viewBox has equal width and height', () => {
      const svg = readFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), 'utf-8');
      const match = svg.match(/viewBox="(\d+)\s+(\d+)\s+(\d+)\s+(\d+)"/);
      expect(match).not.toBeNull();
      const [, , , width, height] = match!;
      expect(width).toBe(height);
    });
  });

  describe('Favicon files exist', () => {
    /**
     * **Validates: Requirements 1.3, 2.1, 3.1**
     */
    it.each([
      'favicon.svg',
      'favicon.ico',
      'apple-touch-icon.png',
    ])('%s exists in public directory', (filename) => {
      expect(existsSync(resolve(PUBLIC_DIR, filename))).toBe(true);
    });
  });

  describe('Property 2: Web app manifest schema completeness', () => {
    /**
     * **Validates: Requirements 4.2, 4.3, 4.4, 4.5**
     */
    it('site.webmanifest is valid JSON with correct fields', () => {
      const raw = readFileSync(resolve(PUBLIC_DIR, 'site.webmanifest'), 'utf-8');
      const manifest = JSON.parse(raw);

      expect(manifest.name).toBe('Warboys Gutter Clearing');
      expect(manifest.short_name).toBe('WGC');
      expect(manifest.theme_color).toBe('#FFD200');
      expect(manifest.background_color).toBe('#111111');
    });

    it('site.webmanifest icons array has SVG and PNG entries', () => {
      const raw = readFileSync(resolve(PUBLIC_DIR, 'site.webmanifest'), 'utf-8');
      const manifest = JSON.parse(raw);

      expect(manifest.icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            src: '/favicon.svg',
            type: 'image/svg+xml',
            purpose: 'any',
          }),
          expect.objectContaining({
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          }),
        ]),
      );
    });
  });

  describe('Property 3: BaseLayout contains all icon references', () => {
    const layout = readFileSync(resolve(LAYOUTS_DIR, 'BaseLayout.astro'), 'utf-8');

    /**
     * **Validates: Requirement 5.1**
     */
    it('contains SVG favicon link', () => {
      expect(layout).toContain('rel="icon" type="image/svg+xml" href="/favicon.svg"');
    });

    /**
     * **Validates: Requirement 5.2**
     */
    it('contains ICO favicon link', () => {
      expect(layout).toContain('rel="icon" type="image/x-icon" href="/favicon.ico"');
    });

    /**
     * **Validates: Requirement 5.3**
     */
    it('contains apple-touch-icon link', () => {
      expect(layout).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    });

    /**
     * **Validates: Requirement 5.4**
     */
    it('contains manifest link', () => {
      expect(layout).toContain('rel="manifest" href="/site.webmanifest"');
    });

    /**
     * **Validates: Requirement 5.5**
     */
    it('contains theme-color meta tag', () => {
      expect(layout).toContain('name="theme-color" content="#FFD200"');
    });
  });
});
