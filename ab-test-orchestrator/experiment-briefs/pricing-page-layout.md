# Pricing Page Layout Test

## Hypothesis
Replacing the current tiered pricing cards layout with a feature comparison table will increase paid plan conversions by at least 8% relative, because users will more easily understand the value difference between plans.

## Background
Our pricing page receives approximately 12,000 unique visitors per week, with 60% arriving from the product's feature pages and 40% from the homepage. The current paid conversion rate (visitor → paid plan selection) is 4.8%. Customer surveys indicate "difficulty comparing plans" as the #2 reason for not upgrading (after price sensitivity).

## Current State (Control — Variant A): Tiered Cards
- Layout: Three side-by-side pricing cards (Starter, Pro, Enterprise)
- Each card lists: plan name, price, 5-6 bullet-point features, CTA button
- Highlighted/recommended plan: Pro (with "Most Popular" badge)
- Card order: ascending by price, left to right
- Mobile: cards stack vertically

## Proposed Change (Treatment — Variant B): Feature Comparison Table
- Layout: Full-width comparison table with plans as columns, features as rows
- All features listed with checkmarks/dashes showing what's included in each plan
- Sticky header row with plan names and prices
- CTA buttons fixed at the bottom of each column
- Row grouping by feature category (Core, Analytics, Support, Integrations)
- Mobile: horizontal scroll with first column (feature names) sticky

## Goals
- **Primary metric:** Paid plan conversion rate (unique paid plan selections ÷ unique pricing page visitors)
- **Secondary metrics:**
  - Plan distribution shift (% choosing Starter vs. Pro vs. Enterprise)
  - Time on pricing page (engagement signal)
  - CTA click-through rate per plan
- **Guardrail metrics:**
  - Pricing page bounce rate (should not increase >3%)
  - Support ticket volume about pricing confusion (should decrease or stay flat)
  - Checkout abandonment rate (should not increase)

## Constraints
- Weekly traffic to pricing page: ~12,000 unique visitors
- Lower traffic means longer experiment duration — plan accordingly
- Cannot modify actual prices or plan features during the test
- Must complete before Q1 planning freeze (Feb 1)
- Design team needs 1 week to build the comparison table variant
- Engineering estimates 2 days for feature flag + layout swap
- Must reach 95% confidence with 80% power

## Segments to Watch
- New visitors vs. returning visitors (do repeat visitors prefer the familiar layout?)
- Mobile vs. desktop (table layout may perform differently on small screens)
- Traffic source: feature pages vs. homepage (different intent levels)

## Stakeholders
- Product: wants to increase paid conversions, open to either layout
- Design: concerned about table readability on mobile
- Sales: wants to know if Enterprise selections increase
- Finance: needs conversion data for Q1 revenue forecasts
