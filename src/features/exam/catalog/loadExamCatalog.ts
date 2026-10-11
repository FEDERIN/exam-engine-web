import githubFoundations from "../../../../data/exams/github-foundations.json";
import reactFundamentals from "../../../../data/exams/react-fundamentals.json";

import type { ExamDefinition } from "../types/category";
import type { Question } from "../../../types/question";
import { validateQuestionBank } from "../services/validateQuestionBank";
import type { ExamCatalog } from "./examCatalogContext";

const exams: ExamDefinition[] = [
  githubFoundations,
  reactFundamentals,
];

/**
 * Loads the question bank on demand so the JSON payload is split
 * into its own chunk instead of blocking the initial bundle.
 *
 * Throws when the question bank is invalid so the caller (and the
 * ErrorBoundary) can surface the problem.
 */
export async function loadExamCatalog(): Promise<ExamCatalog> {
  const questionFiles = import.meta.glob(
    "../../../../data/questions/**/*.json",
    {
      import: "default",
    },
  );

  const questionModules = await Promise.all(
    Object.values(questionFiles).map((load) => load()),
  );

  const questions = questionModules.flat() as Question[];

  const questionBank = validateQuestionBank(questions);

  const availableQuestionCounts = Object.fromEntries(
    exams.map((exam) => [
      exam.id,
      questionBank.filter(
        (question) => question.examId === exam.id,
      ).length,
    ]),
  );

  const availableCategoryCounts = Object.fromEntries(
    exams.map((exam) => [
      exam.id,
      exam.categories.filter((category) =>
        questionBank.some(
          (question) =>
            question.examId === exam.id &&
            question.categoryId === category.id,
        ),
      ).length,
    ]),
  );

  return {
    exams,
    questionBank,
    availableQuestionCounts,
    availableCategoryCounts,
  };
}
