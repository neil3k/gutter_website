import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { hardcodedTestimonials } from '../../data/hardcoded-testimonials';

/**
 * Property 4: Review fetch fallback on unavailability
 * Validates: Requirements 10.7, 10.11
 *
 * For any configuration where GOOGLE_PLACE_ID is missing, GOOGLE_PLACES_API_KEY
 * is missing, the Google Places API returns an error, or the API returns fewer
 * than 3 reviews, fetchGoogleReviews() shall return a ReviewData with
 * source: 'hardcoded' and reviews populated from the hardcoded testimonials.
 */

// Arbitrary for a Google review in API response shape
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

// Failure scenario types that should all trigger hardcoded fallback
type FailureScenario =
  | { type: 'missing_place_id' }
  | { type: 'missing_api_key' }
  | { type: 'missing_both' }
  | { type: 'api_error'; status: number }
  | { type: 'fewer_than_3_reviews'; reviews: unknown[]; rating: number };

const failureScenarioArb: fc.Arbitrary<FailureScenario> = fc.oneof(
  fc.constant({ type: 'missing_place_id' as const }),
  fc.constant({ type: 'missing_api_key' as const }),
  fc.constant({ type: 'missing_both' as const }),
  fc.integer({ min: 400, max: 599 }).map((status) => ({
    type: 'api_error' as const,
    status,
  })),
  fc
    .record({
      reviews: fc.array(googleReviewArb, { minLength: 0, maxLength: 2 }),
      rating: fc.double({ min: 1, max: 5, noNaN: true }),
    })
    .map(({ reviews, rating }) => ({
      type: 'fewer_than_3_reviews' as const,
      reviews,
      rating,
    })),
);

describe('Property 4: Review fetch fallback on unavailability', () => {
  let originalImportMetaEnv: Record<string, unknown>;

  beforeEach(() => {
    originalImportMetaEnv = { ...import.meta.env };
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
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
   * **Validates: Requirements 10.7, 10.11**
   */
  it('returns hardcoded fallback with source "hardcoded" for any failure scenario', async () => {
    await fc.assert(
      fc.asyncProperty(failureScenarioArb, async (scenario) => {
        vi.resetModules();

        // Configure env vars
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
          // api_error and fewer_than_3_reviews need valid env vars
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'test-place-id';
          (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'test-key';
        }

        // Configure fetch mock
        if (scenario.type === 'api_error') {
          vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
              ok: false,
              status: scenario.status,
            }),
          );
        } else if (scenario.type === 'fewer_than_3_reviews') {
          vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
              ok: true,
              json: async () => ({
                rating: scenario.rating,
                reviews: scenario.reviews,
              }),
            }),
          );
        }

        const { fetchGoogleReviews } = await import('../google-reviews');
        const result = await fetchGoogleReviews();

        // Must return hardcoded source
        expect(result.source).toBe('hardcoded');

        // Reviews must be exactly the hardcoded testimonials
        expect(result.reviews).toEqual(hardcodedTestimonials);

        // Overall rating must match hardcoded average
        const expectedRating =
          hardcodedTestimonials.reduce((sum, r) => sum + r.rating, 0) /
          hardcodedTestimonials.length;
        expect(result.overallRating).toBeCloseTo(expectedRating);
      }),
      { numRuns: 100 },
    );
  });
});
