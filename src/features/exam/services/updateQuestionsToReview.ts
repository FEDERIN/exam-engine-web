import type { ExamResult } from "../types/exam";
import { getQuestionsToReview } from "./getQuestionsToReview";

export function updateQuestionsToReview(
  previousQuestionIds: string[],
  result: ExamResult,
): string[] {
  const currentResults = new Map(
    result.questions.map((questionResult) => [
      questionResult.question.id,
      questionResult,
    ]),
  );

  const updatedIds = previousQuestionIds.filter(
    (questionId) => {
      const questionResult =
        currentResults.get(questionId);

      if (!questionResult) {
        return true;
      }

      return !questionResult.isCorrect;
    },
  );

  return [
    ...new Set([
      ...updatedIds,
      ...getQuestionsToReview(result),
    ]),
  ];
}