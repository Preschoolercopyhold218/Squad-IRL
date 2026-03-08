# Homepage CTA Button Color Test

## Hypothesis
Changing the primary call-to-action button on the homepage from blue (#2563EB) to green (#16A34A) will increase the signup conversion rate by at least 5% relative.

## Background
Our homepage receives approximately 45,000 unique visitors per week. The current blue CTA button ("Start Free Trial") has a baseline conversion rate of 3.2% (visitors → signups). Internal design reviews suggest green may convey "go" more strongly, but we need data.

## Current State (Control — Variant A)
- Button text: "Start Free Trial"
- Button color: Blue (#2563EB)
- Button size: 48px height, 200px width
- Position: Hero section, above the fold
- Baseline conversion rate: 3.2%

## Proposed Change (Treatment — Variant B)
- Button text: "Start Free Trial" (unchanged)
- Button color: Green (#16A34A)
- All other properties remain identical

## Goals
- **Primary metric:** Signup conversion rate (unique signups ÷ unique homepage visitors)
- **Secondary metric:** Click-through rate on the CTA button
- **Guardrail metrics:** Bounce rate (should not increase >2%), page load time (should not change)

## Constraints
- Weekly traffic: ~45,000 unique visitors
- Must run for at least 2 full weeks to capture day-of-week effects
- Cannot overlap with the upcoming holiday sale campaign (starts Dec 15)
- Engineering team needs 3 days to implement the feature flag
- Must reach 95% confidence before declaring a winner

## Stakeholders
- Product: wants a clear winner within 4 weeks
- Design: wants to understand if color impacts perceived urgency
- Engineering: prefers a simple feature flag implementation
