import type { BusinessInfo } from "../data/business-info";
import type { ReviewData } from "../data/hardcoded-testimonials";
import { hardcodedTestimonials } from "../data/hardcoded-testimonials";

export function buildLocalBusinessSchema(
  business: BusinessInfo,
  reviewData?: ReviewData,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    telephone: business.telephone,
    email: business.email,
    url: business.url,
    areaServed: business.serviceAreaLocalities.map((locality) => ({
      "@type": "Place",
      name: locality,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gutter Services",
      itemListElement: business.services.map((s) => ({
        "@type": "OfferCatalog",
        name: s.name,
        description: s.description,
      })),
    },
  };

  if (reviewData && reviewData.source === "google") {
    const googleReviewCount = reviewData.reviews.length - hardcodedTestimonials.length;
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewData.overallRating,
      reviewCount: googleReviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function buildServiceSchemas(
  business: BusinessInfo,
): Record<string, unknown>[] {
  return business.services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: business.name,
      url: business.url,
    },
    areaServed: business.serviceAreaLocalities.map((locality) => ({
      "@type": "Place",
      name: locality,
    })),
  }));
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
