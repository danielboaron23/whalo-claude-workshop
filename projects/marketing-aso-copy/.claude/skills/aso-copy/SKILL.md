---
name: aso-copy
description: Generates multiple App Store / Google Play copy variations (title, subtitle, short description) from a short game brief, each in a distinct tone, respecting character limits and ASO keywords. Use when the user provides a game/app brief and wants store copy variations or A/B options. Trigger on "קופי לחנות", "ASO", "וריאציות קופי", "store copy", "app store description".
---

# ASO Copy Variations

Turn a short brief into several ready-to-use store copy options for A/B testing.

## Input
A brief (e.g. `data/game-brief.md`) with: genre, audience, what's unique, ASO keywords.

## Knowledge base (references/)
Load these before writing — they hold the parts that are NOT in the brief:
- **`references/brand-voice.md`** — Whalo's voice & tone. The company's own standard ("ours to bring").
- **`references/store-limits.md`** — App Store / Google Play character limits (general knowledge, pinned for precision).
- **`references/copy-examples.md`** — example variations that worked (calibration).

## Method
1. Read the brief; pull genre, audience, unique angle, ASO keywords.
2. Load `references/brand-voice.md` — every line must sound like Whalo.
3. Produce **3–4 variations**, each a genuinely different tone.
4. Verify every field against `references/store-limits.md` — count characters, never exceed.

## Output format
Each variation has:
- **tone** — one-word label (e.g. תחרותי / משעשע / רגוע / ישיר)
- **title** — within the title limit · show `(chars/limit)`
- **subtitle** — within the subtitle limit · show `(chars/limit)`
- **short** — within the short-description limit · show `(chars/limit)`

Return as a clean table, with the character count next to each field.

## Rules
- NEVER exceed the limits in `store-limits.md`. Count and verify every field.
- Weave ASO keywords in naturally — don't keyword-stuff.
- Keep each variation genuinely DIFFERENT in tone, not just reworded.
- Stay inside the Whalo voice (`brand-voice.md`) unless the user asks otherwise.
- No false claims, no unsupported superlatives.
