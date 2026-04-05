/**
 * Contact form validation logic extracted for testability.
 * Mirrors the inline validation in ContactForm.astro.
 */

export interface ContactFormData {
  name: string;
  email: string;
  telephone: string;
  address: string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  missingFields: string[];
}

const REQUIRED_FIELDS: (keyof ContactFormData)[] = ['name', 'email', 'telephone', 'address'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates contact form data, returning which required fields are missing/empty.
 * A field is considered missing if it is undefined, null, or empty after trimming.
 */
export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const missingFields: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (!value || !value.trim()) {
      missingFields.push(field);
    }
  }

  // Email format check — only if email is present and non-empty
  if (data.email && data.email.trim() && !EMAIL_REGEX.test(data.email.trim())) {
    if (!missingFields.includes('email')) {
      missingFields.push('email');
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
