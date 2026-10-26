#!/usr/bin/env python3
"""Record allowlisted build facts and refuse a mismatched Hugo compiler. Stdlib only."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--environment", choices=["local", "ci", "preview", "production"])
    parser.add_argument("--cloudflare-log", type=Path,
                        help="Optional saved build log; only its Hugo detected-tools version is emitted")
    args = parser.parse_args()
    expected = re.search(r'^\s*HUGO_VERSION\s*=\s*"([0-9.]+)"',
                         (ROOT / "netlify.toml").read_text(), re.M).group(1)
    version = subprocess.check_output(["hugo", "version"], text=True)
    match = re.search(r"hugo v(\d+\.\d+\.\d+).*?\+extended", version)
    effective = match.group(1) if match else None
    branch = os.environ.get("CF_PAGES_BRANCH") or os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME") or git("branch", "--show-current")
    commit = os.environ.get("CF_PAGES_COMMIT_SHA") or os.environ.get("GITHUB_SHA") or git("rev-parse", "HEAD")
    environment = args.environment
    if not environment:
        if os.environ.get("CF_PAGES") == "1":
            environment = "production" if branch == "main" else "preview"
        else:
            environment = "ci" if os.environ.get("GITHUB_ACTIONS") == "true" else "local"
    facts = {"intended_hugo": expected, "installed_hugo_extended": effective,
             "environment": environment, "branch": branch, "commit": commit}
    if args.cloudflare_log:
        detected = re.findall(r"Detected the following tools[^\n]*hugo@(?:extended_)?(\d+\.\d+\.\d+)", args.cloudflare_log.read_text())
        facts["cloudflare_detected_hugo"] = detected[-1] if detected else None
    print(json.dumps(facts, sort_keys=True))
    if effective != expected or (args.cloudflare_log and facts["cloudflare_detected_hugo"] != expected):
        print("Preflight failed: Hugo version/Extended mismatch or missing detection evidence. Check the target environment before retrying.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
