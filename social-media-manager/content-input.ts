// ─── Content Input ───────────────────────────────────────────────────────────
// Prompts the user for their content theme and formats it for the Squad.

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  white: '\x1b[37m',
};

const EXAMPLES = [
  'Launching an AI-powered code review tool for developers — emphasize time savings and code quality improvements.',
  'Weekly tech content about cloud infrastructure best practices — target DevOps engineers and cloud architects.',
  'Product update: new API endpoints and improved documentation — highlight developer experience improvements.',
  'Behind-the-scenes: how our team uses AI to improve developer tools.',
];

export async function getContentInput(): Promise<{ prompt: string; rl: ReturnType<typeof createInterface> }> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log(`${C.cyan}  What content do you want to create social media posts for?${C.reset}`);
  console.log(`${C.dim}  Enter a theme/topic, or type a filename to load a content brief.${C.reset}`);
  console.log();
  console.log(`${C.dim}  Examples:${C.reset}`);
  for (const ex of EXAMPLES) {
    console.log(`${C.dim}    - ${ex}${C.reset}`);
  }
  console.log();
  console.log(`${C.dim}  Sample briefs available:${C.reset}`);
  console.log(`${C.dim}    - content-briefs/product-launch.md${C.reset}`);
  console.log(`${C.dim}    - content-briefs/weekly-tech-content.md${C.reset}`);
  console.log();

  const userInput = await rl.question(`${C.green}  > ${C.reset}`);

  if (!userInput.trim()) {
    console.log(`${C.yellow}  No input provided. Using example brief: content-briefs/product-launch.md${C.reset}`);
    const content = await loadBrief('content-briefs/product-launch.md');
    return { prompt: formatForSquad(content), rl };
  }

  const input = userInput.trim();

  // Check if input looks like a file path
  if (input.endsWith('.md') || input.includes('/') || input.includes('\\')) {
    try {
      const content = await loadBrief(input);
      console.log(`${C.green}  ✓ Loaded brief from ${input}${C.reset}`);
      console.log();
      return { prompt: formatForSquad(content), rl };
    } catch (err: any) {
      console.log(`${C.yellow}  Could not load file: ${err.message}${C.reset}`);
      console.log(`${C.dim}  Using input as content theme instead.${C.reset}`);
      console.log();
      return { prompt: formatForSquad(input), rl };
    }
  }

  console.log();
  return { prompt: formatForSquad(input), rl };
}

async function loadBrief(filename: string): Promise<string> {
  const path = resolve(process.cwd(), filename);
  return await readFile(path, 'utf-8');
}

function formatForSquad(contentTheme: string): string {
  return `Please create a complete social media content package for the following theme.

**Content Theme:**
${contentTheme}

Coordinate all four specialists:
1. First, the Content Creator should generate 3 distinct post concepts with hooks, core messages, and CTAs.
2. Then, the Platform Optimizer should adapt each concept for Twitter, LinkedIn, and Instagram with platform-specific formatting and hashtags.
3. Next, the Timing Strategist should recommend optimal posting windows for each platform.
4. Finally, the Engagement Monitor should define monitoring strategies and response templates.

Deliver the complete content package in a single, organized response — ready to copy into a scheduling tool.`;
}
