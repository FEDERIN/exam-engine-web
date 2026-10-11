export interface CategoryWeight {
  categoryId: string;
  weight: number;
  availableQuestions: number;
}

export interface CategoryAllocation {
  categoryId: string;
  questionCount: number;
}

export interface ExamDefinition {
  id: string;
  name: string;
  categories: ExamCategory[];
}

export interface ExamCategory {
  id: string;
  name: string;
  weight: number;
}