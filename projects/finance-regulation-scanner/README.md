# 📂 סורק רגולציה — Regulation Scanner

כלי לדוגמה לצוות **Finance & Operations** · נבנה ב-Claude Code · חלק מסדנת Whalo.

## מה זה עושה
משווה רגולציה חדשה מול המדיניות הקיימת ומחזיר **דוח פערים** מדורג לפי חומרה,
עם המלצת עדכון לכל פער.

## מבנה
```
finance-regulation-scanner/
├── GOAL.md · README.md · STEPS.md
├── data/new-regulation.md      ← הרגולציה החדשה (מדומה)
├── data/current-policy.md      ← המדיניות הקיימת (מדומה)
├── app/index.html              ← דוח הפערים
└── .claude/skills/regulation-scanner/SKILL.md
```

## איך מריצים
פותחים את `app/index.html` בדפדפן. רץ offline.

## 🔌 חיבור (Google Drive) + web
בעבודה אמיתית: הרגולציות והמדיניות יושבות ב-Drive. אפשר גם לבקש מ-Claude לקרוא
**דף רגולציה ציבורי מהאינטרנט** ולהשוות מולו. *"השווה את העמוד הזה מול המדיניות ב-Drive."*

## הדפוס שלוקחים
**מסמך צפוף → מה רלוונטי לנו ומה לעשות.** ⚖️ הכלי מסמך ומסביר — לא ייעוץ משפטי.
