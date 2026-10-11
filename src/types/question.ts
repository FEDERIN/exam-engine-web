interface BaseQuestion {
  id: string;
  question: string;
  options: string[];
  explanation?: string;
  examId: string;
  categoryId: string;
  topic?: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single-choice";
  correctAnswer: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  correctAnswers: number[];
}

export type Question = SingleChoiceQuestion | MultipleChoiceQuestion;

export type AnswerSelection = number | number[] | null;
