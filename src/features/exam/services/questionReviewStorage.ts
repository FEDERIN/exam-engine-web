const STORAGE_KEY = "exam-engine:questions-to-review:v2";
const LEGACY_STORAGE_KEY = "exam-engine:questions-to-review";

type QuestionsToReviewByExam = Record<string, string[]>;

function getStoredQuestionsByExam(): QuestionsToReviewByExam {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([examId, questionIds]) =>
        Array.isArray(questionIds)
          ? [[
              examId,
              questionIds.filter(
                (id): id is string => typeof id === "string",
              ),
            ]]
          : [],
      ),
    );
  } catch {
    return {};
  }
}

function getLegacyQuestionsToReview(): string[] {
  const stored = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (id): id is string =>
        typeof id === "string",
    );
  } catch {
    return [];
  }
}

export function saveQuestionsToReview(
  examId: string,
  questionIds: string[],
): void {
  const uniqueIds = [...new Set(questionIds)];
  const questionsByExam = getStoredQuestionsByExam();

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...questionsByExam,
        [examId]: uniqueIds,
      }),
    );
  } catch {
    // A storage failure must not prevent the user from seeing exam results.
  }
}

export function getStoredQuestionsToReview(
  examId: string,
): string[] {
  const storedQuestions = getStoredQuestionsByExam()[examId];

  return storedQuestions ?? getLegacyQuestionsToReview();
}
