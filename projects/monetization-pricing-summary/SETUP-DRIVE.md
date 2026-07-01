# 🔌 חיבור Google Drive לאפליקציה (הגדרה חד-פעמית · ~5 דק')

הכפתור **"משכו CSV מ-Google Drive"** כבר קיים ב-[app/index.html](app/index.html).
כדי להפעיל אותו צריך שני מפתחות מ-Google Cloud. עד שממלאים אותם — האפליקציה
עובדת רגיל (העלאת קובץ מקומית), והכפתור מציג הודעת הכוונה.

## למה זה נדרש?
המשיכה מ-Drive מתבצעת בצד הלקוח מול Google, אז Google דורשת שני דברים:
**Client ID** (מזהה את האפליקציה שלך למסך ההרשאה) ו-**API Key** (ל-Picker).
בלי אלה — Google פשוט תסרב. אין דרך לעקוף את זה, וזה גם הדבר הנכון אבטחתית.

## שלבים

1. **פרויקט** — [console.cloud.google.com](https://console.cloud.google.com) → צור/בחר פרויקט.
2. **הפעל שני APIs** — *APIs & Services → Library* → הפעל:
   - **Google Picker API**
   - **Google Drive API**
3. **OAuth consent screen** — *APIs & Services → OAuth consent screen*:
   - User type: **External** → מלא שם אפליקציה ואימייל.
   - **Scopes:** הוסף `.../auth/drive.readonly`.
   - **Test users:** הוסף את כתובת ה-Gmail שאיתה תתחבר (בזמן פיתוח זה מספיק — לא צריך verification).
4. **Credentials** — *APIs & Services → Credentials → Create Credentials*:
   - **API key** → העתק. (מומלץ: Restrict key → Google Picker API.)
   - **OAuth client ID** → Application type: **Web application**.
     - **Authorized JavaScript origins:** הוסף את ה-origin שממנו האפליקציה רצה, למשל:
       `http://localhost:8123`
       ⚠️ חייב להתאים בדיוק לפורט/דומיין. פורט אחר = origin אחר = צריך להוסיף אותו גם.
     - העתק את ה-**Client ID**.
5. **הדבק באפליקציה** — ב-[app/index.html](app/index.html), בתוך `<script>`:
   ```js
   const GOOGLE_CLIENT_ID = "כאן-ה-Client-ID.apps.googleusercontent.com";
   const GOOGLE_API_KEY   = "כאן-ה-API-Key";
   ```
6. **הרץ משרת** (לא `file://`) — Google חוסמת OAuth מ-`file://`. למשל מתיקיית `app/`:
   ```
   python3 -m http.server 8123
   ```
   ופתח `http://localhost:8123` — אותו origin שאישרת בשלב 4.

## מה עובד אחרי זה
לחיצה על הכפתור → מסך הרשאה של Google → בוחר קובץ **CSV** או **Google Sheet**
(גיליון מיוצא אוטומטית ל-CSV) → הדשבורד מחושב מהמספרים הגולמיים, בדיוק כמו העלאה מקומית.

## הערות
- **Read-only:** ה-scope הוא `drive.readonly` — האפליקציה רק קוראת, לא כותבת/מוחקת.
- **הכל בדפדפן:** אין שרת משלך; הקובץ עובר ישירות מ-Drive לדפדפן ומחושב מקומית.
- **פרסום פומבי:** אם תוציא את זה מעבר ל-test users, Google תדרוש verification לאפליקציה.
- **חלופה בלי הקמה:** אפשר תמיד לבקש ממני (Claude) למשוך קובץ מה-Drive ולסכם/להטמיע — בלי OAuth בכלל.
