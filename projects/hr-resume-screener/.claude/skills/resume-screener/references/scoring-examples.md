# Scoring calibration — two worked examples

> דוגמאות עבר שמכיילות את הסקיל: ככה ציון מתורגם מ-CV. זו הדרך השנייה שידע נכנס —
> **דוגמאות טובות שכבר עבדו**, ש-Claude לומד מהן את הדפוס.

---

## Example A — strong fit → **82 · לראיון**

**CV (excerpt):** "Product Analyst at a mobile F2P studio, 4 yrs. Owned the LiveOps
A/B program (pricing, offers). Daily SQL on BigQuery; built the retention dashboard.
Hebrew native, English fluent."

| Criterion | Pts (of weight) | Why |
|---|---|---|
| Must-haves (40) | 38 | All mandatory reqs evidenced (SQL, experiments, F2P) |
| Domain (25) | 23 | Direct F2P + LiveOps experience |
| Hard skills (20) | 16 | Real, recent SQL + A/B ownership |
| Seniority (10) | 8 | 4 yrs matches a mid-level analyst role |
| Comms/language (5) | 5 | Meets HE+EN bar |
| **Total** | **82** | חוזקות: F2P LiveOps, owns A/B. פערים: none material. |

---

## Example B — missing a must-have → **41 · לא כרגע**

**CV (excerpt):** "Marketing analyst, 6 yrs. Strong in dashboards and reporting.
Excel power user. No SQL. Some experience with consumer apps."

Must-have = SQL. It is **missing** → total **capped at 54**.

| Criterion | Pts (of weight) | Why |
|---|---|---|
| Must-haves (40) | 14 | SQL (mandatory) absent → cap applies |
| Domain (25) | 12 | Consumer apps, not games/F2P |
| Hard skills (20) | 9 | Reporting yes, but not the asked-for SQL/experiments |
| Seniority (10) | 6 | Senior in years but mismatched scope |
| Comms/language (5) | 5 | Fine |
| **Total (pre-cap 46 → cap 54)** | **41** | פערים: **חסר SQL (must-have)**. |

> Takeaway: a missing must-have is the single biggest driver. Always surface it first.
