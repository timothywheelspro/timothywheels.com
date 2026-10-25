#!/usr/bin/env python3
"""
timothywheels.com smoke test.

The rule: update -> smoke test -> roll back if it fails. This script is the middle step.
It answers one question fast: does the site a reader would load actually work?

Checks:
  - Home page and /blog/ return 200 and contain real content
  - Every post linked from /blog/ returns 200
  - Essay-layout posts load their stylesheet, script, fonts and every motion scene + poster
  - Every page's og:image (the link-preview picture) resolves

Usage:
  python tools/smoke-test.py                                   # live site
  python tools/smoke-test.py --base http://localhost:8000      # a local build (pre-deploy gate)
  python tools/smoke-test.py --retries 6 --wait 20             # after a deploy, while caches settle

Exit code 0 = pass, 1 = fail. Stdlib only.
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

SITE = "https://timothywheels.com"
UA = {"User-Agent": "Mozilla/5.0 (timothywheels-smoke-test/1.0)"}


class Smoke:
    def __init__(self, base: str, timeout: int):
        self.base = base.rstrip("/")
        self.timeout = timeout
        self.failures: list[str] = []
        self.checked = 0
        self._seen: dict[str, tuple[int, str]] = {}

    def local(self, url: str) -> str:
        """Point absolute production URLs at the server under test."""
        if url.startswith(SITE):
            return self.base + url[len(SITE):]
        if url.startswith("/"):
            return self.base + url
        return url

    def get(self, url: str) -> tuple[int, str]:
        url = self.local(url)
        if url in self._seen:
            return self._seen[url]
        try:
            with urlopen(Request(url, headers=UA), timeout=self.timeout) as r:
                body = r.read()
                ctype = r.headers.get("Content-Type", "")
                text = body.decode("utf-8", "replace") if "text" in ctype or "html" in ctype else ""
                res = (r.status, text)
        except HTTPError as e:
            res = (e.code, "")
        except (URLError, TimeoutError, OSError) as e:
            res = (0, str(e))
        self._seen[url] = res
        self.checked += 1
        return res

    def expect(self, url: str, what: str, must_contain: str | None = None) -> str:
        status, text = self.get(url)
        if status != 200:
            self.failures.append(f"{what}: {url} -> {status or text}")
        elif must_contain and must_contain not in text:
            self.failures.append(f"{what}: {url} loaded but is missing {must_contain!r}")
        return text

    def assets_on(self, page: str, html: str) -> None:
        # Link preview image
        for m in re.finditer(r'<meta property="?og:image"? content="?([^" >]+)', html):
            self.expect(m.group(1), f"og:image on {page}")
        # Essay layout assets
        if 'class="essay' in html or "class=essay" in html:
            for m in re.finditer(r'(?:href|src)="?([^" >]+\.(?:css|js|woff2))', html):
                u = m.group(1)
                if any(k in u for k in ("/css/essay", "/js/essay", "/motion/", "/fonts/")):
                    self.expect(urljoin(SITE + "/", u), f"essay asset on {page}")
            for name in set(re.findall(r'data-scene="?([a-z0-9-]+)', html)):
                self.expect(f"{SITE}/motion/scenes/{name}.js", f"motion scene on {page}", "CYWScenes")
                self.expect(f"{SITE}/motion/posters/{name}.png", f"motion poster on {page}")

    def run(self) -> bool:
        home = self.expect(f"{SITE}/", "home page", "</html>")
        if home:
            self.assets_on("/", home)
        blog = self.expect(f"{SITE}/blog/", "blog index", "post-entry")
        posts = sorted(set(
            urlparse(h).path for h in re.findall(r'href="?([^" >]*/blog/[a-z0-9-]+/)', blog)
        ) - {"/blog/page/"})  # pagination alias, not a post
        if blog and not posts:
            self.failures.append("blog index: no post links found")
        for path in posts:
            html = self.expect(f"{SITE}{path}", f"post {path}", "</article>")
            if html:
                self.assets_on(path, html)
        return not self.failures


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default=SITE, help="server to test (default: live site)")
    ap.add_argument("--retries", type=int, default=1, help="attempts before declaring failure")
    ap.add_argument("--wait", type=int, default=15, help="seconds between attempts")
    ap.add_argument("--timeout", type=int, default=15)
    args = ap.parse_args()

    for attempt in range(1, args.retries + 1):
        s = Smoke(args.base, args.timeout)
        ok = s.run()
        print(f"[attempt {attempt}/{args.retries}] {s.checked} URLs checked against {s.base}: {'PASS' if ok else 'FAIL'}")
        if ok:
            return 0
        last = attempt == args.retries
        for f in s.failures:
            print(f"  - {f}")
            if last and os.environ.get("GITHUB_ACTIONS"):
                print(f"::error title=Smoke test::{f}")  # shows on the run summary
        if attempt < args.retries:
            time.sleep(args.wait)
    return 1


if __name__ == "__main__":
    sys.exit(main())
