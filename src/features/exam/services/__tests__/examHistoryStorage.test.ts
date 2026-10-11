import { beforeEach, describe, expect, it } from "vitest";

import {
  getExamHistory,
  saveExamHistoryEntry,
} from "../examHistoryStorage";
import { makeResult } from "./helpers";
import type { ExamHistoryEntry } from "../../types/exam";

const STORAGE_KEY = "exam-engine:exam-history:v1";

function makeEntry(id: string): ExamHistoryEntry {
  return {
    id,
    completedAt: new Date().toISOString(),
    examId: "exam",
    examName: "Exam",
    categoryIds: [],
    result: makeResult([]),
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("examHistoryStorage", () => {
  it("returns an empty history when nothing is stored", () => {
    expect(getExamHistory()).toEqual([]);
  });

  it("prepends the newest entry", () => {
    saveExamHistoryEntry(makeEntry("a"));
    saveExamHistoryEntry(makeEntry("b"));

    expect(getExamHistory().map((entry) => entry.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("caps the history at 50 entries", () => {
    for (let i = 0; i < 55; i++) {
      saveExamHistoryEntry(makeEntry(`entry-${i}`));
    }

    expect(getExamHistory()).toHaveLength(50);
  });

  it("ignores invalid entries", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ foo: "bar" }, makeEntry("valid")]),
    );

    expect(getExamHistory().map((entry) => entry.id)).toEqual([
      "valid",
    ]);
  });
});
