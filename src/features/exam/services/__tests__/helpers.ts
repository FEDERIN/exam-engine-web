import type {
  MultipleChoiceQuestion,
  SingleChoiceQuestion,
} from "../../../../types/question";
import type {
  ExamResult,
  QuestionResult,
} from "../../types/exam";

let questionCounter = 0;

export function makeSingleChoice(
  overrides: Partial<SingleChoiceQuestion> = {},
): SingleChoiceQuestion {
  questionCounter += 1;

  return {
    id: `single-${questionCounter}`,
    type: "single-choice",
    question: `Pregunta de opción única ${questionCounter}`,
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    examId: "exam",
    categoryId: "cat",
    ...overrides,
  };
}

export function makeMultipleChoice(
  overrides: Partial<MultipleChoiceQuestion> = {},
): MultipleChoiceQuestion {
  questionCounter += 1;

  return {
    id: `multiple-${questionCounter}`,
    type: "multiple-choice",
    question: `Pregunta de opción múltiple ${questionCounter}`,
    options: ["A", "B", "C", "D"],
    correctAnswers: [0, 1],
    examId: "exam",
    categoryId: "cat",
    ...overrides,
  };
}

export function makeResult(
  questions: QuestionResult[] = [],
): ExamResult {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (question) => question.isCorrect,
  ).length;
  const answeredQuestions = questions.filter(
    (question) => question.selectedAnswer !== null,
  ).length;
  const unansweredQuestions =
    totalQuestions - answeredQuestions;
  const incorrectAnswers =
    answeredQuestions - correctAnswers;

  return {
    totalQuestions,
    answeredQuestions,
    unansweredQuestions,
    correctAnswers,
    incorrectAnswers,
    score:
      totalQuestions === 0
        ? 0
        : (correctAnswers / totalQuestions) * 100,
    questions,
  };
}
