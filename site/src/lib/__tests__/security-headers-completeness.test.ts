import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Property 11: Security headers completeness
 * Validates: Requirements 17.4
 *
 * For all responses served by the CloudFront_Distribution, the response headers
 * shall include Content-Security-Policy, X-Frame-Options, X-Content-Type-Options,
 * Strict-Transport-Security, and Referrer-Policy.
 *
 * This test reads the Terraform CloudFront module's main.tf and verifies the
 * aws_cloudfront_response_headers_policy resource includes all 5 required
 * security header configuration blocks.
 */

const CLOUDFRONT_TF_PATH = resolve(__dirname, '../../../../infra/modules/cloudfront/main.tf');

/** The 5 required security headers and their corresponding Terraform block names */
const REQUIRED_SECURITY_HEADERS: { header: string; tfBlock: string }[] = [
  { header: 'Content-Security-Policy', tfBlock: 'content_security_policy' },
  { header: 'X-Frame-Options', tfBlock: 'frame_options' },
  { header: 'X-Content-Type-Options', tfBlock: 'content_type_options' },
  { header: 'Strict-Transport-Security', tfBlock: 'strict_transport_security' },
  { header: 'Referrer-Policy', tfBlock: 'referrer_policy' },
];

describe('Property 11: Security headers completeness', () => {
  const tfContent = readFileSync(CLOUDFRONT_TF_PATH, 'utf-8');

  it('CloudFront response headers policy contains all 5 required security headers', () => {
    /**
     * **Validates: Requirements 17.4**
     */
    fc.assert(
      fc.property(
        fc.constantFrom(...REQUIRED_SECURITY_HEADERS),
        ({ header, tfBlock }) => {
          // Verify the Terraform config contains the security_headers_config block
          expect(tfContent).toContain('security_headers_config');

          // Verify the specific header block exists within the Terraform config
          expect(tfContent).toContain(tfBlock);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('security_headers_config block is inside aws_cloudfront_response_headers_policy resource', () => {
    // Extract the response headers policy resource block
    const policyMatch = tfContent.match(
      /resource\s+"aws_cloudfront_response_headers_policy"\s+"\w+"\s*\{[\s\S]*?\n\}/,
    );
    expect(policyMatch).not.toBeNull();

    const policyBlock = policyMatch![0];

    // Verify security_headers_config is within the policy resource
    expect(policyBlock).toContain('security_headers_config');

    /**
     * **Validates: Requirements 17.4**
     *
     * For any subset of the 5 required headers, all must be present
     * in the response headers policy resource.
     */
    fc.assert(
      fc.property(
        fc.subarray(REQUIRED_SECURITY_HEADERS, { minLength: 1 }),
        (headerSubset) => {
          for (const { tfBlock } of headerSubset) {
            expect(policyBlock).toContain(tfBlock);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
