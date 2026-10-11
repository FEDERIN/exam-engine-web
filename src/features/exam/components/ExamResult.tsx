import type { ExamResult } from "../types/exam";

interface ExamResultProps {
  result: ExamResult;
}

export function ExamResult({ result }: ExamResultProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
          Result
        </p>

        <h2 className="mt-3 text-5xl font-bold">
          {result.score.toFixed(1)}%
        </h2>

        <p className="mt-3 text-slate-400">
          {result.correctAnswers} of {result.totalQuestions}{" "}
          correct answers
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {result.correctAnswers}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Correct
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">
            {result.incorrectAnswers}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Incorrect
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4 text-center">
          <p className="text-2xl font-bold text-slate-300">
            {result.unansweredQuestions}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Unanswered
          </p>
        </div>
      </div>
    </section>
  );
}
