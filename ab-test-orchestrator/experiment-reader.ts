// ─── Experiment Brief Reader ─────────────────────────────────────────────────
// Reads an experiment brief from the file system or accepts typed text.
// Supports .txt and .md files. Validates existence and size before reading.

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const SUPPORTED_EXTENSIONS = new Set(['.txt', '.md']);
const MAX_FILE_SIZE_BYTES = 256_000; // 250 KB — generous for experiment briefs

export interface ExperimentInput {
  source: 'file' | 'text';
  filePath?: string;
  content: string;
  wordCount: number;
}

/**
 * Read an experiment brief from a file path. Validates extension and size.
 */
export async function readExperimentFile(filePath: string): Promise<ExperimentInput> {
  const resolved = resolve(filePath);

  if (!existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  const ext = extname(resolved).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    throw new Error(
      `Unsupported file type "${ext}". Supported: ${[...SUPPORTED_EXTENSIONS].join(', ')}`
    );
  }

  const content = await readFile(resolved, 'utf-8');

  if (Buffer.byteLength(content, 'utf-8') > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / 1000} KB. Keep experiment briefs focused.`
    );
  }

  const trimmed = content.trim();
  if (trimmed.length === 0) {
    throw new Error('File is empty.');
  }

  return {
    source: 'file',
    filePath: resolved,
    content: trimmed,
    wordCount: trimmed.split(/\s+/).length,
  };
}

/**
 * Prompt the user to type an experiment hypothesis via stdin.
 */
export async function readExperimentFromStdin(): Promise<ExperimentInput> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log();
  console.log('  Type or paste your experiment hypothesis below.');
  console.log('  When finished, press Enter twice (empty line) to submit.');
  console.log();

  const lines: string[] = [];

  try {
    while (true) {
      const line = await rl.question('');
      if (line === '' && lines.length > 0) break;
      lines.push(line);
    }
  } finally {
    rl.close();
  }

  const content = lines.join('\n').trim();
  if (content.length === 0) {
    throw new Error('No experiment hypothesis provided.');
  }

  return {
    source: 'text',
    content,
    wordCount: content.split(/\s+/).length,
  };
}

/**
 * Format experiment input into a prompt for the squad.
 */
export function formatExperimentForPrompt(input: ExperimentInput): string {
  const sourceNote = input.source === 'file'
    ? `Source: ${input.filePath}`
    : 'Source: typed hypothesis';

  return `Please design a complete A/B test plan for the following experiment. Coordinate all four specialists: design the variants and success metrics, plan the traffic strategy, define statistical tests and monitoring rules, and prepare the analysis framework for interpreting results.

---
**Experiment Brief** (${input.wordCount} words — ${sourceNote})

${input.content}
---

Provide a structured, comprehensive A/B test plan. Include specific numbers for sample sizes, traffic splits, confidence thresholds, and estimated durations.`;
}
