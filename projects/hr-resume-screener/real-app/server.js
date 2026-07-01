/* ============================================================================
   HR Resume Screener — REAL app server
   ----------------------------------------------------------------------------
   • Serves the frontend (public/) and a small JSON API.
   • Talks DIRECTLY to the Notion API (read candidates + write the ranking back)
     using a server-side integration token — exactly what an HTML file can't do.
   • If no Notion token is configured it runs in DEMO mode with local mock data,
     so the app works the moment you start it.
   Run:  npm install  &&  npm start   →  http://localhost:4000
   ========================================================================== */
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
// Allow the frontend to call the API even when opened as a file:// (IDE preview).
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DB = process.env.NOTION_DATABASE_ID || '';
const P = {                                   // Notion property names (override via .env)
  name:   process.env.NOTION_PROP_NAME   || 'Name',
  cv:     process.env.NOTION_PROP_CV     || 'CV',
  score:  process.env.NOTION_PROP_SCORE  || 'Score',
  rec:    process.env.NOTION_PROP_REC    || 'Recommendation',
  reason: process.env.NOTION_PROP_REASON || 'Reasoning',
};
const NOTION_ON = !!(NOTION_TOKEN && NOTION_DB);

/* ---------- the job + demo candidates (used when Notion isn't configured) ---------- */
const DEMO = [
  { name:'מאיה לוין',  cv:'אנליסטית מוצר gaming free-to-play 4 שנים. ניתוח שחקנים ב-Mixpanel, ניסויי A/B על חבילות in-app, SQL מתקדם, Python. הובילה rebalance שהעלה ARPDAU. עברית ואנגלית שוטף.' },
  { name:'דניאל כהן',  cv:'Data Analyst פינטק 6 שנים. SQL חזק מאוד, מודלים לתחזית, ניסויי תמחור מנויים. אין ניסיון gaming. עברית ואנגלית מצוינות.' },
  { name:'טל אברהם',   cv:'Economy Designer gaming 8 שנים. תכנון כלכלות וירטואליות, מטבעות, sinks/sources. SQL חלש. אנגלית שוטף.' },
  { name:'רוני שמש',   cv:'BI Analyst שנה אחת. SQL בסיסי, Excel. נלהב ממשחקים. ללא ניסיון בניסויים. אנגלית טובה.' },
  { name:'ליאת מזרחי', cv:'Marketing analyst 3 שנים, UA וקמפיינים. SQL בינוני. ללא כלכלת משחק או תמחור in-app. עברית ואנגלית טובות.' },
];

/* ---------- rubric-aligned scorer (shared) ---------- */
function scoreCV(text, nameHint) {
  const full = (text || '').toLowerCase();
  // drop negated clauses ("ללא X" / "אין X" / "בלי X") so they don't trigger positive matches
  const pos = full.split(/[.,\n;]/).filter(c => !/(ללא|אין |בלי|without|\bno\b)/i.test(c)).join(' . ');
  const has = re => re.test(pos);
  const domainGame = has(/gaming|game|free.?to.?play|f2p|כלכלת משחק|מטבע|in.?app|חבילות|arpdau|שחקנ/);
  const adjacent   = has(/תמחור|pricing|מנוי|economy|כלכל|monetiz/);
  const sql = has(/\bsql\b/), python = has(/python|פייתון/);
  const exper = has(/a\/?b|ניסוי|experiment/);
  const viz = has(/tableau|looker|power ?bi|דשבורד|dashboard|ויזואל/);
  const analysis = has(/analyst|אנליסט|ניתוח|\bdata\b|דאטה|בינה עסקית|\bbi\b|mixpanel|amplitude|snowflake/);
  const eng = /english|אנגלית/.test(full), heb = /hebrew|עברית/.test(full);
  let years = 0; const m = full.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:שנ|years?|yrs?)/);
  if (m) years = parseFloat(m[1]); else if (/שנה אחת|שנה /.test(full)) years = 1;

  let mh = 0; if (analysis) mh += 10; if (sql) mh += 15; if (years >= 2) mh += 8; if (eng) mh += 7;
  const dom = domainGame ? 25 : adjacent ? 12 : 0;
  const hs = Math.min(20, (sql ? 7 : 0) + (python ? 5 : 0) + (exper ? 5 : 0) + (viz ? 3 : 0));
  const sen = years >= 2 && years <= 7 ? 10 : years >= 8 ? 7 : years === 1 ? 4 : 2;
  const comm = (eng && heb) ? 5 : (eng || heb) ? 3 : 1;
  const score = Math.round(Math.max(0, Math.min(100, mh + dom + hs + sen + comm)));

  const up = [], down = [];
  if (domainGame) up.push('ניסיון gaming/F2P'); else down.push('אין ניסיון gaming');
  if (sql) up.push('SQL'); else down.push('ללא SQL (חובה)');
  if (python) up.push('Python');
  if (exper) up.push('ניסויי A/B'); else down.push('ללא ניסויים');
  if (viz) up.push('ויזואליזציה');
  if (years) up.push(years + ' שנות ניסיון'); else down.push('ניסיון לא ברור');
  if (eng && heb) up.push('עברית + אנגלית');

  const rec = score >= 75 ? 'yes' : score >= 55 ? 'maybe' : 'no';
  const recTxt = { yes: 'מתאים/ה לראיון', maybe: 'שווה שיחה', no: 'פער גדול מדי כרגע' }[rec];
  const reason = `ציון ${score}/100 לפי ה-rubric. ` +
    (domainGame ? 'יש ניסיון בתחום ה-gaming. ' : adjacent ? 'ניסיון אנליטי סמוך אך לא gaming ישיר. ' : 'אין ניסיון בתחום ה-gaming. ') +
    (sql ? 'שליטה ב-SQL קיימת. ' : 'חסר SQL — דרישת חובה. ') + recTxt + '.';

  let name = (nameHint || '').trim();
  if (!name) { const first = (text || '').trim().split('\n')[0].trim(); name = (first && first.length <= 30) ? first : 'מועמד/ת'; }
  return { name, exp: years, score, rec, reason, up, down };
}

