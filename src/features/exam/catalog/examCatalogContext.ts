import { createContext, useContext } from "react";

import type { ExamDefinition } from "../types/category";
import type { Question } from "../../../types/question";

export interface ExamCatalog {
  exams: ExamDefinition[];
  questionBank: Question[];
  availableQuestionCounts: Record<string, number>;
  availableCategoryCounts: Record<string, number>;
}

export const ExamCatalogContext =
  createContext<ExamCatalog | null>(null);

export function useExamCatalog(): ExamCatalog {
  const catalog = useContext(ExamCatalogContext);

  if (catalog === null) {
    throw new Error(
      "useExamCatalog must be used within an ExamCatalogProvider.",
    );
  }

  return catalog;
}
