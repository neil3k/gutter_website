import {
  hardcodedTestimonials,
  type Review,
  type ReviewData,
} from "../data/hardcoded-testimonials";

function getHardcodedFallback(profileUrl: string): ReviewData {
  const total = hardcodedTestimonials.reduce((sum, r) => sum + r.rating, 0);
  return {
    overallRating: total / hardcodedTestimonials.length,
    reviews: hardcodedTestimonials,
    source: "hardcoded",
    profileUrl,
  };
}

export async function fetchGoogleReviews(): Promise<ReviewData> {
  const placeId = import.meta.env.GOOGLE_PLACE_ID as string | undefined;
  const apiKey = import.meta.env.GOOGLE_PLACES_API_KEY as string | undefined;
  const profileUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : "https://search.google.com/local/reviews";

  if (!placeId || !apiKey) {
    console.warn("[reviews] Missing GOOGLE_PLACE_ID or GOOGLE_PLACES_API_KEY — using hardcoded testimonials.");
    return getHardcodedFallback(profileUrl);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews,rating",
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[reviews] Google Places API returned ${response.status} — using hardcoded testimonials.`);
      return getHardcodedFallback(profileUrl);
    }

    const data = await response.json();

    const googleReviews: Review[] = (data.reviews ?? []).map(
      (r: { authorAttribution?: { displayName?: string }; rating?: number; text?: { text?: string }; relativePublishTimeDescription?: string }) => ({
        authorName: r.authorAttribution?.displayName ?? "Anonymous",
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
      }),
    );

    if (googleReviews.length < 3) {
      console.warn(`[reviews] Only ${googleReviews.length} Google reviews — using hardcoded testimonials.`);
      return getHardcodedFallback(profileUrl);
    }

    const allReviews = [...googleReviews, ...hardcodedTestimonials];
    const overallRating = data.rating ?? googleReviews.reduce((s, r) => s + r.rating, 0) / googleReviews.length;

    return {
      overallRating,
      reviews: allReviews,
      source: "google",
      profileUrl,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[reviews] Failed to fetch Google reviews: ${msg} — using hardcoded testimonials.`);
    return getHardcodedFallback(profileUrl);
  }
}
