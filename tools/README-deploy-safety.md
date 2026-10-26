# Deploy safety: update → smoke test → roll back

| Stage | Where | What happens |
|---|---|---|
| Before merge | `.github/workflows/pr-check.yml` | Every PR (Dependabot included) builds the site and must pass `tools/smoke-test.py`. |
| Deploy | Cloudflare Pages (Git integration) | Cloudflare builds and publishes `main` to timothywheels.com. |
| After deploy | `.github/workflows/deploy.yml` → `verify` | Waits for Cloudflare's production deploy of the commit, then smoke-tests the live site. A pass moves the `last-good-deploy` tag. |
| On failure | `deploy.yml` → `rollback` | Uses Cloudflare's **roll back to a previous deployment** to restore the last good production deploy, re-checks, and opens a GitHub issue. If Cloudflare's own build failed, nothing went live, so it just opens an issue. |

## One-time setup

1. **Cloudflare API token.** Cloudflare dashboard → My Profile → API Tokens → Create Token → *Custom token*.
   - Permissions: **Account → Cloudflare Pages → Edit**. Nothing else.
   - Account resources: your account only.
2. **Account ID.** Cloudflare dashboard → Workers & Pages → right sidebar → *Account ID*.
3. **GitHub secrets.** Repo → Settings → Secrets and variables → Actions → New repository secret:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

Until both secrets exist, `verify` still smoke-tests the live site, but rollback is disabled and you get a warning.

## Manual rollback

Cloudflare → Workers & Pages → `timothywheels-com` → Deployments → pick the last good production deploy → **Rollback to this deployment**.

## Maintained hosting record

Cloudflare Pages project: `timothywheels-com`. Canonical origin: <https://timothywheels.com/>.
Repository: `timothywheelspro/timothywheels.com`. Production branch: `main`.
Build command currently configured: `hugo --gc --minify`. Output directory: `public`.
Hugo Extended: **0.158.0** (`netlify.toml` and `pr-check.yml` must agree).
PaperMod submodule: `118119693d8b5ac211b939775678310973bcb232`.
Update this record alongside the next compiler/theme upgrade.

Preview builds use their own environment configuration. Production settings do not prove Preview settings are correct, or vice versa. The successful Preview fix used `HUGO_VERSION=extended_0.158.0`; keep the compiler version consistent in both environments and verify the build's detected-tools line after saving.

### Preflight and rollout

PR checks run `python3 tools/build-preflight.py --environment ci` before building.
The script compares the installed Extended compiler with the version in `netlify.toml`, prints only intended/installed versions, environment, branch, and commit, and exits nonzero on mismatch. It never inventories the process environment or accesses a credential.

The existing Cloudflare command does **not** run this script yet. Owner action after this PR merges: change the Pages build command to:

```sh
python3 tools/build-preflight.py && hugo --gc --minify
```

Confirm both Preview and Production logs show the expected facts before calling this an enforced Cloudflare preflight. `CF_PAGES_BRANCH` and `CF_PAGES_COMMIT_SHA` identify the deployment; `main` is Production and other branches are Preview. Run locally after selecting the intended compiler on PATH:

```sh
python3 tools/build-preflight.py --environment local
# Optional: compare the detected-tools version from a saved log too.
python3 tools/build-preflight.py --environment preview --cloudflare-log /path/to/build.log
```

The optional log stays local; only its extracted Hugo version is printed. The script's installed version comes from `hugo version`, not a claim that it read Cloudflare's installer log. Missing Extended support, a mismatched installed version, or missing/mismatched supplied log evidence stops the check.

### Environment mismatch runbook

1. Record the failed deployment URL, environment, branch, and exact commit. Read `Detected the following tools` and the installed `hugo version` line.
2. Compare against the intended version. Stop application/template debugging while they disagree. One unchanged retry calls for a configuration check, not another identical retry.
3. Inspect the actual controls. Verify the target environment and that the saved value persists after reload; do not infer an unseen selector or treat an editable row as proof.
4. If a variable inventory is needed, record **names only**. Never paste credentials or unrelated values. State theories as theories until supported by evidence.
5. Any credential-dependent environment edit requires a fresh, narrowly scoped owner exception. The earlier Preview-only approval was consumed; it is not standing permission. Compare before/after in memory and verify unrelated variables and Production were preserved.
6. Start a new build and confirm the detected-tools line and preflight facts. After owner merge, verify the production workflow for the matching merge commit, including the live smoke test and last-good marker.
7. A failed production verification or unresolved environment mismatch pauses new release work. Diagnose/recover before increasing output.

The successful one-time correction is recorded in [the approved update run](https://github.com/timothywheelspro/timothywheels.com/actions/runs/40260145481). Its temporary privileged job and helper were removed before merge. No ongoing environment-edit job is authorized by this record.

### Merge and completion policy

Owner settings tasks: verify/configure required PR review and the intended checks on `main`; turn off GitHub Pages if still enabled. Passing checks alone do not prove branch protection is enforced. Suggested required check: `PR smoke test / smoke`, plus the intended Cloudflare preview check after confirming its exact context in repository settings.

Never push to a merged essay, upgrade, or follow-up branch. Open a fresh PR. The monitor's fixed `fix/site-monitor` name is the controlled exception: retire a closed cycle and recreate it from current main.

Use explicit states: **prepared**, **validated**, **merged**, **verified live**. Add **distributed** only when a platform post and public URL exist. The existing verification/rollback workflow remains the recovery authority; this documentation does not change its logic or credentials.

Repository About text/topics now identify Cloudflare Pages; source documentation points here. Keep `netlify.toml`: `tools/site-monitor.py` reads its redirects. Migrating that source requires a separate tested change.
