/**
 * Contact form submission logic extracted for testability.
 * Mirrors the inline fetch submission in ContactForm.astro.
 */

import { validateContactForm } from './contact-form-validation';
import type { ContactFormData } from './contact-form-validation';

export interface SubmissionResult {
  success: boolean;
  error?: string;
}

/**
 * Submits valid contact form data to the configured endpoint via POST.
 * Validates the data first; if invalid, returns a failure without calling fetch.
 */
export async function submitContactForm(
  data: ContactFormData,
  endpointUrl: string,
  fetchFn: typeof fetch = fetch,
): Promise<SubmissionResult> {
  const validation = validateContactForm(data);
  if (!validation.valid) {
    return { success: false, error: 'Validation failed' };
  }

  const response = await fetchFn(endpointUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return { success: false, error: 'Submission failed' };
  }

  return { success: true };
}
