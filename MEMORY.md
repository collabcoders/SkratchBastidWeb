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

- Auth modals (`#loginModal`, `#registerModal`) use a `.modal-light` theme whose component SCSS
  forces `.text-gray-400/.text-white/...` to `rgb(17,24,39)` !important on a near-white input.
  `text-white` / `hover:text-white` inside them either has no effect or makes an icon disappear on hover; check the computed colour.
- Show-password toggles are a component signal per field, reset on `hidden.bs.modal`. Keep that pattern
  for any new password field (changePasswordModal doesn't have one yet).
- Headless QA trap: bootstrap `hide()` then `show()` within ~1 s can leave two modals stacked, and real
  clicks then hit the upper modal. Wait ≥2 s between them, and assert `.modal.show` count == 1 before clicking.

- **Live app host: `https://skratchbastid.johnnyja.com`** (IIS 10, confirmed by Johnny 2026-11-01;
  `/version.json` there = the deployed tag). `skratchbastid.com` / `www.` is a separate
  Cloudflare-fronted **Nuxt** site — NOT this app; never use it to check a deploy.
- Deploy downgrade guard reads `https://skratchbastid.johnnyja.com/version.json` (fixed 2026-11-01;
  it used to curl skratchbastid.com without `-L`, got 301 HTML, and silently passed every deploy;
  its line-based `sed` also could not parse the multi-line JSON — now `grep -o`). Simulated against
  live 1.0.012: v1.0.013 OK, v1.0.012 refused (same), v1.0.011 refused (downgrade).
- Confirm a deploy landed by polling that `version.json` for the new tag, not by a green run.
- **Share is HIDDEN by Johnny's call (2026-11-01).** `AudioPlayerComponent.shareEnabled = false`
  gates both share buttons. The share URL still points at the dead `magmob.skratchbastid.com`
  host and there is no single-track deep-link route, so do not re-enable it until both are fixed.
  `AudioPlayerComponent` isn't rendered anywhere today (only `app-audio-player-bar` is), and the
  `#urlShareSocialMediaModal` it opens doesn't exist in this repo, so share was already unreachable
  on live v1.0.012. The flag keeps it hidden if the player gets reused.
  `check-image.pipe.ts:12` default avatar also uses the dead host (cosmetic, untouched).
- Committed client keys in `src/environments/` (Stripe `pk_live`, reCAPTCHA site key) are public by
  design. `prodId` (`prod_RvMADg6RCwpL34`) is hardcoded — a Stripe product change is a code change.
  No server-side secrets found in the repo (scanned 2026-11-01).

## People

- Commit history: Johnny Arguelles + Ali Abdul Wahid.
