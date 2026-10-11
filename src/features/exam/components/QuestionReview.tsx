import { useState } from "react";
import type { ExamResult } from "../types/exam";
import { isAnswered } from "../services/isAnswered";

interface QuestionReviewProps {
  result: ExamResult;
}

export function QuestionReview({
  result,
}: QuestionReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const questionResult = result.questions[currentIndex];

  const { question, selectedAnswer, isCorrect } =
    questionResult;

  const isUnanswered = !isAnswered(selectedAnswer);

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion =
    currentIndex === result.questions.length - 1;

  const goToPrevious = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((current) =>
      Math.min(current + 1, result.questions.length - 1),
    );
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(
      Math.min(
        Math.max(index, 0),
        result.questions.length - 1,
      ),
    );
  };

  return (
    <section className="space-y-6">
      {/* Question navigator */}
      <nav
        aria-label="Answer review navigation"
        className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-400">
            Answer review
          </p>

          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {result.questions.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {result.questions.map(
            (questionResult, index) => {
              const unanswered = !isAnswered(
                questionResult.selectedAnswer,
              );

              const current = index === currentIndex;

              return (
                <button
                  key={questionResult.question.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  aria-label={`Review question ${index + 1}`}
                  aria-current={
                    current ? "step" : undefined
                  }
                  className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                    current
                      ? "border-blue-500 bg-blue-600 text-white"
                      : unanswered
                        ? "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                        : questionResult.isCorrect
                          ? "border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  {index + 1}
                </button>
              );
            },
          )}
        </div>
      </nav>

      {/* Current question */}
      <article
        className={`rounded-2xl border bg-slate-900 p-6 shadow-xl sm:p-8 ${
          isUnanswered
            ? "border-slate-700"
            : isCorrect
              ? "border-green-500/30"
              : "border-red-500/30"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Question {currentIndex + 1}
            </p>

            <h2 className="mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">
              {question.question}
            </h2>

            {question.topic && (
              <p className="mt-2 text-sm text-slate-500">
                Topic: {question.topic}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              isUnanswered
                ? "bg-slate-700 text-slate-300"
                : isCorrect
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
            }`}
          >
            {isUnanswered
              ? "Unanswered"
              : isCorrect
                ? "Correct"
                : "Incorrect"}
          </span>
        </div>

        {/* Options */}
        <div className="mt-8 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = Array.isArray(selectedAnswer)
              ? selectedAnswer.includes(index)
              : selectedAnswer === index;

            const isCorrectAnswer =
              question.type === "multiple-choice"
                ? question.correctAnswers.includes(index)
                : question.correctAnswer === index;

            return (
              <div
                key={index}
                className={`rounded-xl border p-4 ${
                  isCorrectAnswer
                    ? "border-green-500/40 bg-green-500/10"
                    : isSelected
                      ? "border-red-500/40 bg-red-500/10"
                      : "border-slate-700 bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-slate-300">
                    {String.fromCharCode(65 + index)}.
                  </span>

                  <span className="flex-1 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {option}
                  </span>

                  {isCorrectAnswer && (
                    <span className="shrink-0 text-xs font-semibold text-green-400">
                      Correct
                    </span>
                  )}

                  {isSelected &&
                    !isCorrectAnswer && (
                      <span className="shrink-0 text-xs font-semibold text-red-400">
                        Your answer
                      </span>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-sm font-semibold text-slate-300">
              Explanation
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {question.explanation}
            </p>
          </div>
        )}
      </article>

      {/* Previous / next navigation */}
      <nav className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={isFirstQuestion}
          className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-slate-500">
          {currentIndex + 1} of {result.questions.length}
        </span>

        <button
          type="button"
          onClick={goToNext}
          disabled={isLastQuestion}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </section>
  );
}
