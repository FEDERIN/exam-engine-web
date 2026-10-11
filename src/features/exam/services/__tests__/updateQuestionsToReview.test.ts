import { describe, expect, it } from "vitest";

import { updateQuestionsToReview } from "../updateQuestionsToReview";
import { makeResult, makeSingleChoice } from "./helpers";

describe("updateQuestionsToReview", () => {
  it("keeps unanswered untouched ids, drops fixed ones and adds new mistakes", () => {
    const fixed = makeSingleChoice({ id: "fixed" });
    const stillWrong = makeSingleChoice({ id: "still-wrong" });
    const newMistake = makeSingleChoice({ id: "new-mistake" });

    const result = makeResult([
      { question: fixed, selectedAnswer: 0, isCorrect: true },
      {
        question: stillWrong,
        selectedAnswer: 1,
        isCorrect: false,
      },
      {
        question: newMistake,
        selectedAnswer: 2,
        isCorrect: false,
      },
    ]);

    const updated = updateQuestionsToReview(
      ["fixed", "still-wrong", "not-in-exam"],
      result,
    );

    expect(updated).toEqual([
      "still-wrong",
      "not-in-exam",
      "new-mistake",
    ]);
  });

  it("does not add unanswered questions", () => {
    const unanswered = makeSingleChoice({ id: "unanswered" });

    const result = makeResult([
      {
        question: unanswered,
        selectedAnswer: null,
        isCorrect: false,
      },
    ]);

    expect(updateQuestionsToReview([], result)).toEqual([]);
  });
});
