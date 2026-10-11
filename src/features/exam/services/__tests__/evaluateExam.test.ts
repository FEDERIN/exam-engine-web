import { describe, expect, it } from "vitest";

import { evaluateExam } from "../evaluateExam";
import type { ExamSession } from "../../types/exam";
import {
  makeMultipleChoice,
  makeSingleChoice,
} from "./helpers";

function createSession(): ExamSession {
  const q1 = makeSingleChoice({
    id: "q1",
    correctAnswer: 2,
  });
  const q2 = makeSingleChoice({
    id: "q2",
    correctAnswer: 0,
  });
  const q3 = makeMultipleChoice({
    id: "q3",
    correctAnswers: [1, 3],
  });
  const q4 = makeMultipleChoice({
    id: "q4",
    correctAnswers: [0],
  });

  return {
    questions: [q1, q2, q3, q4],
    currentQuestionIndex: 0,
    answers: [
      { questionId: "q1", selectedAnswer: 2 },
      { questionId: "q2", selectedAnswer: 1 },
      { questionId: "q4", selectedAnswer: [0, 2] },
    ],
  };
}

describe("evaluateExam", () => {
  it("counts correct, incorrect and unanswered questions", () => {
    const result = evaluateExam(createSession());

    expect(result.totalQuestions).toBe(4);
    expect(result.answeredQuestions).toBe(3);
    expect(result.unansweredQuestions).toBe(1);
    expect(result.correctAnswers).toBe(1);
    expect(result.incorrectAnswers).toBe(2);
  });

  it("computes the score over the total number of questions", () => {
    const result = evaluateExam(createSession());

    expect(result.score).toBe(25);
  });

  it("treats multiple-choice answers as correct regardless of order", () => {
    const question = makeMultipleChoice({
      id: "multi",
      correctAnswers: [1, 3],
    });

    const result = evaluateExam({
      questions: [question],
      currentQuestionIndex: 0,
      answers: [
        { questionId: "multi", selectedAnswer: [3, 1] },
      ],
    });

    expect(result.correctAnswers).toBe(1);
  });

  it("marks partially selected multiple-choice answers as incorrect", () => {
    const question = makeMultipleChoice({
      id: "multi",
      correctAnswers: [1, 3],
    });

    const result = evaluateExam({
      questions: [question],
      currentQuestionIndex: 0,
      answers: [
        { questionId: "multi", selectedAnswer: [1] },
      ],
    });

    expect(result.correctAnswers).toBe(0);
    expect(result.incorrectAnswers).toBe(1);
  });

  it("treats an empty multiple-choice selection as unanswered", () => {
    const question = makeMultipleChoice({
      id: "multi",
      correctAnswers: [1, 3],
    });

    const result = evaluateExam({
      questions: [question],
      currentQuestionIndex: 0,
      answers: [
        { questionId: "multi", selectedAnswer: [] },
      ],
    });

    expect(result.unansweredQuestions).toBe(1);
    expect(result.answeredQuestions).toBe(0);
  });
});
