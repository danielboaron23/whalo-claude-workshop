# Whalo · Claude Code Workshop

Interactive workshop deck + hands-on project examples for the Whalo AI workshop.

## Entry points
- **`workshop-hub.html`** — the hub: main presentation + projects + resources, with side navigation. **Start here.**
- **`whalo-workshop.html`** — the slide deck on its own (40 slides, RTL Hebrew).

## What's inside
- `whalo-workshop.html` — the 40-slide deck.
- `workshop-hub.html` — navigation shell around the deck + the project examples.
- `cowork-vs-code-demo.md` — "same task, two tools" demo script (Cowork vs Claude Code).
- `projects/` — 6 example projects (one per team), each with sample data + Skills.
  - Built examples: `hr-resume-screener` (resume-screener + candidate-sync), `marketing-aso-copy` (aso-copy).
- `whalo-theme.css`, `pingo-*.js`, `pingo.glb`, `vendor/`, `fonts/`, `assets/` — deck assets.

## Publish to GitHub Pages
1. Push this repo to GitHub.
2. **Settings → Pages → Deploy from branch → `main` / root**.
3. Share the link: `https://<user>.github.io/<repo>/workshop-hub.html`

> ⚠️ GitHub Pages (free tier) is **public** — anyone with the link can view it, and it may be indexed by search engines.
> For private sharing: use a **private repo + GitHub Pro**, or deploy on **Netlify/Vercel with password protection**.

## Not committed (see `.gitignore`)
- Real `.env` files and `node_modules/` (secrets & dependencies).
- Large demo videos (`viber-skill-demo.mp4`, `workshop-proposal-demo.mp4`) — exceed GitHub's 100 MB limit and aren't used by the deck.
