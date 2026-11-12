# Project Rules (Dev Team)

You are on Johnny's dev team; your PM is Johnny5 (Hermes). These rules are binding. Rule numbers refer to the org charter, `/opt/data/dev-team/TEAM.md`.

## Before any work
- Read BOTH `handoff.md` and `MEMORY.md` at the repo root.
- Work only in your assigned branch/worktree unless told otherwise. Merge conflict → report and stop; the PM resolves it (rule 14).

## MANDATORY: Handoff rule (rule 1)
- EVERY commit must update `handoff.md` (task state: what changed, next steps) at the repo root — append an entry and stage it in the same commit:
  ```
  ## <YYYY-MM-DD HH:MM> — <agent/role>
  - What changed: ...
  - Current state: ...
  - Next steps: ...
  - Blockers: ...
  ```
- The pre-commit hook rejects commits that don't include it. Never `--no-verify`.
- Repo file is `HANDOFF.md` (uppercase)? Keep that casing; its hook must match case-insensitively (`grep -qix "handoff.md"`).

## Project memory & docs
- `MEMORY.md` = durable project knowledge (vision, architecture decisions, conventions, gotchas). Update it whenever you learn something durable about this project. Project knowledge never goes in global Hermes memory — it belongs here, git-tracked with the project.
- `RUN_LOCAL.md` = how Johnny runs this on his Mac. Keep it true after any change to how the project is run.
- Standard six (rule 9): `AGENTS.md`, `handoff.md`, `MEMORY.md`, `RUN_LOCAL.md`, `.vscode/launch.json`, `.harness.json`. Mobile repos (Xcode/Gradle) may omit `launch.json`; RUN_LOCAL.md then says "open in Xcode/Android Studio".

## MANDATORY: Plugin/skill suite (rule 5 — global, all projects)
- **Superpowers** (obra) — process skills: brainstorm before building (`superpowers:brainstorming`), TDD for implementation (`superpowers:test-driven-development`), systematic debugging for bugs. If a superpowers skill applies, use it.
- **gstack** (Garry Tan) — workflow skills, `gstack` category, runtime `~/.hermes/skills/gstack`: `plan-ceo-review`/`plan-eng-review`/`autoplan` (planning), `review` (pre-landing review), `investigate` (debugging), `ship` (release), `qa`/`qa-only` (browser QA), `cso` (security audits).
- **Code review** — every batch/PR that changes code is reviewed before landing (`anthropic-code-review` skill or gstack `review`); no unreviewed merges. It is a diff read in the PM session, not a reviewer-subagent dispatch (rule 15).

## Landing gate (rules 14-15; Johnny, 2026-10-15)
- The harness is THE gate: every batch, single-file included, lands only on `harness verify` exit 0 against this repo's committed `.harness.json`. Harness green → push.
- Reviewer subagents (QA / UI-UX) only for feature landings. Bugfix/refactor/chore/docs: harness green → push, nothing else.
- Only exception: Johnny's ask says "no harness" → commit → push → build sanity → version bump → tag. Never infer it.
- Never `npx tsc`; never commit a `node_modules`/`.venv` symlink.

## Other rules
- Never report success without real execution output (run the tests, run the code).
- Keep commits small and scoped; message format: `<type>: <summary>` (feat/fix/test/refactor/docs/chore).
