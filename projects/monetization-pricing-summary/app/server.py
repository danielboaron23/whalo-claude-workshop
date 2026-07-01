#!/usr/bin/env python3
"""Static file server for the pricing app + a tiny Notion proxy.

Why a proxy? Notion's API (api.notion.com) does NOT send CORS headers, so a
browser cannot call it directly. This server serves the app AND exposes a
/notion endpoint that queries the Notion database server-side (where the token
safely lives) and returns the rows as CSV — the exact shape the app parses.

Run:
    NOTION_TOKEN=secret_xxx python3 server.py 8123
or put the token on the first line of app/.notion-token and just:
    python3 server.py 8123

Local CSV upload works without any of this — the proxy is only for the
"משכו מ-Notion" button.
"""
import os, sys, json, io, csv, urllib.request, urllib.error
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
NOTION_VERSION = "2022-06-28"
# "Pricing A/B — Gem Pack Test" database created in the workshop. Override with NOTION_DB_ID.
DEFAULT_DB_ID = "d73c9d734e2e43bbbd0f3eeb958bd383"
COLUMNS = ["variant", "description", "price_usd", "users", "buyers", "revenue_usd"]


def notion_token():
    tok = os.environ.get("NOTION_TOKEN", "").strip()
    if tok:
        return tok
    path = os.path.join(HERE, ".notion-token")
    if os.path.exists(path):
        with open(path) as f:
            return f.readline().strip()
    return ""


def prop_to_value(prop):
    t = prop.get("type")
    v = prop.get(t)
    if t in ("title", "rich_text"):
        return "".join(seg.get("plain_text", "") for seg in (v or []))
    if t == "number":
        return "" if v is None else v
    if t == "select":
        return v.get("name", "") if v else ""
    if t == "formula":
        return v.get(v.get("type"), "") if v else ""
    return "" if v is None else str(v)


def fetch_notion_csv(db_id, token):
    url = "https://api.notion.com/v1/databases/%s/query" % db_id
    req = urllib.request.Request(url, data=b"{}", method="POST", headers={
        "Authorization": "Bearer " + token,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.load(resp)
    rows = []
    for page in data.get("results", []):
        props = page.get("properties", {})
        rows.append({c: (prop_to_value(props[c]) if c in props else "") for c in COLUMNS})
    rows.sort(key=lambda r: str(r.get("variant", "")))  # deterministic order
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=COLUMNS)
    w.writeheader()
    for r in rows:
        w.writerow(r)
    return buf.getvalue()


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] == "/notion":
            return self.handle_notion()
        return super().do_GET()

    def handle_notion(self):
        token = notion_token()
        if not token:
            return self._text(400, "⚠️ Notion לא הוגדר: אין טוקן. ראו SETUP-NOTION.md — שימו את הטוקן ב-app/.notion-token או ב-NOTION_TOKEN.")
        db_id = os.environ.get("NOTION_DB_ID", DEFAULT_DB_ID)
        try:
            csv_text = fetch_notion_csv(db_id, token)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            return self._text(502, "⚠️ שגיאת Notion %s: %s" % (e.code, body))
        except Exception as e:
            return self._text(502, "⚠️ שגיאה בפנייה ל-Notion: %s" % e)
        payload = csv_text.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/csv; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _text(self, code, msg):
        payload = msg.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *a):  # keep the console quiet
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
    ThreadingHTTPServer(("", port), partial(Handler, directory=HERE)).serve_forever()
