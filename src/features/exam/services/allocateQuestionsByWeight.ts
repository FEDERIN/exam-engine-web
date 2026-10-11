import type {
  CategoryAllocation,
  CategoryWeight,
} from "../types/category";

interface AllocationCandidate {
  categoryId: string;
  exactCount: number;
  questionCount: number;
  availableQuestions: number;
}

export function allocateQuestionsByWeight(
  totalQuestions: number,
  categoryWeights: CategoryWeight[],
): CategoryAllocation[] {
  if (
    !Number.isInteger(totalQuestions) ||
    totalQuestions < 1
  ) {
    throw new Error(
      "Total questions must be a positive integer.",
    );
  }

  if (categoryWeights.length === 0) {
    throw new Error("At least one category is required.");
  }

  const categoryIds = new Set<string>();

  for (const category of categoryWeights) {
    if (
      category.categoryId.trim() === "" ||
      !Number.isFinite(category.weight) ||
      category.weight < 0 ||
      !Number.isSafeInteger(category.availableQuestions) ||
      category.availableQuestions < 0 ||
      categoryIds.has(category.categoryId)
    ) {
      throw new Error("Invalid category weights.");
    }

    categoryIds.add(category.categoryId);
  }

  const totalWeight = categoryWeights.reduce(
    (sum, category) => sum + category.weight,
    0,
  );

  if (totalWeight <= 0) {
    throw new Error("Category weights must add up to a positive value.");
  }

  const totalAvailableQuestions =
    categoryWeights.reduce(
      (sum, category) =>
        sum + category.availableQuestions,
      0,
    );

  if (totalQuestions > totalAvailableQuestions) {
    throw new Error(
      "Total questions cannot exceed the available questions.",
    );
  }

  const allocations: AllocationCandidate[] =
    categoryWeights.map((category) => {
      const exactCount =
        (totalQuestions * category.weight) / totalWeight;

      return {
        categoryId: category.categoryId,
        exactCount,
        questionCount: Math.min(
          Math.floor(exactCount),
          category.availableQuestions,
        ),
        availableQuestions:
          category.availableQuestions,
      };
    });

  let remainingQuestions =
    totalQuestions -
    allocations.reduce(
      (sum, allocation) =>
        sum + allocation.questionCount,
      0,
    );

  while (remainingQuestions > 0) {
    const candidates = allocations
      .filter(
        (allocation) =>
          allocation.questionCount <
          allocation.availableQuestions,
      );

    for (let index = candidates.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [candidates[index], candidates[randomIndex]] = [
        candidates[randomIndex],
        candidates[index],
      ];
    }

    candidates.sort((a, b) => {
      const remainderA =
        a.exactCount -
        Math.floor(a.exactCount);

      const remainderB =
        b.exactCount -
        Math.floor(b.exactCount);

      return remainderB - remainderA;
    });

    if (candidates.length === 0) {
      break;
    }

    candidates[0].questionCount++;
    remainingQuestions--;
  }

  return allocations.map(
    ({ categoryId, questionCount }) => ({
      categoryId,
      questionCount,
    }),
  );
}
