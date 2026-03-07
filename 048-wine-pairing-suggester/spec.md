# Wine Pairing Suggester — Specification

## Goal
Suggest wine pairings for specific meals with tasting notes, food interaction explanations, and budget-conscious alternatives — making wine accessible without being pretentious.

## Target Audience
Home cooks and dinner party hosts who want to serve great wine with their food but don't have a sommelier on speed dial or a cellar full of first-growth Bordeaux.

## Requirements
1. Provide 2-3 wine pairing recommendations for the described meal, ranked by compatibility
2. For each wine, include: grape variety, region, flavor profile, and why it works with this specific dish
3. Explain the food-wine interaction: what flavors bridge, what contrasts work, what would clash
4. Offer 3 price tiers for each pairing: budget ($8-15), mid-range ($15-30), and splurge ($30+)
5. Include specific bottle recommendations or producer names when possible
6. Provide tasting notes in plain English — no "hints of petrichor on the mid-palate"
7. Suggest one unconventional "wildcard" pairing that breaks the rules but works
8. Note serving temperature and decanting recommendations
9. Include a non-alcoholic alternative that complements the same flavors
10. Address common mistakes: wines that seem like they'd pair well but don't, and why

## Output Format
Meal analysis → Primary pairing (with tasting notes and price tiers) → Secondary pairing → Wildcard pairing → Non-alcoholic alternative → Serving notes → Common mistakes to avoid

## Quality Criteria
- Pairings are genuinely complementary, not just "red with meat, white with fish" clichés
- Tasting notes describe what you'll actually experience, not wine-critic poetry
- Budget options are real wines available at regular stores, not rare finds
- Food interaction explanations teach something — the reader learns WHY, not just WHAT
- Someone with zero wine knowledge could follow these recommendations confidently
