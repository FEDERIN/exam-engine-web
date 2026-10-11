import type { ExamSession } from "../types/exam";

const STORAGE_KEY = "exam-engine:active-session:v1";

interface StoredSession {
  examId: string;
  session: ExamSession;
}

function isStoredSession(
  value: unknown,
): value is StoredSession {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const candidate = value as Partial<StoredSession>;
  const session = candidate.session;

  return (
    typeof candidate.examId === "string" &&
    typeof session === "object" &&
    session !== null &&
    Array.isArray(session.questions) &&
    session.questions.length > 0 &&
    typeof session.currentQuestionIndex === "number" &&
    Array.isArray(session.answers)
  );
}

export function getActiveSession(
  examId: string,
): ExamSession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (!isStoredSession(parsed) || parsed.examId !== examId) {
      return null;
    }

    return parsed.session;
  } catch {
    return null;
  }
}

export function saveActiveSession(
  examId: string,
  session: ExamSession,
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ examId, session }),
    );
  } catch {
    // A storage failure must not interrupt an in-progress exam.
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // A storage failure must not interrupt the exam flow.
  }
}
