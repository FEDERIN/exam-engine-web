interface ConfirmFinishDialogProps {
  totalQuestions: number;
  answeredQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmFinishDialog({
  totalQuestions,
  answeredQuestions,
  onConfirm,
  onCancel,
}: ConfirmFinishDialogProps) {
  const unansweredQuestions =
    totalQuestions - answeredQuestions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-finish-title"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
      >
        <h2
          id="confirm-finish-title"
          className="text-lg font-semibold"
        >
          Finish exam
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          You answered {answeredQuestions} of{" "}
          {totalQuestions} questions.
          {unansweredQuestions > 0
            ? ` ${unansweredQuestions} left unanswered.`
            : " You answered all of them!"}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium transition hover:bg-slate-800"
          >
            Keep answering
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-green-500"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
