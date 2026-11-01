# MEMORY.md — SkratchBastidWeb

Durable operating facts for agents working this repo. Session state lives in `handoff.md`.
Read both before any work.

## Identity

- Skratch Bastid membership / tour site (Top Grillin', Bastid's BBQ, mixes, videos, livestream).
  Angular CLI project name: `skratchbastid`.
- Home channel: **Slack `#skratchbastid-web` (C0CDGPAPBF1)** — task source, full autonomy
  (Slack-originated asks are not Trello approval-gated).
- Hosted agent clone: `/opt/data/projects/skratchbastid/SkratchBastidWeb` (full clone).
  Johnny's Mac: `~/Documents/SkratchBastidWeb` (siblings under `~/Documents`).

## Stack

- Angular 22.0.2 / TypeScript 6 / Tailwind 4 + Bootstrap 5 + SCSS. NgModule style
  (`standalone: false`), declared in `app.module.ts`.
- jQuery/bootbox imperative modals, Stripe (ngx-stripe), mux-player, video.js, plyr, wavesurfer.
- Views: `src/app/views/*` (home, videos, audios, topgrillin, bastidbbq, livestream, newsletter,
  profile, upgrade, rotw-detail, bbq-recaps). Many paths (`join`, `login`, `events`, policies)
  map to `HomeComponent`. Routes: `src/app/app-routing.module.ts`.
- ~270 MB of media is committed in-repo (`public/videos` 184 MB, `src/assets` 64 MB).

## Backend

- Shared multi-tenant **LegendsOnlyAPI** (`environment.legendsApi`, tenant via `X-App` header,
  services under `src/app/_shared/services/legends/`). Same API serves DJJazzyJeffWeb +
  LegendsOnlyWeb — any API/DTO change is cross-cutting; say so before proposing one.
  API clone on the box: `/opt/data/projects/legendsonly/LegendsOnlyAPI`.
- Dev `environment.ts` → `https://localhost:7039` (local API); prod → `https://api.legendsonly.tv`.
- `InterceptorService` attaches the member Bearer token to outgoing requests — any new off-domain
  HttpClient call must opt out or it leaks the token (this bit DJJazzyJeffWeb twice).
- Top Grillin' signup links out to `wp.skratchbastid.com/register/...` (WordPress, live).

## Conventions

- **Branch policy: `main` only.** The remote has no `dev` branch — do NOT dual-push here.
  Standing push approval on `main`.
- Every commit must update `handoff.md` — enforced by `.git/hooks/pre-commit`.
- `package-lock.json` is gitignored → `npm install`, never `npm ci` (CI does the same).
  `.npmrc` sets `legacy-peer-deps=true`.

## Verified commands (VPS, 2026-11-01, Node 26.12.1)

- `npm install --no-audit --no-fund` → ok.
- `npx ng build --configuration production --output-path <dir>` → exit 0, initial total
  5.27 MB raw / 1.26 MB transfer, 3 pre-existing benign warnings (missing
  `/assets/fonts/{CircularStdBook,DrukWideBold,VolkolakGrotesqueBold}.css`).
- `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit` → exit 0 (~2 s).
- Tests: **none.** 0 `*.spec.ts` files and Karma is not in devDependencies, so `npm test`
  cannot run. `.harness.json` records `test` as a known failure; the build is the gate.
- On the box, put build output under `/opt/data/cache/scratch/`, not in the repo.

## Deploy

- Tag-triggered FTPS mirror to IIS — `.github/workflows/deploy-production.yml`, on `v*` tags or
  manual dispatch. Tag format is `v1.0.0NN` (latest `v1.0.012`, deployed 2026-07-23, green).
  Next tag: `v1.0.013`. Secrets FTP_HOST/USERNAME/PASSWORD/REMOTE_DIR are set on the repo.

## Gotchas

- ⚠️ **The domain no longer serves this app (checked 2026-11-01).** `skratchbastid.com` 301s to
  `www.skratchbastid.com`, which is a Cloudflare-fronted **Nuxt** site, not this Angular build;
  `/version.json` 404s there. Where the IIS deploy is actually reachable is unconfirmed.
- ⚠️ The downgrade guard in the deploy workflow curls `https://skratchbastid.com/version.json`
  without `-L`; it receives the 301 HTML, `sed` passes it through, and the comparison falls
  through to "OK". **The guard currently guards nothing** — it neither blocks nor reads the
  real live version.
- ⚠️ Share URLs are hardcoded to `https://magmob.skratchbastid.com/` (dead host — does not
  resolve): `audio-player.component.ts:453` (track share) and `check-image.pipe.ts:12`
  (default avatar). Same rot DJJazzyJeffWeb fixed by building from `window.location.origin`.
- Committed client keys in `src/environments/` (Stripe `pk_live`, reCAPTCHA site key) are public by
  design. `prodId` (`prod_RvMADg6RCwpL34`) is hardcoded — a Stripe product change is a code change.
  No server-side secrets found in the repo (scanned 2026-11-01).

## People

- Commit history: Johnny Arguelles + Ali Abdul Wahid.