/* ---------- Notion REST helpers (server-side, token stays secret) ---------- */
async function notion(pathname, method = 'GET', body) {
  const res = await fetch('https://api.notion.com/v1' + pathname, {
    method,
    headers: {
      'Authorization': 'Bearer ' + NOTION_TOKEN,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || ('Notion API ' + res.status));
  return json;
}
const titleOf = (props, key) => (props[key]?.title || []).map(x => x.plain_text).join('') || '';
const textOf  = (props, key) => (props[key]?.rich_text || []).map(x => x.plain_text).join('') || '';

/* ---------- API ---------- */
app.get('/api/health', (req, res) => {
  res.json({ mode: NOTION_ON ? 'notion' : 'demo', database: NOTION_ON ? NOTION_DB : null });
});

// pull candidates (from Notion if configured, else demo) and score them
app.get('/api/candidates', async (req, res) => {
  try {
    if (!NOTION_ON) {
      return res.json({ mode: 'demo', candidates: DEMO.map(c => ({ ...scoreCV(c.cv, c.name), source: 'demo' })) });
    }
    const data = await notion(`/databases/${NOTION_DB}/query`, 'POST', { page_size: 100 });
    const candidates = data.results.map(pg => {
      const name = titleOf(pg.properties, P.name) || 'ללא שם';
      const cv = textOf(pg.properties, P.cv);
      return { ...scoreCV(cv, name), source: 'notion', pageId: pg.id };
    });
    res.json({ mode: 'notion', candidates });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// score a single pasted/uploaded CV
app.post('/api/score', (req, res) => {
  const { text, name } = req.body || {};
  if (!text) return res.status(400).json({ error: 'missing text' });
  res.json({ ...scoreCV(text, name), source: 'upload' });
});

// write the ranking back to Notion (update existing pages, create new ones)
app.post('/api/notion/push', async (req, res) => {
  const list = (req.body && req.body.candidates) || [];
  const recName = { yes: 'לראיון', maybe: 'אולי', no: 'לא כרגע' };
  if (!NOTION_ON) {
    return res.json({ mode: 'demo', written: list.length, note: 'מצב דמו — לא נכתב ל-Notion אמיתי. הגדר NOTION_TOKEN + NOTION_DATABASE_ID.' });
  }
  try {
    let written = 0;
    for (const c of list) {
      const props = {
        [P.score]:  { number: c.score },
        [P.rec]:    { rich_text: [{ text: { content: recName[c.rec] || '' } }] },
        [P.reason]: { rich_text: [{ text: { content: (c.reason || '').slice(0, 1900) } }] },
      };
      if (c.pageId) {
        await notion(`/pages/${c.pageId}`, 'PATCH', { properties: props });
      } else {
        props[P.name] = { title: [{ text: { content: c.name || 'מועמד/ת' } }] };
        await notion('/pages', 'POST', { parent: { database_id: NOTION_DB }, properties: props });
      }
      written++;
    }
    res.json({ mode: 'notion', written });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`\n✅ HR Resume Screener running:  http://localhost:${PORT}`);
  console.log(NOTION_ON ? `   Notion: CONNECTED (db ${NOTION_DB})` : '   Notion: DEMO mode (set NOTION_TOKEN + NOTION_DATABASE_ID in .env for live)\n');
});
