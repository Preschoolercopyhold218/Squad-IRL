// ─── Scheduler Input ─────────────────────────────────────────────────────────
// Prompts the user for their scheduling scenario and formats it for the Squad.

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

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
  'I need to schedule a 1-hour meeting with 3 people: Alice in San Francisco (PST), Bob in London (GMT), and Chandra in Mumbai (IST). Next week, avoid Monday mornings.',
  'Find a 30-minute slot for a daily standup with our NYC and Tokyo offices. Prefer mornings NYC time.',
  'Set up a 2-hour workshop for 6 people across Berlin, São Paulo, and Sydney. Sometime in the next two weeks, no Fridays.',
];

export async function getSchedulingInput(): Promise<{ prompt: string; rl: ReturnType<typeof createInterface> }> {
  const rl = createInterface({ input: stdin, output: stdout });

  console.log(`${C.cyan}  Describe your scheduling need in plain text.${C.reset}`);
  console.log(`${C.dim}  Include: who's meeting, their timezones, how long, when, and any constraints.${C.reset}`);
  console.log();
  console.log(`${C.dim}  Examples:${C.reset}`);
  for (const ex of EXAMPLES) {
    console.log(`${C.dim}    - ${ex}${C.reset}`);
  }
  console.log();

  const userInput = await rl.question(`${C.green}  > ${C.reset}`);

  if (!userInput.trim()) {
    console.log(`${C.yellow}  No input provided. Using example scenario.${C.reset}`);
    const fallback = EXAMPLES[0]!;
    console.log(`${C.dim}  "${fallback}"${C.reset}`);
    console.log();
    return { prompt: formatForSquad(fallback), rl };
  }

  console.log();
  return { prompt: formatForSquad(userInput.trim()), rl };
}

function formatForSquad(userInput: string): string {
  return `Please analyze the following scheduling request and produce optimized meeting time suggestions.

**Scheduling Request:**
${userInput}

Coordinate all four specialists:
1. First, parse the constraints — extract participants, timezones, duration, date range, and preferences.
2. Then, map the timezone overlaps and flag any awkward-hour issues.
3. Next, generate and rank the top 5 time slots by overall convenience.
4. Finally, format a polished meeting proposal with times in all timezones, an agenda template, and calendar invite text.

Deliver the complete proposal in a single, organized response.`;
}
