import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateContactForm } from '../contact-form-validation';
import type { ContactFormData } from '../contact-form-validation';

/**
 * Property 7: Contact form validation rejects incomplete submissions
 * Validates: Requirements 12.5
 *
 * For any ContactFormData where at least one required field (name, email,
 * telephone, address) is empty or missing, the form validation function shall
 * return a failure result identifying all missing fields, and the form shall
 * not be submitted.
 */

const REQUIRED_FIELDS = ['name', 'email', 'telephone', 'address'] as const;

// Arbitrary for a non-empty, non-whitespace-only string
const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0);

// Arbitrary for an "empty" value: empty string, whitespace-only, or undefined
const emptyValueArb: fc.Arbitrary<string | undefined> = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('\t'),
  fc.constant(undefined as unknown as string),
);

// Arbitrary for a valid email address
const validEmailArb = fc
  .tuple(
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,9}$/),
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,5}$/),
    fc.stringMatching(/^[a-zA-Z]{2,4}$/),
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

// Generate form data where at least one required field is empty/missing
const incompleteFormDataArb: fc.Arbitrary<{
  data: Partial<ContactFormData>;
  emptyFields: string[];
}> = fc
  .record({
    // For each required field, randomly choose valid or empty
    nameIsEmpty: fc.boolean(),
    emailIsEmpty: fc.boolean(),
    telephoneIsEmpty: fc.boolean(),
    addressIsEmpty: fc.boolean(),
    // Values when populated
    nameValue: nonEmptyStringArb,
    emailValue: validEmailArb,
    telephoneValue: nonEmptyStringArb,
    addressValue: nonEmptyStringArb,
    // Empty values
    nameEmpty: emptyValueArb,
    emailEmpty: emptyValueArb,
    telephoneEmpty: emptyValueArb,
    addressEmpty: emptyValueArb,
    // Optional message
    message: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  })
  // Ensure at least one field is empty
  .filter(
    (r) => r.nameIsEmpty || r.emailIsEmpty || r.telephoneIsEmpty || r.addressIsEmpty,
  )
  .map((r) => {
    const emptyFields: string[] = [];
    const data: Partial<ContactFormData> = {};

    if (r.nameIsEmpty) {
      emptyFields.push('name');
      if (r.nameEmpty !== undefined) data.name = r.nameEmpty;
    } else {
      data.name = r.nameValue;
    }

    if (r.emailIsEmpty) {
      emptyFields.push('email');
      if (r.emailEmpty !== undefined) data.email = r.emailEmpty;
    } else {
      data.email = r.emailValue;
    }

    if (r.telephoneIsEmpty) {
      emptyFields.push('telephone');
      if (r.telephoneEmpty !== undefined) data.telephone = r.telephoneEmpty;
    } else {
      data.telephone = r.telephoneValue;
    }

    if (r.addressIsEmpty) {
      emptyFields.push('address');
      if (r.addressEmpty !== undefined) data.address = r.addressEmpty;
    } else {
      data.address = r.addressValue;
    }

    if (r.message !== undefined) {
      data.message = r.message;
    }

    return { data, emptyFields };
  });

describe('Property 7: Contact form validation rejects incomplete submissions', () => {
  /**
   * **Validates: Requirements 12.5**
   */
  it('rejects form data with at least one required field empty and identifies all missing fields', () => {
    fc.assert(
      fc.property(incompleteFormDataArb, ({ data, emptyFields }) => {
        const result = validateContactForm(data);

        // Validation must fail
        expect(result.valid).toBe(false);

        // Every field we made empty must appear in missingFields
        for (const field of emptyFields) {
          expect(result.missingFields).toContain(field);
        }

        // missingFields should only contain actual required fields
        for (const field of result.missingFields) {
          expect(REQUIRED_FIELDS).toContain(field);
        }
      }),
      { numRuns: 200 },
    );
  });
});


/**
 * Unit tests for contact form validation
 * Validates: Requirements 12.4, 12.5
 */
describe('Contact form validation – unit tests', () => {
  const validData = {
    name: 'John Smith',
    email: 'john@example.com',
    telephone: '01onal 123456',
    address: '10 High Street, Warboys',
    message: 'Please quote for gutter clearing.',
  };

  // Req 12.4 – accepts submission with all required fields valid
  it('accepts submission with all required fields valid', () => {
    const result = validateContactForm(validData);
    expect(result.valid).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  it('accepts submission when optional message is omitted', () => {
    const { message, ...withoutMessage } = validData;
    const result = validateContactForm(withoutMessage);
    expect(result.valid).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  // Req 12.5 – rejects submission with missing required fields
  it('rejects when name is missing', () => {
    const result = validateContactForm({ ...validData, name: '' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('name');
  });

  it('rejects when email is missing', () => {
    const result = validateContactForm({ ...validData, email: '' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('email');
  });

  it('rejects when telephone is missing', () => {
    const result = validateContactForm({ ...validData, telephone: '' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('telephone');
  });

  it('rejects when address is missing', () => {
    const result = validateContactForm({ ...validData, address: '' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('address');
  });

  it('identifies all missing fields when multiple are empty', () => {
    const result = validateContactForm({ name: '', email: '', telephone: '01234', address: '' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('name');
    expect(result.missingFields).toContain('email');
    expect(result.missingFields).toContain('address');
    expect(result.missingFields).not.toContain('telephone');
  });

  it('treats whitespace-only values as missing', () => {
    const result = validateContactForm({ ...validData, name: '   ', address: '\t' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('name');
    expect(result.missingFields).toContain('address');
  });

  // Req 12.5 – rejects invalid email format
  it('rejects invalid email format (no @ symbol)', () => {
    const result = validateContactForm({ ...validData, email: 'not-an-email' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('email');
  });

  it('rejects invalid email format (no domain)', () => {
    const result = validateContactForm({ ...validData, email: 'user@' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('email');
  });

  it('rejects invalid email format (no local part)', () => {
    const result = validateContactForm({ ...validData, email: '@example.com' });
    expect(result.valid).toBe(false);
    expect(result.missingFields).toContain('email');
  });
});
