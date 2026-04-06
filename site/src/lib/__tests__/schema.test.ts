import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { businessInfo } from '../../data/business-info';
import type { BusinessInfo, BusinessAddress, ServiceInfo } from '../../data/business-info';
import type { ReviewData, Review } from '../../data/hardcoded-testimonials';
import {
  buildLocalBusinessSchema,
  buildServiceSchemas,
  buildBreadcrumbSchema,
} from '../schema';

// ── Arbitraries ──────────────────────────────────────────────────────

const arbAddress: fc.Arbitrary<BusinessAddress> = fc.record({
  streetAddress: fc.string({ minLength: 1 }),
  addressLocality: fc.string({ minLength: 1 }),
  addressRegion: fc.string({ minLength: 1 }),
  postalCode: fc.string({ minLength: 1 }),
  addressCountry: fc.string({ minLength: 2, maxLength: 2 }),
});

const arbServiceInfo: fc.Arbitrary<ServiceInfo> = fc.record({
  name: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
});

const arbBusinessInfo: fc.Arbitrary<BusinessInfo> = fc.record({
  name: fc.string({ minLength: 1 }),
  address: arbAddress,
  telephone: fc.string({ minLength: 1 }),
  email: fc.emailAddress(),
  url: fc.webUrl(),
  googleBusinessUrl: fc.webUrl(),
  serviceAreaLocalities: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
  services: fc.array(arbServiceInfo, { minLength: 0, maxLength: 10 }),
});

const arbReview: fc.Arbitrary<Review> = fc.record({
  authorName: fc.string({ minLength: 1 }),
  rating: fc.integer({ min: 1, max: 5 }),
  text: fc.string(),
  relativeTime: fc.string(),
});

const arbReviewData = (source: 'google' | 'hardcoded'): fc.Arbitrary<ReviewData> =>
  fc.record({
    overallRating: fc.double({ min: 1, max: 5, noNaN: true }),
    reviews: fc.array(arbReview, { minLength: 3, maxLength: 20 }),
    source: fc.constant(source),
    profileUrl: fc.webUrl(),
  });

// ── Unit Tests (Task 7.1) ───────────────────────────────────────────

