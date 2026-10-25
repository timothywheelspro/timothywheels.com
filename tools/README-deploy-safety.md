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
