# 🟢 מסנן קורות חיים — אפליקציה אמיתית (Real App)

זאת **לא** HTML סטטי — זאת אפליקציה אמיתית: שרת **Node** עם **חיבור חי ל-Notion**
(קריאה + כתיבה). הטוקן נשמר בשרת, ולכן זה באמת מתחבר ל-Notion (מה ש-HTML בדפדפן לא יכול).

```
real-app/
├── server.js        ← השרת + ה-API + קריאות אמיתיות ל-Notion
├── public/index.html← ה-frontend (קורא לשרת)
├── package.json
└── .env.example     ← הגדרות (טוקן + מסד)
```

## הרצה מהירה (מצב דמו — עובד מיד)
```bash
cd real-app
npm install
npm start
```
פתחו http://localhost:4000 — האפליקציה רצה עם נתוני דמו. ✅

## חיבור ל-Notion האמיתי (3 דקות)
1. צרו integration: https://www.notion.so/my-integrations → העתיקו את ה-**Internal Token** (`secret_…`).
2. במסד המועמדים ב-Notion: `•••` → **Connections** → הוסיפו את ה-integration.
3. ודאו שיש במסד את ה-properties: **Name** (title), **CV** (text), **Score** (number),
   **Recommendation** (text), **Reasoning** (text).
4. העתיקו `.env.example` ל-`.env` ומלאו `NOTION_TOKEN` ו-`NOTION_DATABASE_ID`
   (ה-ID נמצא ב-URL של המסד).
5. `npm start` — עכשיו הסטטוס יהיה **„● מחובר ל-Notion”**.

## מה האפליקציה עושה
- **⤓ טען מועמדים** — קורא מועמדים אמיתיים מ-Notion ומדרג כל אחד לפי ה-rubric.
- **⬆️ הוסף ידנית** — מדביקים/גוררים CV, השרת מדרג ומוסיף לרשימה.
- **⤴ כתוב דירוג ל-Notion** — כותב בחזרה לכל רשומה: Score · Recommendation · Reasoning.

## ה-API
| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/health` | מצב חיבור (notion / demo) |
| GET | `/api/candidates` | מושך + מדרג מועמדים |
| POST | `/api/score` | מדרג CV בודד (`{text,name}`) |
| POST | `/api/notion/push` | כותב דירוג בחזרה ל-Notion |

## הערה על הניקוד
הניקוד כאן הוא **rubric דטרמיניסטי** בשרת (בלי מפתח API — עובד מיד). רוצים ניתוח עמוק
יותר? אפשר להחליף את הפונקציה `scoreCV` בקריאה ל-Claude API — זה שינוי של פונקציה אחת.
