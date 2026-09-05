import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export const GENERATED_OUTPUT_DIRECTORY = resolve(process.cwd(), '..', 'generated-output');

export function ensureGeneratedOutputDirectory(): string {
  mkdirSync(GENERATED_OUTPUT_DIRECTORY, { recursive: true });
  return GENERATED_OUTPUT_DIRECTORY;
}
