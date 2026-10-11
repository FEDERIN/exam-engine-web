import { describe, expect, it } from "vitest";

import { shuffleQuestionOptions } from "../shuffleQuestionOptions";
import {
  makeMultipleChoice,
  makeSingleChoice,
} from "./helpers";

describe("shuffleQuestionOptions", () => {
  it("keeps the correct option for single-choice questions", () => {
    const question = makeSingleChoice({
      options: ["uno", "dos", "tres", "cuatro"],
      correctAnswer: 2,
    });

    for (let i = 0; i < 20; i++) {
      const shuffled = shuffleQuestionOptions(question);

      if (shuffled.type !== "single-choice") {
        throw new Error("Expected a single-choice question");
      }

      expect(
        shuffled.options[shuffled.correctAnswer],
      ).toBe("tres");
      expect([...shuffled.options].sort()).toEqual(
        [...question.options].sort(),
      );
    }
  });

  it("keeps the correct options for multiple-choice questions", () => {
    const question = makeMultipleChoice({
      options: ["uno", "dos", "tres", "cuatro"],
      correctAnswers: [0, 2],
    });

    for (let i = 0; i < 20; i++) {
      const shuffled = shuffleQuestionOptions(question);

      if (shuffled.type !== "multiple-choice") {
        throw new Error("Expected a multiple-choice question");
      }

      const correctTexts = shuffled.correctAnswers
        .map((index) => shuffled.options[index])
        .sort();

      expect(correctTexts).toEqual(["tres", "uno"]);
    }
  });
});
