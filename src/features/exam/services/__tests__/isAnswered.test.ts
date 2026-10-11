import { describe, expect, it } from "vitest";

import { isAnswered } from "../isAnswered";

describe("isAnswered", () => {
  it("treats null as unanswered", () => {
    expect(isAnswered(null)).toBe(false);
  });

  it("treats an empty array as unanswered", () => {
    expect(isAnswered([])).toBe(false);
  });

  it("treats a number as answered", () => {
    expect(isAnswered(0)).toBe(true);
  });

  it("treats a non empty array as answered", () => {
    expect(isAnswered([1])).toBe(true);
  });
});
