/** A single review, either from Google or hardcoded */
export interface Review {
  authorName: string;
  rating: number; // 1-5
  text: string;
  relativeTime: string; // e.g. "2 weeks ago" or static string for hardcoded
}

/** Aggregated review data passed to TestimonialsSection */
export interface ReviewData {
  overallRating: number; // 1.0-5.0
  reviews: Review[];
  source: "google" | "hardcoded";
  profileUrl: string;
}

export const hardcodedTestimonials: Review[] = [
  {
    authorName: "James P.",
    rating: 5,
    text: "Brilliant service from start to finish. They cleared our gutters using the vacuum system — no ladders, no mess, and done in under an hour. Really impressed with how thorough they were, even showed us the camera footage after. Highly recommend to anyone in the Cambridgeshire area.",
    relativeTime: "2 months ago",
  },
  {
    authorName: "Sarah M.",
    rating: 5,
    text: "We had a blocked downpipe that was causing damp on the back wall. Warboys Gutter Clearing came out the same week, sorted it quickly and the price was very fair. Friendly and professional — will definitely use again.",
    relativeTime: "3 months ago",
  },
  {
    authorName: "David R.",
    rating: 5,
    text: "Used them for our two-storey extension that other companies couldn't reach without scaffolding. Their vacuum system handled it easily from the ground. Great communication too — got a reminder the day before. Top job.",
    relativeTime: "1 month ago",
  },
];
