import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { hardcodedTestimonials } from '../../data/hardcoded-testimonials';

/**
 * Property 3: Minimum review count invariant
 * Validates: Requirements 10.5
 *
 * For any ReviewData object produced by fetchGoogleReviews(), the reviews
 * array shall contain at least 3 entries, regardless of whether the source
 * is 'google' or 'hardcoded'.
 */

// Arbitrary for a single Google review in the API response shape
const googleReviewArb = fc.record({
  authorAttribution: fc.record({
    displayName: fc.string({ minLength: 1, maxLength: 30 }),
  }),
  rating: fc.integer({ min: 1, max: 5 }),
  text: fc.record({
    text: fc.string({ minLength: 0, maxLength: 200 }),
  }),
  relativePublishTimeDescription: fc.string({ minLength: 1, maxLength: 30 }),
});

// Arbitrary for a successful API response with a variable number of reviews
const apiResponseArb = fc.record({
  rating: fc.double({ min: 1, max: 5, noNaN: true }),
  reviews: fc.array(googleReviewArb, { minLength: 0, maxLength: 10 }),
});

type Scenario =
  | { type: 'missing_place_id' }
  | { type: 'missing_api_key' }
  | { type: 'missing_both' }
  | { type: 'api_error'; status: number }
  | { type: 'api_success'; response: { rating: number; reviews: unknown[] } };

const scenarioArb: fc.Arbitrary<Scenario> = fc.oneof(
  fc.constant({ type: 'missing_place_id' as const }),
  fc.constant({ type: 'missing_api_key' as const }),
  fc.constant({ type: 'missing_both' as const }),
  fc.integer({ min: 400, max: 599 }).map((status) => ({
    type: 'api_error' as const,
    status,
  })),
  apiResponseArb.map((response) => ({
    type: 'api_success' as const,
    response,
  })),
);

describe('Property 3: Minimum review count invariant', () => {
  let originalImportMetaEnv: Record<string, unknown>;

  beforeEach(() => {
    originalImportMetaEnv = { ...import.meta.env };
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    // Restore env
    for (const key of Object.keys(import.meta.env)) {
      if (!(key in originalImportMetaEnv)) {
        delete (import.meta.env as Record<string, unknown>)[key];
      }
    }
    Object.assign(import.meta.env, originalImportMetaEnv);
    vi.restoreAllMocks();
    vi.resetModules();
  });

  /**
   * **Validates: Requirements 10.5**
   *
   * Generate random API response scenarios (success with varying review
   * counts, failures, missing env vars) and verify the output always has
   * ≥3 reviews.
   */
  it('fetchGoogleReviews always returns at least 3 reviews regardless of scenario', async () => {
    await fc.assert(
      fc.asyncProperty(scenarioArb, async (scenario) => {
        // Reset modules so fetchGoogleReviews re-reads import.meta.env
        vi.resetModules();

        // Configure env vars based on scenario
        if (scenario.type === 'missing_place_id') {
          delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID;
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'test-key';
        } else if (scenario.type === 'missing_api_key') {
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'test-place-id';
          delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY;
        } else if (scenario.type === 'missing_both') {
          delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID;
          delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY;
        } else {
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'test-place-id';
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'test-key';
        }

        // Configure fetch mock based on scenario
        if (scenario.type === 'api_error') {
          vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
              ok: false,
              status: scenario.status,
            }),
          );
        } else if (scenario.type === 'api_success') {
          vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
              ok: true,
              json: async () => scenario.response,
            }),
          );
        }
        // For missing env var scenarios, fetch won't be called

        const { fetchGoogleReviews } = await import('../google-reviews');
        const result = await fetchGoogleReviews();

        expect(result.reviews.length).toBeGreaterThanOrEqual(3);
      }),
      { numRuns: 100 },
    );
  });
});
