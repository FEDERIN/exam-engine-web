import { describe, expect, it } from "vitest";

import { allocateQuestionsByWeight } from "../allocateQuestionsByWeight";
import type { CategoryWeight } from "../../types/category";

function weight(
  categoryId: string,
  value: number,
  availableQuestions: number,
): CategoryWeight {
  return { categoryId, weight: value, availableQuestions };
}

describe("allocateQuestionsByWeight", () => {
  it("rejects a non positive total", () => {
    expect(() =>
      allocateQuestionsByWeight(0, [weight("a", 1, 10)]),
    ).toThrow();
  });

  it("rejects an empty category list", () => {
    expect(() => allocateQuestionsByWeight(5, [])).toThrow();
  });

  it("rejects totals above the available questions", () => {
    expect(() =>
      allocateQuestionsByWeight(5, [weight("a", 1, 2)]),
    ).toThrow();
  });

  it("rejects weights that add up to zero", () => {
    expect(() =>
      allocateQuestionsByWeight(3, [
        weight("a", 0, 5),
        weight("b", 0, 5),
      ]),
    ).toThrow();
  });

  it("splits evenly for equal weights", () => {
    const allocations = allocateQuestionsByWeight(10, [
      weight("a", 1, 10),
      weight("b", 1, 10),
    ]);

    expect(allocations).toEqual([
      { categoryId: "a", questionCount: 5 },
      { categoryId: "b", questionCount: 5 },
    ]);
  });

  it("respects category caps and redistributes the remainder", () => {
    const allocations = allocateQuestionsByWeight(10, [
      weight("a", 3, 2),
      weight("b", 1, 100),
    ]);

    expect(allocations).toEqual([
      { categoryId: "a", questionCount: 2 },
      { categoryId: "b", questionCount: 8 },
    ]);
  });

  it("always returns exactly the requested total", () => {
    const allocations = allocateQuestionsByWeight(7, [
      weight("a", 1, 3),
      weight("b", 1, 3),
      weight("c", 1, 3),
    ]);

    const total = allocations.reduce(
      (sum, allocation) => sum + allocation.questionCount,
      0,
    );

    expect(total).toBe(7);

    for (const allocation of allocations) {
      expect(allocation.questionCount).toBeGreaterThanOrEqual(0);
      expect(allocation.questionCount).toBeLessThanOrEqual(3);
    }
  });
});
