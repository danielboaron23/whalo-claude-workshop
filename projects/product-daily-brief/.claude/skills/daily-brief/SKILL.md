---
name: daily-brief
description: Compiles a short, focused morning digest for a product team from multiple sources (Slack export, Notion notes). Surfaces top priorities, blockers, and action items. Use when the user wants a daily brief / morning digest from their Slack + Notion. Trigger on "בריף בוקר", "daily brief", "סיכום בוקר", "morning digest".
---

# Daily Brief

Turn scattered Slack + Notion content into a focused morning digest. Signal, not noise.

## Inputs
- A Slack export (e.g. `data/slack-export.json`).
- Notion notes (e.g. `data/notion-notes.md`) — sprint goals, decisions, meetings.

## Output — a short digest with these sections (in this order):
1. **🔴 הכי חשוב היום** — up to 3 items that need attention/decision today (most urgent first).
2. **🚧 חסמים** — anything blocking progress (bugs, waiting-on, open decisions).
3. **📊 עדכונים** — notable changes (metrics, releases) worth knowing, 1 line each.
4. **✅ משימות לפעולה** — concrete action items, each with an owner if known.
5. **📅 היום ביומן** — today's meetings/deadlines.

## Rules
- Be RUTHLESSLY short — this is a 2-minute read, not a report.
- Prioritize: a P0 crash and a dropping metric beat a nice-to-have.
- Connect related items across sources (e.g. a Slack bug + a sprint goal).
- Never invent items not present in the sources.
- Write in Hebrew, action-oriented.
