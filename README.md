# Exam Engine

A practice exam engine that runs **entirely in the browser**. It loads question
banks from JSON, builds category-weighted exams, evaluates them, and stores your
history and the questions to review in `localStorage`.

It currently ships with the **GitHub Foundations** bank (250 questions).

## Features

- Exam and category selection, with a count of available questions.
- Question distribution by **category weight** (`allocateQuestionsByWeight`).
- Prioritizes questions you previously got wrong.
- Answer options are **shuffled** on every attempt.
- Single-choice and multiple-choice questions.
- **Review** of answers with explanations after finishing.
- **Persistence**: resume an in-progress exam, keep a result history, and track
  questions to review.
- Confirmation before finishing (tells you how many questions are unanswered).
- Responsive dark UI built with Tailwind CSS.

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (`strict` mode)
- [Vite 8](https://vite.dev) (with [rolldown](https://rolldown.rs))
- [Tailwind CSS v4](https://tailwindcss.com)
- [React Router 7](https://reactrouter.com)
- [Vitest](https://vitest.dev) + jsdom for tests
- [Oxlint](https://oxc.rs) for linting

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run preview` | Serves the production build |
| `npm run lint` | Runs Oxlint |
| `npm run test` | Runs the tests with Vitest |
| `npm run test:watch` | Tests in watch mode |

## Project structure

```
data/
  exams/            # exam definitions (id, name, categories and weights)
  questions/        # questions grouped by exam and category
src/
  components/       # app-level components (ErrorBoundary)
  features/exam/
    catalog/        # lazy question-bank loading + React context
    components/     # exam UI
    hooks/          # useExam (in-progress exam state)
    pages/          # screens (selection, runner, history)
    services/       # pure logic: allocation, evaluation, storage, validation
    types/          # domain types
    utils/
  types/            # shared types (Question)
```

The question bank is loaded **lazily** (`loadExamCatalog`), so each JSON file
becomes its own chunk and does not block the initial bundle.

## Data format

**Exam definition** (`data/exams/<id>.json`):

```json
{
  "id": "github-foundations",
  "name": "GitHub Foundations",
  "categories": [
    { "id": "collaboration-features", "name": "Collaboration Features", "weight": 12.5 }
  ]
}
```

**Question** (`data/questions/<exam-id>/*.json`, one array per file):

```json
{
  "id": "uuid",
  "question": "Question text",
  "options": ["first option", "second option", "third option"],
  "correctAnswer": 0,
  "explanation": "Why this option is the correct one.",
  "examId": "github-foundations",
  "categoryId": "collaboration-features",
  "topic": "Optional topic"
}
```

Multiple-choice questions use `"type": "multiple-choice"` and
`"correctAnswers": [1, 2]` instead of `correctAnswer`. The bank is validated on
load: if the data is invalid, the app shows an error message instead of a blank
screen.

### Adding an exam

1. Create `data/exams/<id>.json`.
2. Create `data/questions/<id>/*.json` with the questions.
3. Register it in the `exams` array of
   `src/features/exam/catalog/loadExamCatalog.ts`.

## Persistence

Everything is stored in the browser (there is no backend):

| Key | Contents |
| --- | --- |
| `exam-engine:active-session:v1` | In-progress exam (for resuming) |
| `exam-engine:exam-history:v1` | Result history (max 50) |
| `exam-engine:questions-to-review:v2` | Questions to review, per exam |

## Deploy

The project includes `vercel.json` with the SPA rewrite needed for the router to
work when reloading routes such as `/exam/...` or `/history/...`.

```bash
npm run build   # outputs dist/
```

The resulting `dist/` can be served from any static host with an
`index.html` fallback.

## Tests

The pure services (weight allocation, evaluation, selection, storage and
validation) are covered with Vitest:

```bash
npm run test
```

## License

[MIT](./LICENSE)
