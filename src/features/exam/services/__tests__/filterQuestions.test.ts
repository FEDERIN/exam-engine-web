import { describe, expect, it } from "vitest";

import { filterQuestions } from "../filterQuestions";
import { makeSingleChoice } from "./helpers";

const questions = [
  makeSingleChoice({
    id: "e1-c1",
    examId: "e1",
    categoryId: "c1",
  }),
  makeSingleChoice({
    id: "e1-c2",
    examId: "e1",
    categoryId: "c2",
  }),
  makeSingleChoice({
    id: "e2-c1",
    examId: "e2",
    categoryId: "c1",
  }),
];

describe("filterQuestions", () => {
  it("filters by exam id", () => {
    const result = filterQuestions(questions, "e1", []);

    expect(result.map((question) => question.id)).toEqual([
      "e1-c1",
      "e1-c2",
    ]);
  });

  it("filters by category when categories are provided", () => {
    const result = filterQuestions(questions, "e1", ["c2"]);

    expect(result.map((question) => question.id)).toEqual([
      "e1-c2",
    ]);
  });

  it("returns every category when the selection is empty", () => {
    const result = filterQuestions(questions, "e2", []);

    expect(result.map((question) => question.id)).toEqual([
      "e2-c1",
    ]);
  });
});
