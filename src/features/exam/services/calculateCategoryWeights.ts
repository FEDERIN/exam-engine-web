import type { CategoryWeight } from "../types/category";

export function calculateCategoryWeights(
  categories: CategoryWeight[],
  selectedCategories: string[],
): CategoryWeight[] {
  const selected =
    selectedCategories.length === 0
      ? categories
      : categories.filter((item) =>
          selectedCategories.includes(item.categoryId),
        );

  const availableCategories = selected.filter(
    (item) => item.availableQuestions > 0,
  );

  if (availableCategories.length === 0) {
    return [];
  }

  const totalWeight = availableCategories.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  if (totalWeight <= 0) {
    return [];
  }

  return availableCategories.map((item) => ({
    ...item,
    weight: (item.weight / totalWeight) * 100,
  }));
}