describe('schema generators – unit tests', () => {
  describe('buildLocalBusinessSchema', () => {
    it('produces correct @context, @type, name, address, telephone, email, url', () => {
      const schema = buildLocalBusinessSchema(businessInfo);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('Warboys Gutter Clearing');
      expect(schema.telephone).toBe('07936085632');
      expect(schema.email).toBe('warboysgutterclearing@btinternet.com');
      expect(schema.url).toBe('https://warboysgutterclearing.co.uk');

      const address = schema.address as Record<string, unknown>;
      expect(address['@type']).toBe('PostalAddress');
      expect(address.streetAddress).toBe('Warboys');
      expect(address.addressLocality).toBe('Warboys');
      expect(address.addressRegion).toBe('Cambridgeshire');
      expect(address.postalCode).toBe('PE28');
      expect(address.addressCountry).toBe('GB');
    });

    it('includes aggregateRating when source is "google"', () => {
      const reviewData: ReviewData = {
        overallRating: 4.8,
        reviews: [
          { authorName: 'A', rating: 5, text: 'Great', relativeTime: '1 week ago' },
          { authorName: 'B', rating: 5, text: 'Good', relativeTime: '2 weeks ago' },
          { authorName: 'C', rating: 4, text: 'Nice', relativeTime: '3 weeks ago' },
          // plus 3 hardcoded = 6 total, so googleReviewCount = 6 - 3 = 3
          { authorName: 'James P.', rating: 5, text: 'Brilliant', relativeTime: '2 months ago' },
          { authorName: 'Sarah M.', rating: 5, text: 'Great', relativeTime: '3 months ago' },
          { authorName: 'David R.', rating: 5, text: 'Top job', relativeTime: '1 month ago' },
        ],
        source: 'google',
        profileUrl: 'https://search.google.com/local/reviews',
      };
      const schema = buildLocalBusinessSchema(businessInfo, reviewData);
      const rating = schema.aggregateRating as Record<string, unknown>;
      expect(rating).toBeDefined();
      expect(rating['@type']).toBe('AggregateRating');
      expect(rating.ratingValue).toBe(4.8);
      expect(rating.reviewCount).toBe(3); // 6 total - 3 hardcoded
      expect(rating.bestRating).toBe(5);
      expect(rating.worstRating).toBe(1);
    });

    it('omits aggregateRating when source is "hardcoded"', () => {
      const reviewData: ReviewData = {
        overallRating: 5,
        reviews: [
          { authorName: 'James P.', rating: 5, text: 'Brilliant', relativeTime: '2 months ago' },
          { authorName: 'Sarah M.', rating: 5, text: 'Great', relativeTime: '3 months ago' },
          { authorName: 'David R.', rating: 5, text: 'Top job', relativeTime: '1 month ago' },
        ],
        source: 'hardcoded',
        profileUrl: 'https://search.google.com/local/reviews',
      };
      const schema = buildLocalBusinessSchema(businessInfo, reviewData);
      expect(schema.aggregateRating).toBeUndefined();
    });

    it('omits aggregateRating when reviewData is undefined', () => {
      const schema = buildLocalBusinessSchema(businessInfo);
      expect(schema.aggregateRating).toBeUndefined();
    });
  });

  describe('buildServiceSchemas', () => {
    it('returns 4 services with correct names', () => {
      const schemas = buildServiceSchemas(businessInfo);
      expect(schemas).toHaveLength(4);
      expect(schemas[0].name).toBe('Gutter Clearing');
      expect(schemas[1].name).toBe('Gutter Guard Installation');
      expect(schemas[2].name).toBe('Downpipe Clearing & Minor Maintenance');
      expect(schemas[3].name).toBe('Domestic & Small Commercial Properties');
      for (const s of schemas) {
        expect(s['@context']).toBe('https://schema.org');
        expect(s['@type']).toBe('Service');
      }
    });
  });

  describe('buildBreadcrumbSchema', () => {
    it('returns correct 2-item breadcrumb for contact page', () => {
      const schema = buildBreadcrumbSchema('https://warboysgutterclearing.co.uk', [
        { name: 'Home', url: 'https://warboysgutterclearing.co.uk' },
        { name: 'Contact Us', url: 'https://warboysgutterclearing.co.uk/contact' },
      ]);
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      const items = schema.itemListElement as Record<string, unknown>[];
      expect(items).toHaveLength(2);
      expect(items[0].position).toBe(1);
      expect(items[0].name).toBe('Home');
      expect(items[0].item).toBe('https://warboysgutterclearing.co.uk');
      expect(items[1].position).toBe(2);
      expect(items[1].name).toBe('Contact Us');
      expect(items[1].item).toBe('https://warboysgutterclearing.co.uk/contact');
    });
  });
});


// ── Property-Based Tests ─────────────────────────────────────────────

/**
 * Validates: Requirements 1.4, 2.1, 7.1
 */
