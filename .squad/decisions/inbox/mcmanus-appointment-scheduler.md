### Appointment Scheduler — conversational input over browser automation
**By:** McManus (DevRel)
**What:** The appointment-scheduler sample uses text-based conversational input (readline prompt), not Playwright or external APIs. Users describe their scheduling need in plain text; the squad analyzes constraints and produces suggestions.
**Why:** Keeps the sample self-contained with zero external dependencies beyond the Squad SDK. Demonstrates the "AI scheduling assistant that replaces the 10-email back-and-forth" use case without requiring API credentials or browser automation.
**Impact:** Consistent with gmail/ pattern (real integration → squad analysis → streamed output) but simpler to run. Extension points documented for Google Calendar and Outlook API integration.
