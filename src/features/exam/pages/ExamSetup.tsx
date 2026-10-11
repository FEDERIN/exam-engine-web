import type { ExamCategory } from "../types/category";

interface ExamSetupProps {
  examName: string;
  categories: ExamCategory[];
  selectedCategories: string[];
  availableQuestions: number;
  questionCountInput: string;
  resumeQuestionCount: number | null;
  onCategoryChange: (categories: string[]) => void;
  onQuestionCountChange: (value: string) => void;
  onStart: () => void;
  onBack: () => void;
  onResume: () => void;
  onDiscardResume: () => void;
}

export function ExamSetup({
  examName,
  categories,
  selectedCategories,
  availableQuestions,
  questionCountInput,
  resumeQuestionCount,
  onCategoryChange,
  onQuestionCountChange,
  onStart,
  onBack,
  onResume,
  onDiscardResume,
}: ExamSetupProps) {
  const questionCount = Number(questionCountInput);

  const isValid =
    questionCountInput !== "" &&
    Number.isInteger(questionCount) &&
    questionCount >= 1 &&
    questionCount <= availableQuestions;

  const handleCategoryChange = (categoryId: string) => {
    const isSelected =
      selectedCategories.includes(categoryId);

    const updatedCategories = isSelected
      ? selectedCategories.filter(
          (item) => item !== categoryId,
        )
      : [...selectedCategories, categoryId];

    onCategoryChange(updatedCategories);
  };

  const handleSelectAll = () => {
    onCategoryChange([]);
  };

  const allCategoriesSelected =
    selectedCategories.length === 0;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
        >
          ← Change exam
        </button>

        {resumeQuestionCount !== null && (
          <section className="mb-4 rounded-xl border border-blue-500/40 bg-blue-500/10 p-5">
            <p className="text-sm font-semibold text-blue-200">
              You have an exam in progress
            </p>

            <p className="mt-1 text-sm text-slate-300">
              We saved your progress with{" "}
              {resumeQuestionCount} questions.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onResume}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
              >
                Continue
              </button>

              <button
                type="button"
                onClick={onDiscardResume}
                className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
              >
                Discard and start over
              </button>
            </div>
          </section>
        )}

        <section className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Exam Engine
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Configure your exam
            </h1>

            <p className="mt-4 text-slate-400">
              Exam: {examName}
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-3 block text-sm font-medium text-slate-300">
              Select the topics you want to include
            </p>

            <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-800 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allCategoriesSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm font-medium">
                  All categories
                </span>
              </label>

              <div className="border-t border-slate-700 pt-3">
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category.id,
                        )}
                        onChange={() =>
                          handleCategoryChange(category.id)
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                      />

                      <span className="text-sm text-slate-200">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-400">
              Available questions:{" "}
              <span className="font-semibold text-slate-200">
                {availableQuestions}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="question-count"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              How many questions do you want to use?
            </label>

            <input
              id="question-count"
              type="number"
              min={1}
              max={availableQuestions}
              value={questionCountInput}
              onChange={(event) =>
                onQuestionCountChange(event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <p className="mt-2 text-sm text-slate-500">
              Minimum: 1 · Maximum: {availableQuestions}
            </p>
          </div>

          <button
            type="button"
            disabled={!isValid}
            onClick={onStart}
            className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start exam
          </button>
        </section>
      </div>
    </main>
  );
}
