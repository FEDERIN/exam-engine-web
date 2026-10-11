import { describe, expect, it } from "vitest";

import { selectExamQuestions } from "../selectExamQuestions";
import { makeSingleChoice } from "./helpers";
import type { Question } from "../../../../types/question";

function buildQuestions(): Question[] {
  const a1 = makeSingleChoice({ id: "a1", categoryId: "cat-a" });
  const a2 = makeSingleChoice({ id: "a2", categoryId: "cat-a" });
  const a3 = makeSingleChoice({ id: "a3", categoryId: "cat-a" });
  const b1 = makeSingleChoice({ id: "b1", categoryId: "cat-b" });
  const b2 = makeSingleChoice({ id: "b2", categoryId: "cat-b" });
  const b3 = makeSingleChoice({ id: "b3", categoryId: "cat-b" });

  return [a1, a2, a3, b1, b2, b3];
}

describe("selectExamQuestions", () => {
  it("honors the per-category allocations", () => {
    const selected = selectExamQuestions(
      buildQuestions(),
      [
        { categoryId: "cat-a", questionCount: 2 },
        { categoryId: "cat-b", questionCount: 1 },
      ],
      [],
    );

    expect(selected).toHaveLength(3);

    const ids = selected.map((question) => question.id);
    const fromA = ids.filter((id) => id.startsWith("a"));
    const fromB = ids.filter((id) => id.startsWith("b"));

    expect(fromA).toHaveLength(2);
    expect(fromB).toHaveLength(1);
  });

  it("prioritizes questions flagged for review", () => {
    const selected = selectExamQuestions(
      buildQuestions(),
      [{ categoryId: "cat-a", questionCount: 1 }],
      ["a3"],
    );

    expect(selected.map((question) => question.id)).toEqual([
      "a3",
    ]);
  });

  it("falls back to new questions when review questions are exhausted", () => {
    const selected = selectExamQuestions(
      buildQuestions(),
      [{ categoryId: "cat-a", questionCount: 2 }],
      ["a1"],
    );

    expect(selected).toHaveLength(2);
    expect(selected.map((question) => question.id)).toContain(
      "a1",
    );
  });
});
