import { useMemo, useState } from "react";

import type {
  CategoryAllocation,
  CategoryWeight,
  ExamDefinition,
} from "../types/category";

import type { Question } from "../../../types/question";

import { ExamSetup } from "./ExamSetup";
import { ExamView } from "./ExamView";

import { filterQuestions } from "../services/filterQuestions";
import { calculateCategoryWeights } from "../services/calculateCategoryWeights";
import { allocateQuestionsByWeight } from "../services/allocateQuestionsByWeight";
import {
  clearActiveSession,
  getActiveSession,
} from "../services/examSessionStorage";

interface ExamRunnerProps {
  exam: ExamDefinition;
  questionBank: Question[];
  onBack: () => void;
}

export function ExamRunner({
  exam,
  questionBank,
  onBack,
}: ExamRunnerProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const [questionCountInput, setQuestionCountInput] =
    useState("");

  const [questionCount, setQuestionCount] =
    useState<number | null>(null);

  const [categoryAllocations, setCategoryAllocations] =
    useState<CategoryAllocation[]>([]);

  const [resumeQuestionCount, setResumeQuestionCount] =
    useState<number | null>(() => {
      const activeSession = getActiveSession(exam.id);

      return activeSession === null
        ? null
        : activeSession.questions.length;
    });

  const categoryWeights = useMemo<CategoryWeight[]>(
    () =>
      exam.categories.map((category) => ({
        categoryId: category.id,
        weight: category.weight,
        availableQuestions: questionBank.filter(
          (question) =>
            question.examId === exam.id &&
            question.categoryId === category.id,
        ).length,
      })),
    [exam, questionBank],
  );

  const availableCategories = useMemo(
    () =>
      exam.categories.filter((category) =>
        categoryWeights.some(
          (weight) =>
            weight.categoryId === category.id &&
            weight.availableQuestions > 0,
        ),
      ),
    [exam, categoryWeights],
  );

  const availableCategoryIds = useMemo(
    () => availableCategories.map((category) => category.id),
    [availableCategories],
  );

  const effectiveSelectedCategories =
    selectedCategories.length === 0
      ? availableCategoryIds
      : selectedCategories;

  const filteredQuestions = useMemo(
    () =>
      filterQuestions(
        questionBank,
        exam.id,
        effectiveSelectedCategories,
      ),
    [questionBank, exam.id, effectiveSelectedCategories],
  );

  const availableQuestions = filteredQuestions.length;

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);

    const selectedIds =
      categories.length === 0 ? availableCategoryIds : categories;

    const newMaximum = filterQuestions(
      questionBank,
      exam.id,
      selectedIds,
    ).length;

    setQuestionCountInput((current) => {
      if (current === "") {
        return current;
      }

      const currentCount = Number(current);

      return Number.isInteger(currentCount) &&
        currentCount >= 1 &&
        currentCount <= newMaximum
        ? current
        : String(newMaximum);
    });
  };

  const handleStartExam = () => {
    const count = Number(questionCountInput);

    if (
      !Number.isInteger(count) ||
      count < 1 ||
      count > availableQuestions
    ) {
      return;
    }

    clearActiveSession();
    setResumeQuestionCount(null);

    const selectedCategoryWeights =
      calculateCategoryWeights(
        categoryWeights,
        selectedCategories,
      );

    const allocations = allocateQuestionsByWeight(
      count,
      selectedCategoryWeights,
    );

    setCategoryAllocations(allocations);
    setQuestionCount(count);
  };

  const handleResume = () => {
    setCategoryAllocations([]);
    setResumeQuestionCount(null);
    setQuestionCount(availableQuestions);
  };

  const handleDiscardResume = () => {
    clearActiveSession();
    setResumeQuestionCount(null);
  };

  const handleRestart = () => {
    setResumeQuestionCount(null);
    setQuestionCount(null);
  };

  if (questionCount === null) {
    return (
      <ExamSetup
        examName={exam.name}
        categories={availableCategories}
        selectedCategories={selectedCategories}
        availableQuestions={availableQuestions}
        questionCountInput={questionCountInput}
        resumeQuestionCount={resumeQuestionCount}
        onCategoryChange={handleCategoryChange}
        onQuestionCountChange={setQuestionCountInput}
        onStart={handleStartExam}
        onBack={onBack}
        onResume={handleResume}
        onDiscardResume={handleDiscardResume}
      />
    );
  }

  return (
    <ExamView
      questions={filteredQuestions}
      categoryAllocations={categoryAllocations}
      examName={exam.name}
      selectedCategoryIds={effectiveSelectedCategories}
      onRestart={handleRestart}
    />
  );
}
