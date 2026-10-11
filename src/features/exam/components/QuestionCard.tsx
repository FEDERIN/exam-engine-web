import type {
  AnswerSelection,
  Question,
} from "../../../types/question";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: AnswerSelection;
  onAnswerSelected: (answer: number) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelected,
}: QuestionCardProps) {
  const isMultipleChoice = question.type === "multiple-choice";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-xl font-semibold leading-relaxed sm:text-2xl">
        {question.question}
      </h2>

      {isMultipleChoice && (
        <p className="mt-3 text-sm text-slate-400">
          Select all correct options.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = Array.isArray(selectedAnswer)
            ? selectedAnswer.includes(index)
            : selectedAnswer === index;

          return (
            <label
              key={index}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
              }`}
            >
              <input
                type={isMultipleChoice ? "checkbox" : "radio"}
                name={`question-${question.id}`}
                value={index}
                checked={isSelected}
                onChange={() => onAnswerSelected(index)}
                className="h-4 w-4 accent-blue-500"
              />

              <span className="text-sm leading-relaxed sm:text-base">
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
