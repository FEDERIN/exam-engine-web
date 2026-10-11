import type {
  ExamCategory,
  ExamDefinition,
} from "../types/category";

function parseCategory(value: unknown): ExamCategory | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== "string" ||
    candidate.id.trim() === "" ||
    typeof candidate.name !== "string" ||
    candidate.name.trim() === "" ||
    typeof candidate.weight !== "number" ||
    !Number.isFinite(candidate.weight) ||
    candidate.weight < 0
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    weight: candidate.weight,
  };
}

/**
 * Parses a raw exam definition coming from `data/exams/*.json`.
 *
 * Returns `null` instead of throwing so the caller can report every
 * invalid definition at once.
 */
export function parseExamDefinition(
  definition: unknown,
): ExamDefinition | null {
  if (
    typeof definition !== "object" ||
    definition === null ||
    Array.isArray(definition)
  ) {
    return null;
  }

  const candidate = definition as Record<string, unknown>;

  if (
    typeof candidate.id !== "string" ||
    candidate.id.trim() === "" ||
    typeof candidate.name !== "string" ||
    candidate.name.trim() === "" ||
    !Array.isArray(candidate.categories) ||
    candidate.categories.length === 0
  ) {
    return null;
  }

  const categories = candidate.categories.map(parseCategory);

  if (categories.some((category) => category === null)) {
    return null;
  }

  const validCategories = categories as ExamCategory[];

  const categoryIds = new Set(
    validCategories.map((category) => category.id),
  );

  if (categoryIds.size !== validCategories.length) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    categories: validCategories,
  };
}
