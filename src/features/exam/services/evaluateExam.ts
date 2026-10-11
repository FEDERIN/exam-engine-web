import type { QuestionResult, ExamResult, ExamSession } from "../types/exam";
import type { AnswerSelection } from "../../../types/question";
import { isAnswered } from "./isAnswered";

function isCorrectAnswer(
  question: ExamSession["questions"][number],
  selectedAnswer: AnswerSelection,
): boolean {
  if (!isAnswered(selectedAnswer)) {
    return false;
  }

  if (question.type === "single-choice") {
    return selectedAnswer === question.correctAnswer;
  }

  if (!Array.isArray(selectedAnswer)) {
    return false;
  }

  return (
    selectedAnswer.length === question.correctAnswers.length &&
    selectedAnswer.every((answer) =>
      question.correctAnswers.includes(answer),
    )
  );
}

export function evaluateExam(
  session: ExamSession,
): ExamResult {
  const totalQuestions = session.questions.length;

  const questionResults: QuestionResult[] =
    session.questions.map((question) => {
      const answer = session.answers.find(
        (answer) => answer.questionId === question.id,
      );

      const selectedAnswer =
        answer?.selectedAnswer ?? null;

      const isCorrect = isCorrectAnswer(question, selectedAnswer);

      return {
        question,
        selectedAnswer,
        isCorrect,
      };
    });

  const answeredQuestions =
    questionResults.filter(
      (result) => isAnswered(result.selectedAnswer),
    ).length;

  const correctAnswers =
    questionResults.filter(
      (result) => result.isCorrect,
    ).length;

  const unansweredQuestions =
    totalQuestions - answeredQuestions;

  const incorrectAnswers =
    answeredQuestions - correctAnswers;

  const score =
    totalQuestions === 0
      ? 0
      : (correctAnswers / totalQuestions) * 100;

  return {
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    correctAnswers,
    incorrectAnswers,
    score,
    questions: questionResults,
  };
}
