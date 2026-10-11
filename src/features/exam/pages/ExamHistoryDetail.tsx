import { useState } from "react";

import { ExamResult } from "../components/ExamResult";
import { QuestionReview } from "../components/QuestionReview";
import { getExamHistory } from "../services/examHistoryStorage";
import { formatDate } from "../utils/formatDate";
import type { ExamHistoryEntry } from "../types/exam";

interface ExamHistoryDetailProps {
  entryId: string;
  onBack: () => void;
}

export function ExamHistoryDetail({
  entryId,
  onBack,
}: ExamHistoryDetailProps) {
  const [entries] = useState<ExamHistoryEntry[]>(
    getExamHistory,
  );

  const entry =
    entries.find((item) => item.id === entryId) ?? null;

  if (entry === null) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
          >
            ← Back to history
          </button>

          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            We couldn't find that exam in your history.
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
        >
          ← Back to history
        </button>

        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
            {entry.examName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Exam from {formatDate(entry.completedAt)}
          </h1>
        </div>

        <ExamResult result={entry.result} />
        <QuestionReview result={entry.result} />
      </div>
    </main>
  );
}
