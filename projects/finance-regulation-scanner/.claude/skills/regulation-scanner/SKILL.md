---
name: regulation-scanner
description: Compares a new regulation/requirement against an existing company policy (ToS / privacy) and produces a prioritized gap report — what changed, what's missing, severity, and a concrete recommended update for each gap. Use when the user provides a regulation + a current policy and wants a compliance gap analysis. Trigger on "סורק רגולציה", "פערי תאימות", "compliance gap", "regulation scan", "מה צריך לעדכן בתנאים".
---

# Regulation Scanner

Map a new regulation onto the current policy and surface the gaps that need action.
You assist a human (and their legal counsel) — you flag and recommend, you don't give legal advice.

## Inputs
- A new regulation (e.g. `data/new-regulation.md`).
- The current policy (e.g. `data/current-policy.md`).

## Output — a prioritized gap report. For each requirement in the regulation:
| field | meaning |
|---|---|
| **requirement** | the regulation clause (short) |
| **current** | what the current policy says today (or "לא מכוסה") |
| **gap** | what's missing / what changed |
| **severity** | גבוה / בינוני / נמוך (by legal+user risk and effort) |
| **action** | one concrete recommended update |

Sort by severity (high first). End with a one-line summary: how many gaps, how many high.

## Rules
- Only flag REAL gaps grounded in the texts — never invent requirements.
- If the current policy already covers a requirement, say so (not a gap).
- "גבוה" = legal exposure / affects minors / hard deadline. Be conservative.
- Add a clear disclaimer: this is not legal advice; verify with counsel.
- Write in Hebrew, concrete and short.
