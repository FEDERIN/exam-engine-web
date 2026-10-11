import type { ExamResult } from "../types/exam";
import { isAnswered } from "./isAnswered";

export function getQuestionsToReview(
  result: ExamResult,
): string[] {
  return result.questions
    .filter(
      (questionResult) =>
        isAnswered(questionResult.selectedAnswer) &&
        !questionResult.isCorrect,
    )
    .map(
      (questionResult) =>
        questionResult.question.id,
    );
}
