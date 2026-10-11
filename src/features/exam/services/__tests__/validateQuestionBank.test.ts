import { describe, expect, it } from "vitest";

import { validateQuestionBank } from "../validateQuestionBank";

function rawSingleChoice(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: "q1",
    question: "¿Pregunta?",
    options: ["a", "b", "c"],
    correctAnswer: 1,
    examId: "exam",
    categoryId: "cat",
    ...overrides,
  };
}

describe("validateQuestionBank", () => {
  it("accepts a single-choice question with an explicit type", () => {
    const bank = validateQuestionBank([
      rawSingleChoice({ type: "single-choice" }),
    ]);

    expect(bank).toHaveLength(1);
    expect(bank[0].type).toBe("single-choice");
  });

  it("accepts a single-choice question without a type", () => {
    const bank = validateQuestionBank([rawSingleChoice()]);

    expect(bank[0].type).toBe("single-choice");
  });

  it("accepts a multiple-choice question", () => {
    const bank = validateQuestionBank([
      {
        ...rawSingleChoice(),
        type: "multiple-choice",
        correctAnswers: [0, 2],
      },
    ]);

    expect(bank[0].type).toBe("multiple-choice");
  });

  it("rejects duplicate ids", () => {
    expect(() =>
      validateQuestionBank([
        rawSingleChoice({ id: "dup" }),
        rawSingleChoice({ id: "dup" }),
      ]),
    ).toThrow();
  });

  it("rejects out of range answers", () => {
    expect(() =>
      validateQuestionBank([
        rawSingleChoice({ correctAnswer: 5 }),
      ]),
    ).toThrow();
  });

  it("rejects multiple-choice questions with duplicated answers", () => {
    expect(() =>
      validateQuestionBank([
        {
          ...rawSingleChoice(),
          type: "multiple-choice",
          correctAnswers: [1, 1],
        },
      ]),
    ).toThrow();
  });

  it("rejects an empty bank", () => {
    expect(() => validateQuestionBank([])).toThrow();
  });

  it("rejects non array input", () => {
    expect(() => validateQuestionBank({})).toThrow();
  });
});
