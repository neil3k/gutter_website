import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { submitContactForm } from '../contact-form-submission';
import type { ContactFormData } from '../contact-form-validation';

/**
 * Property 8: Valid contact form submission sends data
 * Validates: Requirements 12.4
 *
 * For any ContactFormData where all required fields (name, email, telephone,
 * address) are non-empty and the email is valid, the form submission handler
 * shall POST the data to the configured form endpoint.
 */

// Arbitrary for a non-empty, non-whitespace-only string
const nonEmptyStringArb = fc
  .stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,49}$/)
  .filter((s) => s.trim().length > 0);

// Arbitrary for a valid email address
const validEmailArb = fc
  .tuple(
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,9}$/),
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,5}$/),
    fc.stringMatching(/^[a-zA-Z]{2,4}$/),
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

// Arbitrary for valid ContactFormData (all required fields non-empty, valid email)
const validContactFormDataArb: fc.Arbitrary<ContactFormData> = fc.record({
  name: nonEmptyStringArb,
  email: validEmailArb,
  telephone: nonEmptyStringArb,
  address: nonEmptyStringArb,
  message: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
}) as fc.Arbitrary<ContactFormData>;

// Arbitrary for a plausible endpoint URL
const endpointUrlArb = fc
  .stringMatching(/^[a-z]{3,8}$/)
  .map((path) => `https://api.example.com/${path}`);

describe('Property 8: Valid contact form submission sends data', () => {
  /**
   * **Validates: Requirements 12.4**
   */
  it('POSTs valid ContactFormData to the configured endpoint with correct payload', async () => {
    await fc.assert(
      fc.asyncProperty(
        validContactFormDataArb,
        endpointUrlArb,
        async (formData, endpoint) => {
          const mockFetch = vi.fn<typeof fetch>().mockResolvedValue(
            new Response(JSON.stringify({ ok: true }), { status: 200 }),
          );

          const result = await submitContactForm(formData, endpoint, mockFetch);

          // Submission must succeed
          expect(result.success).toBe(true);

          // fetch must have been called exactly once
          expect(mockFetch).toHaveBeenCalledTimes(1);

          // Verify the endpoint URL
          const [calledUrl, calledInit] = mockFetch.mock.calls[0];
          expect(calledUrl).toBe(endpoint);

          // Verify POST method and JSON content type
          expect(calledInit?.method).toBe('POST');
          expect(calledInit?.headers).toEqual({ 'Content-Type': 'application/json' });

          // Verify the payload matches the input data
          const sentBody = JSON.parse(calledInit?.body as string);
          expect(sentBody.name).toBe(formData.name);
          expect(sentBody.email).toBe(formData.email);
          expect(sentBody.telephone).toBe(formData.telephone);
          expect(sentBody.address).toBe(formData.address);
          if (formData.message !== undefined) {
            expect(sentBody.message).toBe(formData.message);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
