# AGENTS.md

Project instructions for OpenCode. Human-facing docs live in `README.md`;
this file covers what an agent needs to work in this repo without guessing.

## Memory

- At the start, read `MEMORY.md` for current state and past decisions.
- When a task finishes, update it: current state, decisions with rationale, mistakes to avoid.
- Keep it short (max ~50 lines); drop what no longer adds value.
- If something becomes a permanent rule, move it to `AGENTS.md` instead.
- Never store sensitive data (keys, tokens, personal data).

## What this is

A browser-only practice exam engine. React 19 + TypeScript (strict) + Vite 8,
Tailwind v4, React Router 7. There is no backend. Exams are built from a JSON
question bank, evaluated in the browser, and persisted to `localStorage`.

## Commands

Requires Node.js 20+.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | Oxlint |
| `npm run build` | `tsc -b` then `vite build` (runs `prebuild` first) |

`prebuild` runs `scripts/fetch-data.mjs`. It skips the download when `data/`
already has content, so local builds work without a token as long as the bank is
present on disk.

Verify changes with all three before reporting done:

```bash
npm run lint && npm run test && npm run build
```

## The data directory is not in Git

`data/` is git-ignored and comes from the private
`FEDERIN/exam-engine-data` repository. CI and Vercel fetch it with
`DATA_REPO_TOKEN`. Locally it is usually a junction to a sibling clone.

**If `data/` is missing, the build fails at the import stage.** That is the
usual cause of "the project won't start". Check it before debugging anything
else.

## Never hardcode exams or questions

Both are discovered at build time through `import.meta.glob` in
`src/features/exam/catalog/loadExamCatalog.ts`:

- Exams: `data/exams/*.json` (`eager`, small files)
- Questions: `data/questions/**/*.json` (lazy, one chunk per file)

Adding a file to the data repository is the only step needed to publish an
exam. Do not add an exam to an array, a switch, or a registry — that pattern
was removed deliberately.

The catalog is validated on load and a bad file fails the build with a
readable error instead of silently dropping an exam:

- Invalid exam definition (missing `id`/`name`/`categories`, duplicate
  category id, non-numeric or negative `weight`)
- Duplicate exam ids
- Questions whose `examId` has no matching definition

An exam with a definition but no questions is valid: it lists as unavailable
and cannot be started. `react-fundamentals` is currently in that state.

## Where code goes

```
src/features/exam/
  catalog/      # data loading + React context
  components/   # presentational
  hooks/        # useExam: in-progress session state
  pages/        # routed screens
  services/     # pure logic, no React
  types/
  utils/
```

Keep logic in `services/` as pure functions so it can be unit tested without
rendering. Components stay thin. `ExamView` computes derived values inline
where they are used; do not add a context or a store for a single screen.

## Tests

Vitest with jsdom. `vitest.config.ts` is deliberately separate from
`vite.config.ts` because Vite 8 and Vitest 3's bundled Vite conflict on types.

- Tests live in `__tests__/` next to the code, named `*.test.ts`.
- Import the runner explicitly: `import { describe, expect, it } from "vitest";`.
  There are no globals, so a missing import fails `tsc -b`, not just the run.
- Only pure logic is tested; there is no component testing setup. Do not add
  React Testing Library for a new test without asking.

Do not add a test that reads `data/`. CI runs tests *before* build, so `data/`
does not exist yet when they execute.

## Git

- **Commit messages, branch names, and pull request titles and bodies are
  written in English.** Always, including for work discussed in Spanish.
- Keep commits scoped to one logical change; do not bundle unrelated edits.
- The default branch is `main` and `master` does not exist here.

## Conventions

- TypeScript strict, with `noUnusedLocals` and `erasableSyntaxOnly`.
- No Prettier. Formatting is by hand; do not reformat untouched code.
- Oxlint is the linter.
- Each page renders its own `<main>`. `ExamRunner` dispatches to `ExamSetup`
  or `ExamView` and renders none itself, so they are not nested. Keep it that
  way.
- UI copy is English, matching `lang="en"` in `index.html`.
- Storage keys are versioned (`...:v1`, `...:v2`). Changing a stored shape
  means a new key, not a silent migration. Each `localStorage` read validates
  the parsed shape and falls back to a safe default rather than throwing.

## Gotchas

- `session.answers` holds one entry per question the user touched, not per
  question. A multiple-choice question deselected to empty stays in the array
  with `selectedAnswer: []`, which `isAnswered` treats as unanswered. Count
  with `isAnswered`, never with `answers.length`.
- The progress bar measures answered questions, not navigation position.
- `evaluateExam` scores multiple-choice all-or-nothing. There is no partial
  credit.
