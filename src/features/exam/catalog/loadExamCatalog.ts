import type { ExamDefinition } from "../types/category";
import type { Question } from "../../../types/question";
import { validateQuestionBank } from "../services/validateQuestionBank";
import { validateExamCatalog } from "../services/validateExamCatalog";
import type { ExamCatalog } from "./examCatalogContext";

/**
 * Fails when questions reference an exam that has no definition in
 * `data/exams/`. Without this, those questions would be loaded into the
 * bank but never reachable, which is easy to miss when adding an exam.
 */
function assertQuestionsBelongToKnownExams(
  questions: Question[],
  exams: ExamDefinition[],
): void {
  const knownExamIds = new Set(exams.map((exam) => exam.id));

  const unknownExamIds = [
    ...new Set(
      questions
        .filter(
          (question) => !knownExamIds.has(question.examId),
        )
        .map((question) => question.examId),
    ),
  ];

  if (unknownExamIds.length > 0) {
    throw new Error(
      `Question bank references unknown exams: ${unknownExamIds.join(", ")}. ` +
        `Add a definition in data/exams/<id>.json or fix the "examId" field.`,
    );
  }
}

/**
 * Loads the question bank on demand so the JSON payload is split
 * into its own chunk instead of blocking the initial bundle.
 *
 * Both exams and questions are discovered from the file system, so
 * dropping a new `data/exams/<id>.json` into the data repository is
 * enough to publish an exam: no code change or redeploy-time
 * registration step is required.
 *
 * Throws when the catalog or the question bank is invalid so the
 * caller (and the ErrorBoundary) can surface the problem.
 */
export async function loadExamCatalog(): Promise<ExamCatalog> {
  const examFiles = import.meta.glob(
    "../../../../data/exams/*.json",
    {
      eager: true,
      import: "default",
    },
  );

  const questionFiles = import.meta.glob(
    "../../../../data/questions/**/*.json",
    {
      import: "default",
    },
  );

  const exams = validateExamCatalog(
    Object.values(examFiles),
  );

  const questionModules = await Promise.all(
    Object.values(questionFiles).map((load) => load()),
  );

  const questions = questionModules.flat() as Question[];

  const questionBank = validateQuestionBank(questions);

  assertQuestionsBelongToKnownExams(questionBank, exams);

  const questionCountByExam = new Map<string, number>();
  const filledCategoryKeys = new Set<string>();

  for (const question of questionBank) {
    questionCountByExam.set(
      question.examId,
      (questionCountByExam.get(question.examId) ?? 0) + 1,
    );

    filledCategoryKeys.add(
      `${question.examId}::${question.categoryId}`,
    );
  }

  const availableQuestionCounts = Object.fromEntries(
    exams.map((exam) => [
      exam.id,
      questionCountByExam.get(exam.id) ?? 0,
    ]),
  );

  const availableCategoryCounts = Object.fromEntries(
    exams.map((exam) => [
      exam.id,
      exam.categories.filter((category) =>
        filledCategoryKeys.has(
          `${exam.id}::${category.id}`,
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
