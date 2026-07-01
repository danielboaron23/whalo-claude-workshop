---
name: asset-brief
description: Organizes a game art asset library (catalog with tags) and generates a consistent visual brief for a new asset, grounded in the existing style. Use when the user wants to catalog/tag assets or write a visual brief for a new asset that matches the existing art. Trigger on "בריף ויזואלי", "מארגן נכסים", "asset brief", "קטלוג נכסים", "visual brief".
---

# Asset Brief

Two jobs: organize the asset library, and brief new assets that fit the existing style.

## Input
An asset catalog (e.g. `data/assets.json`) — each asset has `name`, `type`, `tags`, `status`.

## Job A — organize
- Group assets by `type`, surface `tags`, and flag anything missing tags or with status "בעבודה".
- Suggest a consistent tagging scheme if tags are inconsistent.

## Job B — visual brief for a NEW asset
Given a request (e.g. "דמות חדשה: סוסון ים"), produce a brief that's CONSISTENT with the library:
- **סגנון** — derived from existing assets (e.g. rounded, friendly, colorful 3D like Pingo).
- **פלטה** — the project's colors (ocean blues + lime accents).
- **רפרנסים** — name 2-3 existing assets to match.
- **מפרט** — size/format/states needed.
- **do / don't** — concrete guardrails to keep it on-brand.

## Rules
- Ground the style in the ACTUAL existing assets — don't invent a new direction.
- Keep the brief tight and actionable for an artist.
- Hebrew. The tool organizes and briefs; the artist creates.
