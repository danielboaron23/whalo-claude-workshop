# 📂 בריף בוקר — Daily Brief

כלי לדוגמה לצוות **Product** · נבנה ב-Claude Code · חלק מסדנת Whalo.

## מה זה עושה
אוסף מ-Slack + Notion (מדומים) ומחזיר דיג'סט בוקר ממוקד: הכי חשוב היום, חסמים,
עדכונים, משימות, ויומן.

## מבנה
```
product-daily-brief/
├── GOAL.md · README.md · STEPS.md
├── data/slack-export.json      ← הודעות Slack (מדומה)
├── data/notion-notes.md        ← הערות ספרינט (מדומה)
├── app/index.html              ← דשבורד הבריף
└── .claude/skills/daily-brief/SKILL.md
```

## איך מריצים
פותחים את `app/index.html` בדפדפן. רץ offline.

## 🔌 חיבור (Slack + Notion) + תזמון
בעבודה אמיתית: עם ה-connectors אפשר לבקש *"הכן לי בריף בוקר מ-#reef-rumble-product
ומהערות ה-Notion של הספרינט"* — ו**לתזמן** שזה ירוץ אוטומטית כל בוקר. זה ה-superpower הנסתר.

## הדפוס שלוקחים
**הרבה מקורות רעש → סיכום קצר וממוקד.** עובד לכל "סקירת בוקר" חוזרת.
