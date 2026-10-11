import type { Question } from "../../../types/question";

export function shuffleQuestionOptions(
  question: Question,
): Question {
  const shuffledOptions = question.options.map((option, index) => ({
    option,
    originalIndex: index,
  }));

  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledOptions[i], shuffledOptions[j]] = [
      shuffledOptions[j],
      shuffledOptions[i],
    ];
  }

  const options = shuffledOptions.map(({ option }) => option);

  if (question.type === "multiple-choice") {
    return {
      ...question,
      options,
      correctAnswers: shuffledOptions
        .map(({ originalIndex }, index) => ({ originalIndex, index }))
        .filter(({ originalIndex }) =>
          question.correctAnswers.includes(originalIndex),
        )
        .map(({ index }) => index),
    };
  }

  return {
    ...question,
    options,
    correctAnswer: shuffledOptions.findIndex(
      ({ originalIndex }) => originalIndex === question.correctAnswer,
    ),
  };
}
