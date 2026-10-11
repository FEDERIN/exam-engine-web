import type { Question } from "../../../types/question";
import type { ExamSession } from "../types/exam";
import { shuffleQuestionOptions } from "./shuffleQuestionOptions";

export function createExamSession(
  questions: Question[],
): ExamSession {
  if (questions.length === 0) {
    throw new Error(
      "Cannot create an exam session without questions.",
    );
  }

  const preparedQuestions = questions.map(
    shuffleQuestionOptions,
  );

  return {
    questions: preparedQuestions,
    currentQuestionIndex: 0,
    answers: [],
  };
}