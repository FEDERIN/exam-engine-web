import type { Question } from "../../../types/question";

export function parseQuestion(
  question: unknown,
): Question | null {
  if (
    typeof question !== "object" ||
    question === null
  ) {
    return null;
  }

  const candidate = question as Record<string, unknown>;

  if (
    typeof candidate.id !== "string" ||
    candidate.id.trim() === ""
  ) {
    return null;
  }

  if (
    typeof candidate.question !== "string" ||
    candidate.question.trim() === ""
  ) {
    return null;
  }

  if (
    !Array.isArray(candidate.options) ||
    candidate.options.length < 2 ||
    !candidate.options.every(
      (option) => typeof option === "string",
    )
  ) {
    return null;
  }

  if (
    typeof candidate.examId !== "string" ||
    candidate.examId.trim() === "" ||
    typeof candidate.categoryId !== "string" ||
    candidate.categoryId.trim() === ""
  ) {
    return null;
  }

  const options = candidate.options;

  const baseQuestion = {
    id: candidate.id,
    question: candidate.question,
    options,
    examId: candidate.examId,
    categoryId: candidate.categoryId,
    ...(typeof candidate.explanation === "string"
      ? { explanation: candidate.explanation }
      : {}),
    ...(typeof candidate.topic === "string"
      ? { topic: candidate.topic }
      : {}),
  };

  if (candidate.type === "multiple-choice") {
    if (
      !Array.isArray(candidate.correctAnswers) ||
      candidate.correctAnswers.length === 0 ||
      !candidate.correctAnswers.every(
        (answer) =>
          typeof answer === "number" &&
          Number.isInteger(answer) &&
          answer >= 0 &&
          answer < options.length,
      ) ||
      new Set(candidate.correctAnswers).size !==
        candidate.correctAnswers.length
    ) {
      return null;
    }

    return {
      ...baseQuestion,
      type: "multiple-choice",
      correctAnswers: candidate.correctAnswers,
    };
  }

  if (
    (candidate.type !== undefined &&
      candidate.type !== "single-choice") ||
    typeof candidate.correctAnswer !== "number" ||
    !Number.isInteger(candidate.correctAnswer) ||
    candidate.correctAnswer < 0 ||
    candidate.correctAnswer >= options.length
  ) {
    return null;
  }

  return {
    ...baseQuestion,
    type: "single-choice",
    correctAnswer: candidate.correctAnswer,
  };
}
