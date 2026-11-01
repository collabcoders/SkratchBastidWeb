# Project Rules (Dev Team)

You are working as part of Johnny's dev team. PM = Hermes (Fable 5). These rules are binding.

## MANDATORY: Handoff rule
- EVERY commit must update `handoff.md` at the repo root.
- Before committing, append an entry to `handoff.md`:
  ```
  ## <YYYY-MM-DD HH:MM> — <agent/role>
  - What changed: ...
  - Current state: ...
  - Next steps: ...
  - Blockers: ...
  ```
- Stage `handoff.md` in the same commit. The pre-commit hook rejects commits that don't include it.

## Per-project context & memory
- `handoff.md` = task state (what changed, next steps). Updated EVERY commit.
- `MEMORY.md` = durable project knowledge (vision, architecture decisions, conventions, gotchas). Update it whenever you learn something durable about this project. Do NOT put project knowledge in global Hermes memory — it belongs here, git-tracked with the project.
- Read BOTH files before starting any work in this repo.

## MANDATORY: Plugin/skill suite (global, all projects)
- **Superpowers** (obra) — process skills. Brainstorm before building (`superpowers:brainstorming`), TDD for implementation (`superpowers:test-driven-development`), systematic debugging for bugs. If a superpowers skill applies, use it.
- **Code review** — before landing ANY batch/PR, run a review: `anthropic-code-review` skill (parallel multi-agent, high-signal) or gstack `review`. No unreviewed merges.
- **gstack** (Garry Tan) — workflow skills under the `gstack` category: `plan-ceo-review`/`plan-eng-review`/`autoplan` for planning, `review` for pre-landing review, `investigate` for debugging, `ship` for release, `qa`/`qa-only` for browser QA, `cso` for security audits. gstack runtime lives at `~/.hermes/skills/gstack`.

## Landing gate (TEAM.md rules 14-15, 2026-10-15)
- The harness is THE gate: every batch lands only on `harness verify` exit 0 against this repo's committed `.harness.json`. Harness green → push. Never `npx tsc`; never commit a `node_modules`/`.venv` symlink.
- Reviewer subagents (QA / UI-UX) only for feature landings. Bugfix/refactor/chore/docs: harness green → push, nothing else.
- Standard six in this repo: `AGENTS.md`, `handoff.md`, `MEMORY.md`, `RUN_LOCAL.md`, `.vscode/launch.json`, `.harness.json`. Keep `RUN_LOCAL.md` true after any change to how the project is run.

## Other rules
- Read `handoff.md` before starting any work in this repo.
- Never report success without real execution output (run the tests, run the code).
- Work only in your assigned branch/worktree unless told otherwise.
- Keep commits small and scoped; message format: `<type>: <summary>` (feat/fix/test/refactor/docs/chore).
