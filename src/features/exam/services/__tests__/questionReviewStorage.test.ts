import { beforeEach, describe, expect, it } from "vitest";

import {
  getStoredQuestionsToReview,
  saveQuestionsToReview,
} from "../questionReviewStorage";

const LEGACY_KEY = "exam-engine:questions-to-review";

beforeEach(() => {
  localStorage.clear();
});

describe("questionReviewStorage", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(getStoredQuestionsToReview("exam")).toEqual([]);
  });

  it("stores and reads questions per exam", () => {
    saveQuestionsToReview("exam-a", ["q1", "q2"]);

    expect(getStoredQuestionsToReview("exam-a")).toEqual([
      "q1",
      "q2",
    ]);
    expect(getStoredQuestionsToReview("exam-b")).toEqual([]);
  });

  it("deduplicates stored ids", () => {
    saveQuestionsToReview("exam-a", ["q1", "q1", "q2"]);

    expect(getStoredQuestionsToReview("exam-a")).toEqual([
      "q1",
      "q2",
    ]);
  });

  it("falls back to the legacy list for unknown exams", () => {
    localStorage.setItem(
      LEGACY_KEY,
      JSON.stringify(["legacy-1", "legacy-2"]),
    );

    expect(getStoredQuestionsToReview("brand-new")).toEqual([
      "legacy-1",
      "legacy-2",
    ]);
  });
});
