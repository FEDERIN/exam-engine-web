import { describe, expect, it } from "vitest";

import { validateExamCatalog } from "../validateExamCatalog";

describe("validateExamCatalog", () => {
  const githubFoundations = {
    id: "github-foundations",
    name: "GitHub Foundations",
    categories: [{ id: "cat", name: "Category", weight: 100 }],
  };

  const reactFundamentals = {
    id: "react-fundamentals",
    name: "React Fundamentals",
    categories: [{ id: "react", name: "React", weight: 100 }],
  };

  it("returns every discovered exam sorted by name", () => {
    const catalog = validateExamCatalog([
      githubFoundations,
      reactFundamentals,
    ]);

    expect(catalog.map((exam) => exam.id)).toEqual([
      "github-foundations",
      "react-fundamentals",
    ]);
  });

  it("rejects a catalog that is not an array", () => {
    expect(() => validateExamCatalog(null)).toThrow(
      "Invalid exam catalog.",
    );
  });

  it("rejects an empty catalog", () => {
    expect(() => validateExamCatalog([])).toThrow(
      "Exam catalog must contain at least one exam.",
    );
  });

  it("rejects the catalog when any definition is invalid", () => {
    expect(() =>
      validateExamCatalog([
        githubFoundations,
        { id: "broken" },
      ]),
    ).toThrow("Exam catalog contains an invalid exam definition.");
  });

  it("rejects duplicate exam ids", () => {
    expect(() =>
      validateExamCatalog([
        githubFoundations,
        { ...reactFundamentals, id: "github-foundations" },
      ]),
    ).toThrow("Exam catalog contains duplicate exam IDs.");
  });
});
