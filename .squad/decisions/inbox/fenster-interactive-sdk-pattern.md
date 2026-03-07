# Decision: Interactive SDK Pattern for Samples

**Author:** Fenster (Core Dev)  
**Date:** 2026-03-07  
**Status:** Proposed

## Context

Brady directed that all samples should "add value to a human" — users run them, get asked about their problem, and the squad solves it for real using the SDK. The travel-planner needed an `index.ts` to make `npm start` work.

## Decision

Established the interactive SDK sample pattern:

1. **Import squad config** from `./squad.config.js` — keep config and runtime separate
2. **Build system prompt dynamically** from the `defineSquad()` config (team name, agent charters, routing rules)
3. **Use `SquadClient`** from `@bradygaster/squad-sdk/client` — not adapter directly
4. **Stream responses** via `session.on('message_delta', handler)` with `streaming: true`
5. **Use `readline/promises`** for interactive input gathering
6. **Conversation loop** for follow-up questions
7. **Graceful errors** with clear setup guidance if CLI isn't available

## Key Import Paths

- `SquadClient`, `SquadSession`, `SquadSessionConfig` → `@bradygaster/squad-sdk/client`
- `SquadSessionEvent` → `@bradygaster/squad-sdk/adapter` (not re-exported from /client)

## Applies To

All future samples that need interactive SDK-powered runtime (`npm start`).
