import { describe, expect, it } from "vitest";

import { calculateCategoryWeights } from "../calculateCategoryWeights";
import type { CategoryWeight } from "../../types/category";

const weights: CategoryWeight[] = [
  { categoryId: "a", weight: 1, availableQuestions: 5 },
  { categoryId: "b", weight: 3, availableQuestions: 5 },
];

describe("calculateCategoryWeights", () => {
  it("normalizes weights to percentages", () => {
    const result = calculateCategoryWeights(weights, []);

    expect(result).toEqual([
      { categoryId: "a", weight: 25, availableQuestions: 5 },
      { categoryId: "b", weight: 75, availableQuestions: 5 },
    ]);
  });

  it("keeps only the selected categories", () => {
    const result = calculateCategoryWeights(weights, ["a"]);

    expect(result).toEqual([
      { categoryId: "a", weight: 100, availableQuestions: 5 },
    ]);
  });

  it("drops categories without available questions", () => {
    const result = calculateCategoryWeights(
      [
        { categoryId: "a", weight: 1, availableQuestions: 0 },
        { categoryId: "b", weight: 1, availableQuestions: 5 },
      ],
      [],
    );

    expect(result).toEqual([
      { categoryId: "b", weight: 100, availableQuestions: 5 },
    ]);
  });

  it("returns an empty list when there is nothing usable", () => {
    expect(
      calculateCategoryWeights(
        [
          { categoryId: "a", weight: 1, availableQuestions: 0 },
        ],
        [],
      ),
    ).toEqual([]);
  });

  it("returns an empty list when every weight is zero", () => {
    expect(
      calculateCategoryWeights(
        [{ categoryId: "a", weight: 0, availableQuestions: 5 }],
        [],
      ),
    ).toEqual([]);
  });
});
