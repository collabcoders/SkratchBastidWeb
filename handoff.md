# Handoff — SkratchBastidWeb

_Last updated: 2026-07-30. Written during a laptop transfer, so this is a state-of-the-repo
snapshot rather than one session's notes._

Skratch Bastid's membership/tour site — Angular SPA, CLI project name `skratchbastid`.

## State

Branch `main`, **clean and fully pushed** to `github.com/collabcoders/SkratchBastidWeb`.
`HEAD` is `78e4a9a`, which **is** tag `v1.0.012` — so what's on `main` is what's live.

Two local branches are still lying around and are **fully merged into `main` (0 commits ahead)**:
`upgrade/angular-22` and `upgrade/bootbox-6`. Neither has an upstream. They're safe to delete;
they only exist on the old laptop and nothing is lost by not carrying them over.

## Verification (proven green 2026-07-30)

```bash
npx ng build --configuration production
```

Bundle generated, exit 0. Three benign warnings — `Unable to locate stylesheet:
/assets/fonts/{CircularStdBook,DrukWideBold,VolkolakGrotesqueBold}.css`. These are pre-existing
and not caused by recent work; the fonts load by other means. `npm test` (Karma) was **not** run.

## Setup on the new machine

- Node 22+ (CI pins `22.22`); built here on Node 26.3.1 without trouble.
- **`package-lock.json` is gitignored in this repo.** Use `npm install`, not `npm ci` — the
  deploy workflow does the same (`npm install --no-audit --no-fund`) for exactly this reason.
  It also means dependency resolution is not reproducible; a fresh install may pull newer
  patch versions than the old laptop had.
- Angular 22 / TypeScript 6 / Tailwind 4.

## Backend

`environment.legendsApi` → `https://api.legendsonly.tv` (prod) or `https://localhost:7039` (dev).
That API is the **shared multi-tenant LegendsOnly backend** at `~/Documents/LegendsOnlyAPI`, also
serving DJJazzyJeffWeb and LegendsOnlyWeb. Treat API/DTO changes as cross-cutting.

## Deploy

Tag-triggered FTPS mirror to the production IIS box (skratchbastid.com):

```bash
git tag v1.0.013 && git push origin v1.0.013
```

Or Actions → *Deploy to Production (IIS / FTPS)* → Run workflow. The workflow guards against a
version downgrade, writes a stamped `version.json`, uploads hashed bundles first and
`index.html`/`version.json` last so nobody gets a half-swapped app.

Repo secrets required (per-repository, already set on this repo): `FTP_HOST`, `FTP_USERNAME`,
`FTP_PASSWORD`, `FTP_REMOTE_DIR`. Full notes in `.github/workflows/README.md`.

## Recent work (through v1.0.012)

| Commit | Change |
|---|---|
| `78e4a9a` | BastidBBQ events grey out automatically from their ISO date instead of a manual flag |
| `cce9a10` `899b0bf` | Video player: autoplay on open, modal audio chooser, over-modal bar, no A/V overlap, download overlay |
| `7c11355` | Audio downloads go through `/api/download` (rename + log + play count) |
| `47c5851` | Profile: Update Payment modal + `[Update Card]` link in header |

## Open items

- The two merged `upgrade/*` branches should be deleted rather than migrated.
- `environment.ts` (dev) points `legendsApi` at `https://localhost:7039` — you need LegendsOnlyAPI
  running locally for dev, or uncomment the prod URL line.
- Stripe publishable key and the reCAPTCHA **site** key are committed in `src/environments/`.
  Both are client-side-public by design, so this is fine — but note `prodId`
  (`prod_RvMADg6RCwpL34`) is also hardcoded there, so a Stripe product change means a code change.

---

## Claude Code project config (added 2026-07-30)

`.claude/settings.json` is now **committed**. It pre-approves this project's ordinary
build/test commands so a fresh session doesn't prompt for each one:

- `Bash(npm install)`
- `Bash(npx ng build *)`
- `Bash(npx ng serve *)`
- `Bash(npx ng test *)`
- `Bash(git fetch *)`
- `Bash(curl -fsS --max-time 15 https://skratchbastid.com/version.json)`

`.claude/settings.local.json` is deliberately **not** committed — it is the per-machine
override layer. Its entries here were either machine-specific (absolute paths, scratchpad
one-offs, `Read(//Users/jarguelles/**)`) or outward-facing (`git push`, `git tag`, `gh run`).
The outward-facing ones are left out on purpose: a clone should not start life with irreversible
actions pre-approved for whoever runs it.

The `.gitignore` stanza enforcing this is in the repo, so it survives a machine change.
Previously the only thing keeping `settings.local.json` out was `~/.config/git/ignore`, which
is a user dotfile and does not travel.

