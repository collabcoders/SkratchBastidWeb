# Production deployment

`deploy-production.yml` builds the Angular **skratchbastid** app and deploys the
static output to the production IIS server (skratchbastid.com) over FTPS.

## One-time setup: add repository secrets

In GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Add:

| Secret            | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| `FTP_HOST`        | FTP hostname or IP of the VPS (e.g. `skratchbastid.com` or the VPS IP). |
| `FTP_USERNAME`    | FTP username.                                                         |
| `FTP_PASSWORD`    | FTP password.                                                         |
| `FTP_REMOTE_DIR`  | Path to the site's web root as seen over FTP — the folder that holds `index.html` and `web.config`. Often `/` (if the FTP login is rooted at the site) or something like `/skratchbastid.com`. |

> Secrets are per-repository, so set these on this repo even if other repos
> already have secrets with the same names.

## How to deploy

Push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Or run it manually: **Actions → Deploy to Production (IIS / FTPS) → Run workflow**.

## What it does

1. Installs deps with `npm install --no-audit --no-fund` (this repo gitignores
   `package-lock.json`, so we can't use `npm ci`) and runs a production build
   (`npm run build` → `dist/skratchbastid`, with `environment.prod.ts` swapped in).
2. Writes a `version.json` into the build, stamped with the tag version + commit.
3. Mirrors everything **except** `index.html`/`version.json` up via FTPS first
   (deleting stale files), so the new hashed JS/CSS bundles land while the old
   `index.html` still references the old bundles.
4. Uploads `index.html` and `version.json` **last**, so users only start getting
   the new `index.html` once the bundles it references already exist.

Before deploying a tag, the workflow reads `https://skratchbastid.com/version.json`
and **refuses to deploy** a version that is equal to or older than what's live,
so an accidental lower tag can't downgrade production. The first deploy (before
`version.json` exists) is allowed through.

## How routing works on IIS

`public/web.config` ships with every build (Angular copies `public/` to the site
root). It tells IIS to serve `index.html` for any request that isn't a real file
or folder, so Angular's client-side router handles deep links / refreshes. It also
marks `index.html` and `version.json` as no-cache so new deploys take effect
immediately.

> Requires the **URL Rewrite** IIS module on the server (standard on most setups).

## Notes / tuning

- `ssl:verify-certificate no` is set because VPS FTP servers often use self-signed
  certs. If the FTP server has a valid certificate, you can remove that line for
  stricter security.
- If the server uses **implicit** FTPS (port 990), change the `lftp` target to
  `ftps://$FTP_HOST` instead of relying on `ftp:ssl-force`.
- The runner uses Node 22 (the active LTS, supported by Angular 22). Bump the
  `node-version` in the workflow if you move to a newer Node.
- The build runs with the repo's committed `environment.prod.ts`. Update that
  file to change production config (API targets, Stripe keys, etc.).
