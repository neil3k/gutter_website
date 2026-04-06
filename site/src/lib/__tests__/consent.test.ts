import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { CONSENT_KEY, getConsent, setConsent } from '../consent';

/**
 * Simple localStorage mock for testing
 */
function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const key of Object.keys(store)) delete store[key]; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
    _store: store,
  };
}

let mockStorage: ReturnType<typeof createLocalStorageMock>;

beforeEach(() => {
  mockStorage = createLocalStorageMock();
  vi.stubGlobal('localStorage', mockStorage);
});

/**
 * Unit tests for consent module
 * Validates: Requirements 4.1, 4.2
 */
describe('consent module – unit tests', () => {
  it('getConsent() returns null when localStorage is empty', () => {
    expect(getConsent()).toBeNull();
  });

  it('getConsent() returns "accepted" when stored', () => {
    mockStorage.setItem(CONSENT_KEY, 'accepted');
    expect(getConsent()).toBe('accepted');
  });

  it('getConsent() returns "rejected" when stored', () => {
    mockStorage.setItem(CONSENT_KEY, 'rejected');
    expect(getConsent()).toBe('rejected');
  });

  it('getConsent() returns null for invalid stored values', () => {
    mockStorage.setItem(CONSENT_KEY, 'maybe');
    expect(getConsent()).toBeNull();
  });

  it('getConsent() returns null for empty string', () => {
    mockStorage.setItem(CONSENT_KEY, '');
    expect(getConsent()).toBeNull();
  });

  it('setConsent("accepted") stores "accepted" under the consent key', () => {
    setConsent('accepted');
    expect(mockStorage.getItem(CONSENT_KEY)).toBe('accepted');
  });

  it('setConsent("rejected") stores "rejected" under the consent key', () => {
    setConsent('rejected');
    expect(mockStorage.getItem(CONSENT_KEY)).toBe('rejected');
  });

  it('CONSENT_KEY equals "cookie-consent"', () => {
    expect(CONSENT_KEY).toBe('cookie-consent');
  });
});

/**
 * Property 3: Consent value integrity
 * Validates: Requirements 4.1, 4.2
 *
 * For any random string stored in localStorage under the consent key,
 * getConsent() returns only "accepted", "rejected", or null — never any other value.
 */
describe('Property 3: Consent value integrity', () => {
  /**
   * **Validates: Requirements 4.1, 4.2**
   */
  it('getConsent() only returns "accepted", "rejected", or null for any stored value', () => {
    fc.assert(
      fc.property(fc.string(), (randomValue) => {
        mockStorage.setItem(CONSENT_KEY, randomValue);
        const result = getConsent();
        expect(result === 'accepted' || result === 'rejected' || result === null).toBe(true);
      }),
      { numRuns: 200 },
    );
  });
});
