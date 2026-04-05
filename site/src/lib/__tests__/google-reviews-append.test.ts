import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { hardcodedTestimonials } from '../../data/hardcoded-testimonials';

/**
 * Property 5: Successful fetch appends hardcoded testimonials
 * Validates: Requirements 10.8
 *
 * For any successful Google Places API response containing 3 or more reviews,
 * fetchGoogleReviews() shall return a ReviewData where the reviews array begins
 * with the Google reviews and ends with the hardcoded testimonials appended,
 * and source is 'google'.
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

// Arbitrary for a successful API response with ≥3 reviews
const successResponseArb = fc.record({
  rating: fc.double({ min: 1, max: 5, noNaN: true }),
  reviews: fc.array(googleReviewArb, { minLength: 3, maxLength: 10 }),
});

describe('Property 5: Successful fetch appends hardcoded testimonials', () => {
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
   * **Validates: Requirements 10.8**
   */
  it('returns Google reviews followed by hardcoded testimonials with source "google"', async () => {
    await fc.assert(
      fc.asyncProperty(successResponseArb, async (apiResponse) => {
        vi.resetModules();

        // Set valid env vars so the API path is taken
        (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'test-place-id';
        (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'test-key';

        // Mock a successful fetch returning the generated reviews
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue({
            ok: true,
            json: async () => apiResponse,
          }),
        );

        const { fetchGoogleReviews } = await import('../google-reviews');
        const result = await fetchGoogleReviews();

        const googleCount = apiResponse.reviews.length;
        const hardcodedCount = hardcodedTestimonials.length;

        // Source must be 'google'
        expect(result.source).toBe('google');

        // Total reviews = Google reviews + hardcoded testimonials
        expect(result.reviews.length).toBe(googleCount + hardcodedCount);

        // First portion must be the mapped Google reviews
        for (let i = 0; i < googleCount; i++) {
          const apiReview = apiResponse.reviews[i];
          const resultReview = result.reviews[i];
          expect(resultReview.authorName).toBe(
            apiReview.authorAttribution.displayName,
          );
          expect(resultReview.rating).toBe(apiReview.rating);
          expect(resultReview.text).toBe(apiReview.text.text);
          expect(resultReview.relativeTime).toBe(
            apiReview.relativePublishTimeDescription,
          );
        }

        // Tail portion must be exactly the hardcoded testimonials
        const tail = result.reviews.slice(googleCount);
        expect(tail).toEqual(hardcodedTestimonials);
      }),
      { numRuns: 100 },
    );
  });
});