describe('PBT Property 1: LocalBusiness schema mirrors business data', () => {
  it('output fields match input (name, telephone, email, url, address fields)', () => {
    fc.assert(
      fc.property(arbBusinessInfo, (biz) => {
        const schema = buildLocalBusinessSchema(biz);
        expect(schema.name).toBe(biz.name);
        expect(schema.telephone).toBe(biz.telephone);
        expect(schema.email).toBe(biz.email);
        expect(schema.url).toBe(biz.url);

        const address = schema.address as Record<string, unknown>;
        expect(address.streetAddress).toBe(biz.address.streetAddress);
        expect(address.addressLocality).toBe(biz.address.addressLocality);
        expect(address.addressRegion).toBe(biz.address.addressRegion);
        expect(address.postalCode).toBe(biz.address.postalCode);
        expect(address.addressCountry).toBe(biz.address.addressCountry);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 3.1, 3.2
 */
describe('PBT Property 2: AggregateRating presence depends on review source', () => {
  it('aggregateRating present when source is "google", absent when "hardcoded"', () => {
    fc.assert(
      fc.property(
        arbBusinessInfo,
        fc.oneof(arbReviewData('google'), arbReviewData('hardcoded')),
        (biz, reviewData) => {
          const schema = buildLocalBusinessSchema(biz, reviewData);
          if (reviewData.source === 'google') {
            expect(schema.aggregateRating).toBeDefined();
            const rating = schema.aggregateRating as Record<string, unknown>;
            expect(rating['@type']).toBe('AggregateRating');
            expect(rating.bestRating).toBe(5);
            expect(rating.worstRating).toBe(1);
          } else {
            expect(schema.aggregateRating).toBeUndefined();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 4.1, 4.3
 */
describe('PBT Property 3: Service count matches input', () => {
  it('output count and field values match input services', () => {
    fc.assert(
      fc.property(arbBusinessInfo, (biz) => {
        const schemas = buildServiceSchemas(biz);
        expect(schemas).toHaveLength(biz.services.length);
        for (let i = 0; i < biz.services.length; i++) {
          expect(schemas[i]['@type']).toBe('Service');
          expect(schemas[i].name).toBe(biz.services[i].name);
          expect(schemas[i].description).toBe(biz.services[i].description);
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 6.2
 */
describe('PBT Property 4: All JSON-LD objects include @context', () => {
  it('every schema object has @context set to "https://schema.org"', () => {
    fc.assert(
      fc.property(
        arbBusinessInfo,
        fc.array(fc.record({ name: fc.string({ minLength: 1 }), url: fc.webUrl() }), { minLength: 1, maxLength: 5 }),
        (biz, breadcrumbItems) => {
          const localBiz = buildLocalBusinessSchema(biz);
          expect(localBiz['@context']).toBe('https://schema.org');

          const services = buildServiceSchemas(biz);
          for (const s of services) {
            expect(s['@context']).toBe('https://schema.org');
          }

          const breadcrumb = buildBreadcrumbSchema(biz.url, breadcrumbItems);
          expect(breadcrumb['@context']).toBe('https://schema.org');
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 6.3
 */
describe('PBT Property 5: JSON-LD round-trip serialisation', () => {
  it('JSON.parse(JSON.stringify(obj)) deep-equals obj', () => {
    fc.assert(
      fc.property(
        arbBusinessInfo,
        fc.array(fc.record({ name: fc.string({ minLength: 1 }), url: fc.webUrl() }), { minLength: 1, maxLength: 5 }),
        (biz, breadcrumbItems) => {
          const localBiz = buildLocalBusinessSchema(biz);
          expect(JSON.parse(JSON.stringify(localBiz))).toEqual(localBiz);

          const services = buildServiceSchemas(biz);
          for (const s of services) {
            expect(JSON.parse(JSON.stringify(s))).toEqual(s);
          }

          const breadcrumb = buildBreadcrumbSchema(biz.url, breadcrumbItems);
          expect(JSON.parse(JSON.stringify(breadcrumb))).toEqual(breadcrumb);
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Validates: Requirements 2.4
 */
describe('PBT Property 6: areaServed completeness', () => {
  it('areaServed output has matching count and names', () => {
    fc.assert(
      fc.property(arbBusinessInfo, (biz) => {
        const schema = buildLocalBusinessSchema(biz);
        const areaServed = schema.areaServed as { '@type': string; name: string }[];
        expect(areaServed).toHaveLength(biz.serviceAreaLocalities.length);
        for (let i = 0; i < biz.serviceAreaLocalities.length; i++) {
          expect(areaServed[i].name).toBe(biz.serviceAreaLocalities[i]);
          expect(areaServed[i]['@type']).toBe('Place');
        }
      }),
      { numRuns: 100 },
    );
  });
});
