// Generates 10 Hebrew ATS-style CV HTML files for the "Game Economy Analyst @ Whalo" role.
// Realistic spread: 2 strong, 4 medium, 4 weak fits.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '_html');

const candidates = [
  // ---------- STRONG (2) ----------
  {
    fit: 'strong',
    name: 'עדן רוזן',
    title: 'Game Economy Analyst',
    contact: 'תל אביב · eden.rozen@gmail.com · 052-4418830',
    summary: 'אנליסטית כלכלת משחק עם 4 שנות ניסיון ב-free-to-play. מתמחה באיזון כלכלה וירטואלית, תמחור חבילות וניסויי A/B מבוססי דאטה ממיליוני שחקנים.',
    experience: [
      { period: '2022–היום', role: 'Game Economy Analyst', org: 'PlayForge (mobile F2P)', bullets: [
        'איזון מתמשך של sinks/sources וכלכלת מטבעות על בסיס Snowflake ו-Mixpanel.',
        'תכנון והרצת 30+ ניסויי תמחור ו-A/B על חבילות in-app; שיפור ARPDAU ב-14%.',
        'בניית מודלים ב-Python לתחזית הכנסות והשפעת שינויי כלכלה.' ] },
      { period: '2020–2022', role: 'Product Analyst', org: 'סטודיו משחקים', bullets: [
        'שאילתות SQL מורכבות, דשבורדים ב-Looker, ניתוח retention ו-funnel.' ] },
    ],
    skills: 'SQL (מתקדם), Snowflake, Mixpanel, Python (pandas), A/B testing, Looker',
    education: 'B.A. כלכלה, אוניברסיטת תל אביב',
    languages: 'עברית (שפת אם), אנגלית (שוטף)',
  },
  {
    fit: 'strong',
    name: 'איתי שרון',
    title: 'Senior Product Analyst — Gaming',
    contact: 'רמת גן · itay.sharon@outlook.com · 054-7729104',
    summary: 'אנליסט מוצר בכיר עם 6 שנות ניסיון במשחקי מובייל. ניסיון עמוק בתכנון ניסויים, מודלים כמותיים והובלת החלטות monetization מבוססות דאטה.',
    experience: [
      { period: '2019–היום', role: 'Senior Product Analyst', org: 'Loop Games (F2P)', bullets: [
        'הובלת מערך הניסויים: experiment design, ניתוח תוצאות והמלצות ל-Monetization.',
        'SQL מתקדם על Snowflake, Amplitude, מודלים סטטיסטיים לתחזית LTV.',
        'בניית כלכלת event-ים עונתיים שהעלתה הכנסות ב-11% רבעוני.' ] },
      { period: '2017–2019', role: 'Data Analyst', org: 'חברת אד-טק', bullets: [
        'ניתוח קמפיינים, Python לאוטומציה של דוחות, A/B על creatives.' ] },
    ],
    skills: 'SQL מתקדם, Snowflake, Amplitude, Python, experiment design, סטטיסטיקה',
    education: 'B.Sc. תעשייה וניהול (התמחות בדאטה), טכניון',
    languages: 'עברית (שפת אם), אנגלית (שוטף)',
  },
  // ---------- MEDIUM (4) ----------
  {
    fit: 'medium',
    name: 'נטע פרידמן',
    title: 'Data Analyst — Fintech',
    contact: 'תל אביב · neta.friedman@gmail.com · 053-3320561',
    summary: 'אנליסטית דאטה עם 5 שנות ניסיון בפינטק. SQL חזק וניסיון רב בניסויי תמחור — אך ללא רקע ב-gaming.',
    experience: [
      { period: '2019–היום', role: 'Data Analyst', org: 'חברת פינטק', bullets: [
        'SQL חזק מאוד, Tableau, מודלים לתחזית churn והכנסות.',
        'תכנון והרצת ניסויי A/B על תמחור מנויים ועמלות.' ] },
      { period: '2018–2019', role: 'BI Analyst', org: 'סטארטאפ B2B', bullets: [
        'דשבורדים, ניתוח funnel, אוטומציה של דוחות.' ] },
    ],
    skills: 'SQL (חזק), Tableau, A/B testing, מודלים סטטיסטיים',
    education: 'B.A. סטטיסטיקה וכלכלה, האוניברסיטה העברית',
    languages: 'עברית (שפת אם), אנגלית (גבוהה)',
  },
  {
    fit: 'medium',
    name: 'גיא לרנר',
    title: 'Game Economy Designer',
    contact: 'גבעתיים · guy.lerner@gmail.com · 050-6612247',
    summary: 'מעצב כלכלת משחק עם 7 שנות ניסיון. הבנה עמוקה של כלכלות וירטואליות ו-sinks/sources — אך פחות חזק בקוד ו-SQL.',
    experience: [
      { period: '2017–היום', role: 'Senior Economy Designer', org: 'אולפן משחקים מוביל', bullets: [
        'תכנון כלכלות וירטואליות שלמות: מטבעות, sinks/sources, מודלי progression.',
        'עבודה צמודה עם אנליסטים (מקבל מהם שאילתות; SQL בסיסי בלבד).' ] },
      { period: '2014–2017', role: 'Game Designer', org: 'סטודיו מובייל', bullets: [
        'עיצוב מערכות, איזון רמות, A/B על מכניקות.' ] },
    ],
    skills: 'Game economy design, sinks/sources, Excel, SQL (בסיסי)',
    education: 'B.A. עיצוב מדיה אינטראקטיבית, בצלאל',
    languages: 'עברית (שפת אם), אנגלית (שוטף)',
  },
  {
    fit: 'medium',
    name: 'שני אזולאי',
    title: 'Product Analyst — E-commerce',
    contact: 'הרצליה · shani.azoulay@gmail.com · 052-9043318',
    summary: 'אנליסטית מוצר עם 3 שנות ניסיון באיקומרס. SQL טוב וניסיון בניסויי תמחור, ללא ניסיון gaming.',
    experience: [
      { period: '2021–היום', role: 'Product Analyst', org: 'חברת איקומרס', bullets: [
        'SQL יומיומי, Looker, ניתוח conversion ו-funnel.',
        'תכנון והרצת ניסויי A/B על תמחור, מבצעים ו-checkout.' ] },
      { period: '2020–2021', role: 'Junior Analyst', org: 'סטארטאפ', bullets: [
        'דוחות, Excel מתקדם, תחילת עבודה עם SQL.' ] },
    ],
    skills: 'SQL (טוב), Looker, A/B testing, Excel מתקדם',
    education: 'B.A. כלכלה וניהול, אוניברסיטת בן-גוריון',
    languages: 'עברית (שפת אם), אנגלית (גבוהה)',
  },
  {
    fit: 'medium',
    name: 'אורן מלכה',
    title: 'BI Analyst — SaaS',
    contact: 'פתח תקווה · oren.malka@gmail.com · 054-2218890',
    summary: 'אנליסט BI עם 4 שנות ניסיון ב-SaaS. SQL חזק ובניית דשבורדים; ניסיון מועט בתכנון ניסויים וללא רקע gaming.',
    experience: [
      { period: '2020–היום', role: 'BI Analyst', org: 'חברת SaaS', bullets: [
        'SQL חזק, בניית דשבורדים ב-Tableau לכלל הארגון.',
        'מודלים בסיסיים לתחזית, ניתוח usage ו-retention.' ] },
      { period: '2019–2020', role: 'Data Analyst (junior)', org: 'סוכנות דיגיטל', bullets: [
        'דוחות ביצועים, Google Analytics, SQL בסיסי.' ] },
    ],
    skills: 'SQL (חזק), Tableau, Google Analytics, Excel',
    education: 'B.Sc. מתמטיקה ומדעי המחשב, אוניברסיטת תל אביב',
    languages: 'עברית (שפת אם), אנגלית (גבוהה)',
  },
  // ---------- WEAK (4) ----------
  {
    fit: 'weak',
    name: 'רותם כספי',
    title: 'Marketing Analyst',
    contact: 'תל אביב · rotem.caspi@gmail.com · 053-7781120',
    summary: 'אנליסטית שיווק עם שנתיים ניסיון בניתוח קמפיינים ו-UA. SQL בסיסי, ללא ניסיון בכלכלת משחק או ניסויי מוצר.',
    experience: [
      { period: '2022–היום', role: 'Marketing Analyst', org: 'סוכנות פרסום', bullets: [
        'ניתוח קמפיינים ו-User Acquisition, Google Analytics, Excel.',
        'SQL בסיסי לשליפת נתוני קמפיינים.' ] },
    ],
    skills: 'Google Analytics, Excel, SQL (בסיסי), UA',
    education: 'B.A. תקשורת ושיווק, המכללה למנהל',
    languages: 'עברית (שפת אם), אנגלית (טובה)',
  },
  {
    fit: 'weak',
    name: 'ליעד בן-חיים',
    title: 'Junior Data Analyst',
    contact: 'ראשון לציון · liad.benhaim@gmail.com · 050-4439972',
    summary: 'אנליסט דאטה זוטר עם שנה וחצי ניסיון. SQL בסיסי ו-Excel; ללא ניסיון בניסויים, בכלכלת משחק או בתחום ה-gaming.',
    experience: [
      { period: '2023–היום', role: 'Junior Data Analyst', org: 'חברת לוגיסטיקה', bullets: [
        'SQL בסיסי, Excel, בניית דוחות תפעוליים.',
        'תמיכה בצוות הדאטה בשליפות ובניקוי נתונים.' ] },
    ],
    skills: 'SQL (בסיסי), Excel, Power BI (בסיסי)',
    education: 'תעודת הנדסאי תוכנה',
    languages: 'עברית (שפת אם), אנגלית (בינונית)',
  },
  {
    fit: 'weak',
    name: 'תומר ברנע',
    title: 'QA / Game Tester',
    contact: 'חיפה · tomer.barnea@gmail.com · 052-6650183',
    summary: 'בודק משחקים נלהב עם 3 שנות ניסיון ב-QA. שחקן free-to-play ותיק שמבין כלכלת משחק כשחקן — אך ללא ניסיון אנליטי או SQL.',
    experience: [
      { period: '2021–היום', role: 'QA / Game Tester', org: 'סטודיו משחקים', bullets: [
        'בדיקות פונקציונליות, דיווח באגים, היכרות עמוקה עם מכניקות וכלכלת משחק.',
        'ללא ניסיון ב-SQL או ניתוח דאטה; מעוניין לעבור לתפקיד אנליטי.' ] },
    ],
    skills: 'QA, Jira, הבנת game economy (כשחקן), Excel בסיסי',
    education: 'לימודי תעודה — פיתוח משחקים',
    languages: 'עברית (שפת אם), אנגלית (טובה)',
  },
  {
    fit: 'weak',
    name: 'מיכל דרור',
    title: 'Finance Analyst',
    contact: 'כפר סבא · michal.dror@gmail.com · 054-3317705',
    summary: 'אנליסטית פיננסית עם 8 שנות ניסיון בחשבונאות ובקרת תקציב. עבודה ב-Excel ברמה גבוהה — אך ללא SQL, ללא ניסיון מוצר וללא רקע gaming.',
    experience: [
      { period: '2016–היום', role: 'Finance Analyst', org: 'חברה תעשייתית', bullets: [
        'בקרת תקציב, דוחות רווח והפסד, תחזיות פיננסיות ב-Excel.',
        'עבודה מול הנהלת חשבונות ומערכות ERP; ללא SQL.' ] },
      { period: '2014–2016', role: 'Bookkeeper', org: 'משרד רו"ח', bullets: [
        'הנהלת חשבונות, התאמות בנקים, דוחות חודשיים.' ] },
    ],
    skills: 'Excel (מומחית), SAP, חשבונאות, תחזיות תקציב',
    education: 'B.A. חשבונאות וכלכלה, אוניברסיטת בר-אילן',
    languages: 'עברית (שפת אם), אנגלית (בינונית)',
  },
];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function render(c) {
  const exp = c.experience.map(e => `
      <div class="job">
        <div class="job-head"><span class="role">${esc(e.role)}</span><span class="period">${esc(e.period)}</span></div>
        <div class="org">${esc(e.org)}</div>
        <ul>${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`).join('');
  return `<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Heebo','Arial','Helvetica',sans-serif; color: #1a1a1a; font-size: 11pt; line-height: 1.5; margin: 0; }
  .name { font-size: 22pt; font-weight: 700; letter-spacing: .2px; }
  .title { font-size: 12.5pt; color: #444; margin-top: 2px; }
  .contact { font-size: 9.5pt; color: #666; margin-top: 6px; border-bottom: 2px solid #222; padding-bottom: 10px; }
  .summary { margin: 12px 0 4px; color: #2a2a2a; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: .5px; color: #222;
       border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 16px 0 8px; }
  .job { margin-bottom: 10px; }
  .job-head { display: flex; justify-content: space-between; align-items: baseline; }
  .role { font-weight: 700; }
  .period { font-size: 9.5pt; color: #777; white-space: nowrap; }
  .org { font-size: 10pt; color: #555; margin-bottom: 3px; }
  ul { margin: 4px 0; padding-inline-start: 18px; }
  li { margin-bottom: 2px; }
  .row { margin-bottom: 4px; }
  .label { font-weight: 700; }
</style></head>
<body>
  <div class="name">${esc(c.name)}</div>
  <div class="title">${esc(c.title)}</div>
  <div class="contact">${esc(c.contact)}</div>
  <div class="summary">${esc(c.summary)}</div>
  <h2>ניסיון תעסוקתי</h2>
  ${exp}
  <h2>כישורים</h2>
  <div class="row">${esc(c.skills)}</div>
  <h2>השכלה</h2>
  <div class="row">${esc(c.education)}</div>
  <h2>שפות</h2>
  <div class="row">${esc(c.languages)}</div>
</body></html>`;
}

let i = 1;
const manifest = [];
for (const c of candidates) {
  const num = String(i).padStart(2, '0');
  const slug = c.name.replace(/[\s'"]/g, '-');
  const fname = `${num}-${slug}`;
  fs.writeFileSync(path.join(OUT, fname + '.html'), render(c), 'utf8');
  manifest.push({ num, name: c.name, fit: c.fit, file: fname });
  i++;
}
fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('Wrote ' + candidates.length + ' HTML files to ' + OUT);
