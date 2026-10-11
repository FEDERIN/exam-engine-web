import type { AnswerSelection } from "../../../types/question";

export function isAnswered(
  selectedAnswer: AnswerSelection,
): boolean {
  return Array.isArray(selectedAnswer)
    ? selectedAnswer.length > 0
    : selectedAnswer !== null;
}
