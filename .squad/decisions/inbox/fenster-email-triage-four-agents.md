# Decision: Email Inbox Triage — Four-Agent Architecture

**By:** Fenster (Core Dev)
**Date:** 2026-03-07
**Context:** Rebuilding email-inbox-triage as interactive Squad SDK app

## Decision

Email inbox triage uses four agents (not three):
- **Classifier**: Per-email categorisation and priority assignment
- **Summarizer**: Per-email concise summaries and entity extraction
- **Action Advisor**: Per-email action recommendations and draft replies
- **Priority Ranker**: Cross-email urgency ordering and action grouping

## Rationale

The original demo had three agents (Classifier, Summarizer, Action Suggester). Splitting the ranking/ordering concern into its own agent gives cleaner separation: classification is per-email (what IS this?), ranking is across-all-emails (what do I do FIRST?). This matches how real triage works — you classify individually, then step back and prioritise the whole batch.

## Impact

Future email-related samples should respect this four-agent pattern. The Priority Ranker agent is reusable for any batch-processing squad that needs cross-item ordering.
