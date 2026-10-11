import type { ExamAnswer } from "../types/exam";
import type { Question } from "../../../types/question";
import { isAnswered } from "../services/isAnswered";

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: ExamAnswer[];
  onQuestionSelected: (index: number) => void;
}

export function QuestionNavigator({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelected,
}: QuestionNavigatorProps) {
  const answeredQuestionIds = new Set(
    answers
      .filter((answer) => isAnswered(answer.selectedAnswer))
      .map((answer) => answer.questionId),
  );

  return (
    <nav
      aria-label="Question navigation"
      className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4"
    >
      <p className="mb-4 text-sm font-medium text-slate-400">
        Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentQuestionIndex;
          const isAnswered = answeredQuestionIds.has(question.id);

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onQuestionSelected(index)}
              aria-label={`Go to question ${index + 1}${
                isAnswered
                  ? ", answered"
                  : ", unanswered"
              }`}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                isCurrent
                  ? "border-blue-500 bg-blue-600 text-white"
                  : isAnswered
                    ? "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-700"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
