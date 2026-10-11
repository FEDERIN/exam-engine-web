import type { Question } from "../../../types/question";

export function filterQuestions(
  questions: Question[],
  examId: string,
  categoryIds: string[],
): Question[] {
  return questions.filter(
    (question) =>
      question.examId === examId &&
      (categoryIds.length === 0 ||
        (question.categoryId !== undefined &&
          categoryIds.includes(question.categoryId))),
  );
}