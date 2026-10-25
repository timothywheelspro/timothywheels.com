#!/usr/bin/env python3
"""
Cloudflare Pages helper for the deploy safety pipeline (stdlib only).

  python tools/cf-pages.py wait <commit-sha>       # wait for the production build of this commit
  python tools/cf-pages.py rollback <commit-sha>   # roll production back to the last good deploy before it

Env:
  CLOUDFLARE_API_TOKEN   token with Account > Cloudflare Pages > Edit
  CLOUDFLARE_ACCOUNT_ID  your Cloudflare account ID
  CF_PAGES_PROJECT       Pages project name (default: timothywheels-com)

`wait` prints `status=success|failure|skipped|timeout` (also to $GITHUB_OUTPUT) and exits 0.
`rollback` exits non-zero if it could not roll back.
"""
from __future__ import annotations

import json
import os
import sys
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API = "https://api.cloudflare.com/client/v4"


def env(name: str, default: str | None = None) -> str:
    v = os.environ.get(name, default)
    if not v:
        sys.exit(f"missing {name}: add it as a repository secret/variable (see tools/README-deploy-safety.md)")
    return v


def call(method: str, path: str) -> dict:
    req = Request(f"{API}{path}", method=method, headers={
        "Authorization": f"Bearer {env('CLOUDFLARE_API_TOKEN')}",
        "Content-Type": "application/json",
    })
    try:
        with urlopen(req, timeout=30) as r:
            return json.load(r)
    except HTTPError as e:
        sys.exit(f"Cloudflare API {method} {path} -> {e.code}: {e.read().decode()[:400]}")


def base() -> str:
    return f"/accounts/{env('CLOUDFLARE_ACCOUNT_ID')}/pages/projects/{os.environ.get('CF_PAGES_PROJECT', 'timothywheels-com')}"


def production_deploys() -> list[dict]:
    return call("GET", f"{base()}/deployments?env=production&per_page=25").get("result", [])


def sha_of(d: dict) -> str:
    return (d.get("deployment_trigger") or {}).get("metadata", {}).get("commit_hash", "") or ""


def stage(d: dict) -> tuple[str, str]:
    s = d.get("latest_stage") or {}
    return s.get("name", ""), s.get("status", "")


def out(**kv: str) -> None:
    for k, v in kv.items():
        print(f"{k}={v}")
    gh = os.environ.get("GITHUB_OUTPUT")
    if gh:
        with open(gh, "a") as f:
            for k, v in kv.items():
                f.write(f"{k}={v}\n")


def wait(sha: str, timeout: int = 900) -> None:
    end = time.time() + timeout
    while time.time() < end:
        for d in production_deploys():
            if not sha_of(d).startswith(sha[:7]):
                continue
            if d.get("is_skipped"):
                return out(status="skipped", deployment=d["id"])
            name, status = stage(d)
            if status == "failure":
                return out(status="failure", deployment=d["id"])
            if name == "deploy" and status == "success":
                return out(status="success", deployment=d["id"], url=d.get("url", ""))
        time.sleep(20)
    out(status="timeout", deployment="")


def rollback(bad_sha: str) -> None:
    deploys = production_deploys()  # newest first
    seen_bad = False
    target = None
    for d in deploys:
        if sha_of(d).startswith(bad_sha[:7]):
            seen_bad = True
            continue
        name, status = stage(d)
        if seen_bad and name == "deploy" and status == "success" and not d.get("is_skipped"):
            target = d
            break
    if not target:
        sys.exit(f"no earlier successful production deploy found to roll back to (bad commit {bad_sha[:7]})")
    call("POST", f"{base()}/deployments/{target['id']}/rollback")
    out(rolled_back_to=sha_of(target)[:7] or target["id"], deployment=target["id"])


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in {"wait", "rollback"}:
        sys.exit(__doc__)
    {"wait": wait, "rollback": rollback}[sys.argv[1]](sys.argv[2])
