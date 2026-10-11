import type { ExamDefinition } from "../types/category";
import { parseExamDefinition } from "./validateExamDefinition";

/**
 * Validates every exam definition discovered under `data/exams/`.
 *
 * Definitions are discovered at build time, so a malformed file must
 * fail loudly instead of silently dropping an exam from the catalog.
 * The result is sorted by name to keep the selection screen stable
 * regardless of filesystem ordering.
 */
export function validateExamCatalog(
  definitions: unknown,
): ExamDefinition[] {
  if (!Array.isArray(definitions)) {
    throw new Error("Invalid exam catalog.");
  }

  if (definitions.length === 0) {
    throw new Error(
      "Exam catalog must contain at least one exam.",
    );
  }

  const parsedDefinitions = definitions.map(parseExamDefinition);
  const validDefinitions = parsedDefinitions.filter(
    (definition): definition is ExamDefinition =>
      definition !== null,
  );

  if (validDefinitions.length !== definitions.length) {
    throw new Error(
      "Exam catalog contains an invalid exam definition.",
    );
  }

  const examIds = new Set(
    validDefinitions.map((exam) => exam.id),
  );

  if (examIds.size !== validDefinitions.length) {
    throw new Error(
      "Exam catalog contains duplicate exam IDs.",
    );
  }

  return [...validDefinitions].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
