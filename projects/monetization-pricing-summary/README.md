# 📂 סיכום ניסוי תמחור — Pricing A/B Summary

כלי לדוגמה לצוות **Monetization** · נבנה ב-Claude Code · חלק מסדנת Whalo.

## מה זה עושה
מתוצאות A/B (CSV) → דשבורד עם המרה, ARPU והכנסה לכל וריאנט, הזוכה מודגש,
והמלצה ברורה איזה מחיר לשגר.

## מבנה
```
monetization-pricing-summary/
├── GOAL.md · README.md · STEPS.md
├── data/pricing-ab-results.csv ← תוצאות הניסוי (מדומה)
├── app/index.html              ← הדשבורד
└── .claude/skills/pricing-summary/SKILL.md
```

## איך מריצים
פותחים את `app/index.html` בדפדפן. רץ offline. כל המדדים מחושבים מהמספרים הגולמיים.

## 🔌 חיבור (Mixpanel / Snowflake)
בעבודה אמיתית התוצאות מגיעות מ-Mixpanel או מ-Whalo Brain. אפשר לבקש:
*"משוך את תוצאות ניסוי התמחור האחרון מ-Mixpanel וסכם מי ניצח."*

## הדפוס שלוקחים
**מספרים גולמיים → חישוב + ויזואליזציה + החלטה.** עובד לכל ניתוח תוצאות.
