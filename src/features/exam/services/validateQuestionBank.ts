import type { Question } from "../../../types/question";
import { parseQuestion } from "./validateQuestion";

export function validateQuestionBank(
  questions: unknown,
): Question[] {
  if (!Array.isArray(questions)) {
    throw new Error("Invalid question bank.");
  }

  if (questions.length === 0) {
    throw new Error(
      "Question bank must contain at least one question.",
    );
  }

  const parsedQuestions = questions.map(parseQuestion);
  const validQuestions = parsedQuestions.filter(
    (question): question is Question => question !== null,
  );

  if (validQuestions.length !== questions.length) {
    throw new Error(
      "Question bank contains invalid questions.",
    );
  }

  const questionIds = new Set(
    validQuestions.map((question) => question.id),
  );

  if (questionIds.size !== questions.length) {
    throw new Error(
      "Question bank contains duplicate question IDs.",
    );
  }

  return validQuestions;
}
