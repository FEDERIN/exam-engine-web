import { describe, expect, it } from "vitest";

import { parseExamDefinition } from "../validateExamDefinition";

describe("parseExamDefinition", () => {
  const validCategory = {
    id: "collaboration-features",
    name: "Collaboration Features",
    weight: 12.5,
  };

  it("accepts a well-formed exam definition", () => {
    const parsed = parseExamDefinition({
      id: "github-foundations",
      name: "GitHub Foundations",
      categories: [validCategory],
    });

    expect(parsed).toEqual({
      id: "github-foundations",
      name: "GitHub Foundations",
      categories: [validCategory],
    });
  });

  it("rejects a non-object definition", () => {
    expect(parseExamDefinition(null)).toBeNull();
    expect(parseExamDefinition("github-foundations")).toBeNull();
    expect(parseExamDefinition([])).toBeNull();
  });

  it("rejects a definition with a blank id or name", () => {
    expect(
      parseExamDefinition({
        id: "  ",
        name: "GitHub Foundations",
        categories: [validCategory],
      }),
    ).toBeNull();

    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "",
        categories: [validCategory],
      }),
    ).toBeNull();
  });

  it("rejects a definition without categories", () => {
    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "GitHub Foundations",
        categories: [],
      }),
    ).toBeNull();

    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "GitHub Foundations",
      }),
    ).toBeNull();
  });

  it("rejects a category with a non-numeric or negative weight", () => {
    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "GitHub Foundations",
        categories: [{ ...validCategory, weight: "12.5" }],
      }),
    ).toBeNull();

    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "GitHub Foundations",
        categories: [{ ...validCategory, weight: -1 }],
      }),
    ).toBeNull();
  });

  it("rejects duplicated category ids", () => {
    expect(
      parseExamDefinition({
        id: "github-foundations",
        name: "GitHub Foundations",
        categories: [validCategory, validCategory],
      }),
    ).toBeNull();
  });
});
