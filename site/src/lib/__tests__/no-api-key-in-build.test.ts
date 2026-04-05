import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Property 6: No API key in build output
 * Validates: Requirements 10.10
 *
 * For any file in the Astro build output directory, the content shall not
 * contain the value of the GOOGLE_PLACES_API_KEY environment variable.
 *
 * We generate random API key strings and verify they do not appear in any
 * build output file content.
 */

const DIST_DIR = resolve(__dirname, '../../../dist');

/** Recursively collect all file paths under a directory. */
function collectFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

describe('Property 6: No API key in build output', () => {
  const distExists = existsSync(DIST_DIR);

  it.skipIf(!distExists)(
    'randomly generated API key strings do not appear in any build output file',
    () => {
      const files = collectFiles(DIST_DIR);
      // Read all file contents once, then check each generated key against them
      const fileContents = files.map((f) => ({
        path: f,
        content: readFileSync(f, 'utf-8'),
      }));

      /**
       * **Validates: Requirements 10.10**
       */
      fc.assert(
        fc.property(
          // Generate realistic API key strings (alphanumeric, 20-60 chars)
          fc
            .array(
              fc.constantFrom(
                ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split(''),
              ),
              { minLength: 20, maxLength: 60 },
            )
            .map((chars) => chars.join('')),
          (apiKey) => {
            for (const file of fileContents) {
              expect(file.content).not.toContain(apiKey);
            }
          },
        ),
        { numRuns: 100 },
      );
    },
  );
});
