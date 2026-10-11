import type { ExamHistoryEntry } from "../types/exam";

const STORAGE_KEY = "exam-engine:exam-history:v1";
const MAX_ENTRIES = 50;

function isHistoryEntry(value: unknown): value is ExamHistoryEntry {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const entry = value as Partial<ExamHistoryEntry>;

  return (
    typeof entry.id === "string" &&
    typeof entry.completedAt === "string" &&
    typeof entry.examId === "string" &&
    typeof entry.examName === "string" &&
    Array.isArray(entry.categoryIds) &&
    typeof entry.result === "object" &&
    entry.result !== null
  );
}

export function getExamHistory(): ExamHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(isHistoryEntry)
      : [];
  } catch {
    return [];
  }
}

export function saveExamHistoryEntry(entry: ExamHistoryEntry): void {
  try {
    const history = [entry, ...getExamHistory()].slice(
      0,
      MAX_ENTRIES,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // A storage failure must not prevent the user from seeing exam results.
  }
}
