import { useState } from "react";

import { getExamHistory } from "../services/examHistoryStorage";
import { formatDate } from "../utils/formatDate";
import type { ExamHistoryEntry } from "../types/exam";

interface ExamHistoryProps {
  onBack: () => void;
  onSelectEntry: (entryId: string) => void;
}

export function ExamHistory({
  onBack,
  onSelectEntry,
}: ExamHistoryProps) {
  const [entries] = useState<ExamHistoryEntry[]>(
    getExamHistory,
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
        >
          ← Back to exams
        </button>

        <header className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
            Exam Engine
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Exam history
          </h1>
          <p className="mt-3 text-slate-400">
            Your results are stored on this device.
          </p>
        </header>

        {entries.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            You haven't finished any exam yet.
          </section>
        ) : (
          <div className="mt-8 space-y-3">
            {entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelectEntry(entry.id)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-600 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">
                      {entry.examName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatDate(entry.completedAt)} ·{" "}
                      {entry.result.totalQuestions} questions
                    </p>
                  </div>
                  <span className="text-xl font-bold text-blue-400">
                    {entry.result.score.toFixed(1)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
