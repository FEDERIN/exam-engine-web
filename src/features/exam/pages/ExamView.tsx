import { useState } from "react";
import type { Question } from "../../../types/question";
import type { ExamResult } from "../types/exam";
import type { CategoryAllocation } from "../types/category";
import { ExamResult as ExamResultView } from "../components/ExamResult";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigator } from "../components/QuestionNavigator";
import { QuestionReview } from "../components/QuestionReview";
import { ConfirmFinishDialog } from "../components/ConfirmFinishDialog";
import { useExam } from "../hooks/useExam";
import {
  getStoredQuestionsToReview,
  saveQuestionsToReview,
} from "../services/questionReviewStorage";
import { updateQuestionsToReview } from "../services/updateQuestionsToReview";
import { saveExamHistoryEntry } from "../services/examHistoryStorage";
import { isAnswered } from "../services/isAnswered";

interface ExamViewProps {
  questions: Question[];
  categoryAllocations: CategoryAllocation[];
  examName: string;
  selectedCategoryIds: string[];
  onRestart: () => void;
}

export function ExamView({
  questions,
  categoryAllocations,
  examName,
  selectedCategoryIds,
  onRestart,
}: ExamViewProps) {
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isConfirmingFinish, setIsConfirmingFinish] =
    useState(false);

  const {
    session,
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    finishExam,
  } = useExam(
    questions,
    categoryAllocations,
  );

  const currentQuestionNumber =
    session.currentQuestionIndex + 1;

  const totalQuestions = session.questions.length;

  const isFirstQuestion = currentQuestionNumber === 1;

  const isLastQuestion =
    currentQuestionNumber === totalQuestions;

  const progress =
    (currentQuestionNumber / totalQuestions) * 100;

  const answeredQuestions = session.questions.filter(
    (question) => {
      const answer = session.answers.find(
        (item) => item.questionId === question.id,
      );

      return isAnswered(answer?.selectedAnswer ?? null);
    },
  ).length;

  const handleFinishExam = () => {
    const examResult = finishExam();

    const previousQuestionsToReview =
      getStoredQuestionsToReview(session.questions[0].examId);

    const updatedQuestionsToReview =
      updateQuestionsToReview(
        previousQuestionsToReview,
        examResult,
      );

    saveQuestionsToReview(
      session.questions[0].examId,
      updatedQuestionsToReview,
    );

    saveExamHistoryEntry({
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
      examId: session.questions[0].examId,
      examName,
      categoryIds: selectedCategoryIds,
      result: examResult,
    });

    setResult(examResult);
  };

  if (result !== null) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-5xl space-y-6">
          <ExamResultView result={result} />

          <QuestionReview result={result} />

          <div className="flex justify-center pb-4">
            <button
              type="button"
              onClick={onRestart}
              className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold transition hover:bg-slate-800"
            >
              Back to exam setup
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-slate-400">
            Exam Engine
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Exam
          </h1>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Progress
              </span>

              <span className="font-medium">
                {currentQuestionNumber} / {totalQuestions}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <QuestionNavigator
              questions={session.questions}
              currentQuestionIndex={
                session.currentQuestionIndex
              }
              answers={session.answers}
              onQuestionSelected={goToQuestion}
            />

            <button
              type="button"
              onClick={() => setIsConfirmingFinish(true)}
              className="mt-4 w-full rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-green-500"
            >
              Finish exam
            </button>
          </aside>

          <section>
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSelected={selectAnswer}
            />

            <nav className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={isFirstQuestion}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {!isLastQuestion && (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500"
                >
                  Next
                </button>
              )}
            </nav>
          </section>
        </div>
      </div>

      {isConfirmingFinish && (
        <ConfirmFinishDialog
          totalQuestions={totalQuestions}
          answeredQuestions={answeredQuestions}
          onConfirm={() => {
            setIsConfirmingFinish(false);
            handleFinishExam();
          }}
          onCancel={() => setIsConfirmingFinish(false)}
        />
      )}
    </main>
  );
}
