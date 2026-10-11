import type { Question } from "../../../types/question";
import type { CategoryAllocation } from "../types/category";
import { shuffleQuestions } from "./shuffleQuestions";

export function selectExamQuestions(
  questions: Question[],
  allocations: CategoryAllocation[],
  questionsToReview: string[],
): Question[] {
  const reviewIds = new Set(questionsToReview);

  const questionsByCategory = new Map<string, Question[]>();

  for (const question of questions) {
    const categoryQuestions =
      questionsByCategory.get(question.categoryId) ?? [];

    categoryQuestions.push(question);
    questionsByCategory.set(
      question.categoryId,
      categoryQuestions,
    );
  }

  const selectedQuestions: Question[] = [];

  for (const allocation of allocations) {
    const categoryQuestions =
      questionsByCategory.get(allocation.categoryId) ?? [];

    const reviewQuestions = categoryQuestions.filter(
      (question) => reviewIds.has(question.id),
    );

    const newQuestions = categoryQuestions.filter(
      (question) => !reviewIds.has(question.id),
    );

    const reviewCount = Math.min(
      reviewQuestions.length,
      allocation.questionCount,
    );

    const selectedReviewQuestions = shuffleQuestions(
      reviewQuestions,
    ).slice(0, reviewCount);

    const remainingCount =
      allocation.questionCount -
      selectedReviewQuestions.length;

    const selectedNewQuestions =
      shuffleQuestions(newQuestions).slice(
        0,
        remainingCount,
      );

    selectedQuestions.push(
      ...selectedReviewQuestions,
      ...selectedNewQuestions,
    );
  }

  return shuffleQuestions(selectedQuestions);
}