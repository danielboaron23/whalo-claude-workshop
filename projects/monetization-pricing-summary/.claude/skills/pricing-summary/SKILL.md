---
name: pricing-summary
description: Analyzes pricing A/B test results (CSV with variant, price, users, buyers, revenue) and returns per-variant conversion, ARPU and revenue, plus a clear winner and recommendation with reasoning. Use when the user provides A/B / experiment results and wants a summary + decision. Trigger on "סיכום ניסוי תמחור", "pricing A/B", "תוצאות ניסוי", "מי ניצח בניסוי", "A/B summary".
---

# Pricing A/B Summary

Turn raw experiment results into a decision.

## Input
A CSV (e.g. `data/pricing-ab-results.csv`) with columns:
`variant, description, price_usd, users, buyers, revenue_usd`.

## Compute per variant
- **conversion** = buyers / users (as %)
- **ARPU** = revenue_usd / users
- **revenue** = revenue_usd (total)
Show all three, rounded sensibly (conversion 1 decimal, ARPU 3 decimals, revenue whole).

## Output
1. A table: variant · price · conversion · ARPU · revenue.
2. **🏆 הזוכה** — pick the winner. Default to **highest total revenue** unless the user
   states a different goal (e.g. max conversion, max ARPU) — then optimize for that.
3. **המלצה** — one clear sentence: which price to ship and WHY (reference the numbers).
4. A caveat if results are close or sample looks small (note statistical-significance risk).

## Rules
- Do the math correctly — recompute from raw numbers, don't trust pre-filled rates.
- Be explicit about the goal you optimized for.
- Don't overclaim: if two variants are within a hair, say it's not conclusive.
- Hebrew, concise, decision-oriented.
