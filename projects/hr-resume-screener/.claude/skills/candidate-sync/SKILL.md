---
name: candidate-sync
description: Pulls candidates from the Notion "Candidates" pipeline, scores each with the team hiring rubric, and writes Score / Recommendation / Reasoning back to each candidate in Notion. Use when the user wants to rank the live candidate pipeline in Notion. Trigger on "סנכרן מועמדים", "דרג את הפייפליין", "sync candidates", "rank pipeline".
---

# Candidate Sync · Action skill (Notion MCP)

The **Action upgrade** of `resume-screener`. Instead of pasting CVs, this skill reads the
candidates **live from Notion**, scores them, and **writes the results back**.
Same brain (the rubric), added hands (Notion + a script).

## Knowledge base (references/)
- **Shared rubric** — `../resume-screener/references/hiring-rubric.md` — the SAME scoring
  standard as the Context skill. Load it before scoring; do not invent a new bar.
- **`references/notion-candidates-schema.md`** — the exact Candidates DB fields to read/write.

## Tools / MCP
- **Notion MCP** — read the "Candidates" database, update each candidate page.
  (Connect the Notion connector once, in settings.)

## Scripts
- **`scripts/build-writeback.js`** — deterministic mapping of a scored candidate to the
  Notion property update. Keeps the exact field mapping out of the LLM. Runs in Claude Code.

## Method
1. Connect to Notion (MCP) and open the **Candidates** database.
2. For each candidate: read `Name`, `Role`, and the `CV` / notes field.
3. Score with the hiring rubric (loaded from `resume-screener/references/hiring-rubric.md`).
4. Build the write-back with `scripts/build-writeback.js`.
5. Write back **Score** (number), **Recommendation** (select), **Reasoning** (text) to each page.
6. Return a short summary table of what changed.

## Rules
- Never overwrite fields other than Score / Recommendation / Reasoning.
- A missing must-have caps the score (per the rubric) — state it in Reasoning.
- If more than 20 candidates would be updated, confirm with the user first.
- This sorts and explains — the hiring decision always stays human.
