# Run SkratchBastidWeb on your Mac

One command per block — paste each into Terminal in order. Needs git + Node 22.22+ (or 24.15+ / 26+) only — `@angular/cli` 22 enforces it. No Homebrew, no admin.
Repos live as siblings under `/Users/jarguelles/Documents`.

```bash
cd /Users/jarguelles/Documents && (git clone https://github.com/collabcoders/SkratchBastidWeb.git 2>/dev/null || git -C SkratchBastidWeb pull)
```

```bash
cd /Users/jarguelles/Documents/SkratchBastidWeb && npm install
```

(`npm install`, not `npm ci` — `package-lock.json` is gitignored in this repo.)

```bash
cd /Users/jarguelles/Documents/SkratchBastidWeb && npm start
```

What to look at: http://localhost:4200

## Heads up: the app needs the API

`src/environments/environment.ts` points `legendsApi` at `https://localhost:7039` — the local
**LegendsOnlyAPI**. With nothing listening there the page renders blank and the console fills with
`ERR_CONNECTION_REFUSED`. That is not a build failure. Either start the API:

```bash
cd /Users/jarguelles/Documents/LegendsOnlyAPI && dotnet run
```

or temporarily switch `environment.ts` to the commented `https://api.legendsonly.tv` line (do not commit that).

## Build (the harness gate)

```bash
cd /Users/jarguelles/Documents/SkratchBastidWeb && npm run build
```

There are no unit tests (0 `*.spec.ts`, Karma not installed) — the production build is the gate.

VS Code: open the folder, press F5 → "skratchbastid-web: ng serve + Chrome".
