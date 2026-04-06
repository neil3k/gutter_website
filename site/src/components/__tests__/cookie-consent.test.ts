import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readComponent(name: string): string {
  return readFileSync(resolve(__dirname, '..', name), 'utf-8');
}

const src = readComponent('CookieConsent.astro');

/**
 * Unit tests for CookieConsent banner
 * Validates: Requirements 2.1, 2.3, 3.1–3.8, 5.3
 */
describe('CookieConsent banner – renders correctly when measurement ID is set', () => {
  it('conditionally renders based on PUBLIC_GA_MEASUREMENT_ID', () => {
    expect(src).toContain('PUBLIC_GA_MEASUREMENT_ID');
    expect(src).toMatch(/measurementId\s*&&/);
  });

  it('renders an Accept button', () => {
    expect(src).toContain('Accept');
    expect(src).toContain('cookie-accept');
  });

  it('renders a Reject button', () => {
    expect(src).toContain('Reject');
    expect(src).toContain('cookie-reject');
  });

  it('has role="dialog" on the banner', () => {
    expect(src).toContain('role="dialog"');
  });

  it('has aria-label on the banner', () => {
    expect(src).toContain('aria-label=');
  });

  it('uses #111111 background colour', () => {
    expect(src).toContain('#111111');
  });

  it('uses --font-body for text', () => {
    expect(src).toContain('var(--font-body)');
  });

  it('uses --font-heading for buttons', () => {
    expect(src).toContain('var(--font-heading)');
  });

  it('has z-index above 1100', () => {
    const zIndexMatch = src.match(/z-index:\s*(\d+)/);
    expect(zIndexMatch).not.toBeNull();
    expect(parseInt(zIndexMatch![1], 10)).toBeGreaterThan(1100);
  });

  it('Accept button uses --color-primary background', () => {
    expect(src).toContain('background-color: var(--color-primary)');
  });

  it('Accept button uses --color-secondary text', () => {
    expect(src).toContain('color: var(--color-secondary)');
  });

  it('Reject button uses transparent background', () => {
    expect(src).toContain('background-color: transparent');
  });

  it('both buttons have minimum 44px touch targets', () => {
    expect(src).toContain('min-width: 44px');
    expect(src).toContain('min-height: 44px');
  });

  it('banner is fixed at the bottom', () => {
    expect(src).toContain('position: fixed');
    expect(src).toContain('bottom: 0');
  });

  it('inline script reads consent from localStorage', () => {
    expect(src).toContain("localStorage.getItem(CONSENT_KEY)");
  });

  it('inline script stores consent on accept', () => {
    expect(src).toContain("setConsent('accepted')");
  });

  it('inline script stores consent on reject', () => {
    expect(src).toContain("setConsent('rejected')");
  });

  it('inline script loads GA4 on accept via googletagmanager URL', () => {
    expect(src).toContain('googletagmanager.com/gtag/js');
  });

  it('inline script calls gtag consent update with granted on accept', () => {
    expect(src).toContain("gtag('consent', 'update'");
    expect(src).toContain("analytics_storage: 'granted'");
  });

  it('inline script calls gtag config with measurementId', () => {
    expect(src).toContain("gtag('config', measurementId)");
  });
});

/**
 * Validates: Requirement 1.3
 * Banner is not rendered when measurement ID is absent
 */
describe('CookieConsent banner – not rendered when measurement ID is absent', () => {
  it('entire banner is wrapped in a measurementId conditional', () => {
    // The component reads the env var and only renders when truthy
    expect(src).toContain('const measurementId = import.meta.env.PUBLIC_GA_MEASUREMENT_ID');
    expect(src).toMatch(/measurementId\s*&&/);
  });

  it('banner div is inside a measurementId conditional', () => {
    // The banner HTML (div with id="cookie-consent-banner") is inside the conditional block
    // Style and script are at top level (Astro requirement) but the banner markup is gated
    expect(src).toMatch(/\{measurementId\s*&&\s*\(\s*\n\s*<div/);
  });
});
