# A/B Test Analyzer — Specification

## Goal
Analyze A/B test results with proper statistical rigor, translating raw numbers into clear business decisions — no p-hacking, no premature calls, no "it looks like it's winning."

## Target Audience
Product managers, growth marketers, and data-informed teams who run experiments but need help interpreting results correctly and avoiding common statistical pitfalls.

## Requirements
1. Calculate statistical significance using appropriate tests (chi-squared for proportions, t-test for continuous metrics, Mann-Whitney for non-normal distributions)
2. Report p-values, confidence intervals, and effect sizes — not just "significant" or "not significant"
3. Check for adequate sample size and flag if the test is underpowered
4. Calculate the minimum detectable effect (MDE) given the current sample
5. Identify Simpson's paradox risks — segment results by key dimensions (device, region, user type)
6. Provide a clear SHIP / DON'T SHIP / KEEP TESTING recommendation with reasoning
7. Estimate the projected business impact in real units (revenue, conversions, users) not just percentages
8. Flag novelty effects, day-of-week bias, or other temporal confounds
9. Check for metric pollution: did the variant affect secondary/guardrail metrics negatively?
10. Include a "what we learned" section regardless of outcome

## Output Format
Executive summary with recommendation → Statistical results table → Segment analysis → Business impact projection → Risks and caveats → What we learned

## Quality Criteria
- Statistical methods are correctly chosen and applied
- Confidence intervals are reported, not just point estimates
- Sample size adequacy is explicitly addressed
- Business recommendation is clearly tied to the statistical evidence
- Common pitfalls (peeking, multiple comparisons) are acknowledged
- A data scientist would nod approvingly reading this analysis
