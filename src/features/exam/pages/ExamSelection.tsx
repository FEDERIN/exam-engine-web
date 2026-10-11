import type { ExamDefinition } from "../types/category";

interface ExamSelectionProps {
  exams: ExamDefinition[];
  selectedExamId: string | null;
  availableQuestionCounts: Record<string, number>;
  availableCategoryCounts: Record<string, number>;
  onExamSelected: (examId: string) => void;
  onContinue: () => void;
  onHistory: () => void;
}

export function ExamSelection({
  exams,
  selectedExamId,
  availableQuestionCounts,
  availableCategoryCounts,
  onExamSelected,
  onContinue,
  onHistory,
}: ExamSelectionProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Exam Engine
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Select an exam
            </h1>

            <p className="mt-4 text-slate-400">
              Choose the question bank you want to use.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {exams.map((exam) => {
              const isSelected = selectedExamId === exam.id;
              const availableQuestions =
                availableQuestionCounts[exam.id] ?? 0;
              const availableCategories =
                availableCategoryCounts[exam.id] ?? 0;
              const isAvailable = availableQuestions > 0;

              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => onExamSelected(exam.id)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  className={`w-full rounded-xl border p-5 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {exam.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {isAvailable
                          ? `${availableCategories} categories · ${availableQuestions} questions`
                          : "Bank has no questions available"}
                      </p>
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={
              selectedExamId === null ||
              (availableQuestionCounts[selectedExamId] ?? 0) === 0
            }
            onClick={onContinue}
            className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={onHistory}
            className="mt-3 w-full rounded-lg border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800"
          >
            View history
          </button>
        </section>
      </div>
    </main>
  );
}
