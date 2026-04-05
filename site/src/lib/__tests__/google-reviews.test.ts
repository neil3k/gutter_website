import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hardcodedTestimonials } from '../../data/hardcoded-testimonials';

/**
 * Unit tests for fetchGoogleReviews()
 * Validates: Requirements 10.2, 10.7, 10.8, 10.11
 */

describe('fetchGoogleReviews – unit tests', () => {
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

  // Validates: Requirement 10.11
  it('returns hardcoded testimonials when both env vars are missing', async () => {
    delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID;
    delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY;

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.11
  it('returns hardcoded testimonials when GOOGLE_PLACE_ID is missing', async () => {
    delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID;
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'key-123';

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.11
  it('returns hardcoded testimonials when GOOGLE_PLACES_API_KEY is missing', async () => {
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'place-abc';
    delete (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY;

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.7
  it('returns hardcoded testimonials on API error (non-ok response)', async () => {
    vi.resetModules();
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'place-abc';
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'key-123';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.7
  it('returns hardcoded testimonials when fetch throws (network error)', async () => {
    vi.resetModules();
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'place-abc';
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'key-123';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network failure')),
    );

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.7
  it('returns hardcoded testimonials when fewer than 3 reviews returned', async () => {
    vi.resetModules();
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'place-abc';
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'key-123';

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rating: 4.5,
          reviews: [
            {
              authorAttribution: { displayName: 'Alice' },
              rating: 5,
              text: { text: 'Great' },
              relativePublishTimeDescription: '1 week ago',
            },
            {
              authorAttribution: { displayName: 'Bob' },
              rating: 4,
              text: { text: 'Good' },
              relativePublishTimeDescription: '2 weeks ago',
            },
          ],
        }),
      }),
    );

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('hardcoded');
    expect(result.reviews).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.8
  it('returns Google reviews with hardcoded appended on success (≥3 reviews)', async () => {
    vi.resetModules();
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'place-abc';
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'key-123';

    const apiReviews = [
      {
        authorAttribution: { displayName: 'Alice' },
        rating: 5,
        text: { text: 'Excellent work' },
        relativePublishTimeDescription: '1 week ago',
      },
      {
        authorAttribution: { displayName: 'Bob' },
        rating: 4,
        text: { text: 'Good job' },
        relativePublishTimeDescription: '2 weeks ago',
      },
      {
        authorAttribution: { displayName: 'Charlie' },
        rating: 5,
        text: { text: 'Highly recommend' },
        relativePublishTimeDescription: '3 weeks ago',
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ rating: 4.7, reviews: apiReviews }),
      }),
    );

    const { fetchGoogleReviews } = await import('../google-reviews');
    const result = await fetchGoogleReviews();

    expect(result.source).toBe('google');
    expect(result.overallRating).toBe(4.7);

    // Total = Google reviews + hardcoded
    expect(result.reviews.length).toBe(apiReviews.length + hardcodedTestimonials.length);

    // First 3 are the mapped Google reviews
    expect(result.reviews[0].authorName).toBe('Alice');
    expect(result.reviews[1].authorName).toBe('Bob');
    expect(result.reviews[2].authorName).toBe('Charlie');

    // Tail is the hardcoded testimonials
    const tail = result.reviews.slice(apiReviews.length);
    expect(tail).toEqual(hardcodedTestimonials);
  });

  // Validates: Requirement 10.2
  it('reads from GOOGLE_PLACE_ID and GOOGLE_PLACES_API_KEY env vars and calls correct endpoint', async () => {
    vi.resetModules();
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACE_ID = 'my-place-id';
    (import.meta.env as Record<string, unknown>).GOOGLE_PLACES_API_KEY = 'my-api-key';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rating: 4.5,
        reviews: [
          { authorAttribution: { displayName: 'A' }, rating: 5, text: { text: 'x' }, relativePublishTimeDescription: '1d' },
          { authorAttribution: { displayName: 'B' }, rating: 5, text: { text: 'y' }, relativePublishTimeDescription: '2d' },
          { authorAttribution: { displayName: 'C' }, rating: 5, text: { text: 'z' }, relativePublishTimeDescription: '3d' },
        ],
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const { fetchGoogleReviews } = await import('../google-reviews');
    await fetchGoogleReviews();

    // Verify fetch was called with the correct URL containing the place ID
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://places.googleapis.com/v1/places/my-place-id');

    // Verify the API key is sent in the header
    expect(options.headers['X-Goog-Api-Key']).toBe('my-api-key');
    expect(options.headers['X-Goog-FieldMask']).toBe('reviews,rating');
  });
});
