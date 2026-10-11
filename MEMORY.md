# Memory

Facts and current repo state NOT covered by AGENTS.md. Read this after AGENTS.md.

## Current state

- **exam-engine-web**, browser-only practice exam engine. No backend; history, active session, and questions-to-review all live in `localStorage`.
- `main` at `8043195` ("ci: expose DATA_REPO_TOKEN to the build step"). Branch `feat/agnostic-catalog-and-fixes` pushed with 3 commits; **PR not opened yet**. No open PRs.
- Baseline: `npm run lint` clean, **63 tests across 14 files**, index chunk 261.96 kB (81 kB gzip). Each question file is its own chunk; the main bundle must not absorb them.
- **`DATA_REPO_TOKEN` is set** on the GitHub repo (verified via `gh secret list`, Oct 2026), so CI can fetch `data/`. Re-verify with `gh secret list` before blaming CI.
- Data repo `FEDERIN/exam-engine-data` currently has **only `github-foundations` questions**. `react-fundamentals` has a definition and zero questions, so it lists as unavailable and cannot be started. Adding its JSON is the only remaining work there.

## Decisions and rationale

- **Exams are globbed `eager`, questions are lazy.** Exam definitions are ~800 bytes each and are needed for first paint; the question bank is ~400 kB and must stay split. Verified that adding a whole new exam does not move the index chunk at all.
- **Questions referencing an unknown `examId` fail the build.** Writing questions before the exam definition is a natural authoring order, and without the check those questions load into the bank unreachable with no visible symptom.
- **Exams are sorted by name** in `validateExamCatalog`. `import.meta.glob` ordering is filesystem-dependent, so without sorting the selection screen reorders between machines and between CI runs.
- **A bare JSON exam file gets no runtime type safety anymore**, since it is no longer behind a TypeScript import. `parseExamDefinition` exists to replace what the compiler used to guarantee.
- **Relabelled the progress header rather than only fixing the math.** The bar was labelled "Progress" but computed position; correcting the number without the label left two bare numbers with no units.
- **Deliberately not added:** Prettier (no config, repo has mixed quotes, reformatting would bury every diff), React Compiler, partial credit on multiple-choice (still all-or-nothing), component tests (no React Testing Library).
- **No integration test over `data/`.** CI runs `npm run test` before `npm run build`, so `data/` does not exist when tests execute; such a test would break the pipeline while passing locally.
- **`data/` is a Windows directory junction** to `C:\Portafolio\Private\exam-engine-data`, not a copy, so edits in the data repo are picked up with no sync step. Machine-local by nature: it does not exist on CI or on another clone.

## Gotchas

- **Git failures look worse than they are in PowerShell.** Warnings go to stderr, so `$LASTEXITCODE` is non-zero even when the command succeeded (a push that worked reports exit 1). Read the output text, not just the exit code.
- **Committing warns `LF will be replaced by CRLF`.** There is no `.gitattributes` and `core.autocrlf` is on. Expected on Windows; do not "fix" it by adding one without deciding on line endings deliberately.
- **Local git has TLS certificate verification disabled**, so every push prints a security warning. Unresolved: `git config --global http.sslVerify true` restores it and should be done.
- **A stale Vite process on port 5173 survives a failed start** and keeps serving the broken build, so a new `npm run dev` silently moves to 5174. Check `Get-NetTCPConnection -LocalPort 5173` before concluding the app is not starting.
- `main` is protected: branch, then `gh pr create`.

## External references

- **App** · https://github.com/FEDERIN/exam-engine-web
- **Data (private)** · https://github.com/FEDERIN/exam-engine-data
