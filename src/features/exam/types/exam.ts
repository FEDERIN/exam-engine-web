import type {
  AnswerSelection,
  Question,
} from "../../../types/question";

export interface ExamAnswer {
  questionId: Question["id"];
  selectedAnswer: AnswerSelection;
}

export interface ExamSession {
  questions: Question[];
  currentQuestionIndex: number;
  answers: ExamAnswer[];
}

export interface QuestionResult {
  question: Question;
  selectedAnswer: AnswerSelection;
  isCorrect: boolean;
}

export interface ExamResult {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  questions: QuestionResult[];
}

export interface ExamHistoryEntry {
  id: string;
  completedAt: string;
  examId: string;
  examName: string;
  categoryIds: string[];
  result: ExamResult;
}
