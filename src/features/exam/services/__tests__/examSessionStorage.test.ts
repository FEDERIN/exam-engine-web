import { beforeEach, describe, expect, it } from "vitest";

import {
  clearActiveSession,
  getActiveSession,
  saveActiveSession,
} from "../examSessionStorage";
import { makeSingleChoice } from "./helpers";
import type { ExamSession } from "../../types/exam";

const STORAGE_KEY = "exam-engine:active-session:v1";

function makeSession(): ExamSession {
  return {
    questions: [makeSingleChoice({ id: "q1" })],
    currentQuestionIndex: 0,
    answers: [],
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("examSessionStorage", () => {
  it("returns null when there is no active session", () => {
    expect(getActiveSession("exam")).toBeNull();
  });

  it("restores the session for the same exam", () => {
    const session = makeSession();
    saveActiveSession("exam", session);

    expect(getActiveSession("exam")).toEqual(session);
  });

  it("ignores sessions from another exam", () => {
    saveActiveSession("exam-a", makeSession());

    expect(getActiveSession("exam-b")).toBeNull();
  });

  it("clears the active session", () => {
    saveActiveSession("exam", makeSession());
    clearActiveSession();

    expect(getActiveSession("exam")).toBeNull();
  });

  it("ignores malformed stored data", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ examId: "exam", session: { foo: 1 } }),
    );

    expect(getActiveSession("exam")).toBeNull();
  });
});
