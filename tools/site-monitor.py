#!/usr/bin/env python3
"""
timothywheels.com nightly site monitor (CI version).

Checks:
  - All netlify.toml external redirect destinations are reachable
  - /book → https://getrichorgetfree.com/founding is live
  - External links in Markdown content files return 2xx/3xx

Exits 0 if clean, 1 if issues found.
Set OPEN_PR=1 env var to open a GitHub PR on failure (done by the workflow).
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
import tomllib
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

REPO = Path(__file__).resolve().parent.parent
NETLIFY_TOML = REPO / "netlify.toml"
CONTENT_DIR = REPO / "content"

CRITICAL_REDIRECTS = {
    "/book": "getrichorgetfree.com",
    "/linkedin": "linkedin.com",
}

LIVE_SITE = "https://timothywheels.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (site-monitor/1.0)"}
TIMEOUT = 12


@dataclass
class Issue:
    category: str
    source: str
    url: str
    detail: str


@dataclass
class Report:
    date: str = field(default_factory=lambda: date.today().isoformat())
    issues: list[Issue] = field(default_factory=list)

    def add(self, category: str, source: str, url: str, detail: str) -> None:
        self.issues.append(Issue(category, source, url, detail))

    @property
    def ok(self) -> bool:
        return len(self.issues) == 0

    def as_markdown(self) -> str:
        lines = [
            f"# Site Monitor Report — {self.date}",
            "",
            f"**Status:** {'✅ No issues found' if self.ok else f'⚠️ {len(self.issues)} issue(s) found'}",
            "",
        ]
        if self.issues:
            lines += ["## Issues", ""]
            for i in self.issues:
                lines.append(f"### {i.category.upper()} — `{i.source}`")
                lines.append(f"- **URL:** {i.url}")
                lines.append(f"- **Detail:** {i.detail}")
                lines.append("")
        return "\n".join(lines)


def check_url(url: str) -> tuple[int, str]:
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=TIMEOUT) as resp:
            return resp.status, resp.url
    except HTTPError as e:
        return e.code, url
    except URLError as e:
        return 0, str(e.reason)
    except Exception as e:
        return 0, str(e)


def check_redirects(report: Report) -> None:
    with open(NETLIFY_TOML, "rb") as f:
        data = tomllib.load(f)
    external = [r for r in data.get("redirects", []) if r.get("to", "").startswith("http")]

    for r in external:
        dest = r["to"]
        status, final = check_url(dest)
        time.sleep(0.3)
        if status == 0:
            report.add("redirect", r.get("from", "?"), dest, f"Unreachable: {final}")
        elif status >= 400:
            report.add("redirect", r.get("from", "?"), dest, f"HTTP {status}")

    for path, expected in CRITICAL_REDIRECTS.items():
        status, final = check_url(f"{LIVE_SITE}{path}")
        time.sleep(0.3)
        if status == 0:
            report.add("critical", path, f"{LIVE_SITE}{path}", f"Failed: {final}")
        elif expected not in final:
            report.add("critical", path, f"{LIVE_SITE}{path}",
                       f"Expected '{expected}' in destination, got: {final}")


_MD_LINK_RE = re.compile(r'\[(?:[^\]]+)\]\((https?://[^)]+)\)')


def check_content_links(report: Report) -> None:
    for md in CONTENT_DIR.rglob("*.md"):
        text = md.read_text(encoding="utf-8", errors="ignore")
        urls = list(dict.fromkeys(_MD_LINK_RE.findall(text)))
        for url in urls:
            status, _ = check_url(url)
            time.sleep(0.2)
            if status == 0:
                report.add("link", str(md.relative_to(REPO)), url, "Unreachable")
            elif status >= 400:
                report.add("link", str(md.relative_to(REPO)), url, f"HTTP {status}")


def open_pr(report: Report) -> None:
    branch = "fix/site-monitor"

    def run(*args: str) -> str:
        return subprocess.run(args, cwd=REPO, check=True,
                              capture_output=True, text=True).stdout.strip()

    # Preserve the open PR's history; a new cycle starts from current main.
    prs = json.loads(run("gh", "pr", "list", "--state", "open", "--base", "main",
                         "--head", branch, "--json", "number"))
    run("git", "config", "user.email", "monitor@timothywheels.com")
    run("git", "config", "user.name", "site-monitor")
    run("git", "fetch", "origin", "main")
    if prs:
        run("git", "fetch", "origin", branch)
        run("git", "checkout", "-B", branch, "FETCH_HEAD")
        run("git", "merge", "--no-edit", "origin/main")
    else:
        # Retire a closed/merged cycle before reusing the fixed branch name.
        if run("git", "ls-remote", "--heads", "origin", f"refs/heads/{branch}"):
            run("git", "push", "origin", "--delete", branch)
        run("git", "checkout", "-B", branch, "origin/main")

    report_path = REPO / "site-monitor-report.md"
    report_path.write_text(report.as_markdown(), encoding="utf-8")
    run("git", "add", "site-monitor-report.md")
    if run("git", "diff", "--cached", "--name-only"):
        run("git", "commit", "-m",
            f"fix: site monitor {report.date} — {len(report.issues)} issue(s)")
    run("git", "push", "-u", "origin", branch)

    title = f"fix: site monitor — {len(report.issues)} issue(s) ({report.date})"
    if prs:
        result = run("gh", "pr", "edit", str(prs[0]["number"]),
                     "--title", title, "--body-file", str(report_path))
        print(f"PR updated: {result}")
    else:
        result = run("gh", "pr", "create", "--title", title,
                     "--body-file", str(report_path), "--base", "main", "--head", branch)
        print(f"PR opened: {result}")
    # GITHUB_TOKEN pushes/PRs do not trigger pull_request workflows.
    run("gh", "workflow", "run", "pr-check.yml", "--ref", branch)


def main() -> int:
    print(f"[monitor] {date.today().isoformat()}")

    report = Report()

    print("[monitor] Checking redirects...")
    check_redirects(report)

    print("[monitor] Checking content links...")
    check_content_links(report)

    if report.ok:
        print("[monitor] ✅ All checks passed.")
        return 0

    print(f"[monitor] ⚠️  {len(report.issues)} issue(s):")
    for i in report.issues:
        print(f"  [{i.category}] {i.source} → {i.url}: {i.detail}")

    if os.getenv("OPEN_PR") == "1":
        open_pr(report)

    return 1


if __name__ == "__main__":
    sys.exit(main())
