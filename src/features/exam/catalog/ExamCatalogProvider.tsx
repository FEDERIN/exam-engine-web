import { useEffect, useState, type ReactNode } from "react";

import {
  ExamCatalogContext,
  type ExamCatalog,
} from "./examCatalogContext";

interface ExamCatalogProviderProps {
  children: ReactNode;
}

export function ExamCatalogProvider({
  children,
}: ExamCatalogProviderProps) {
  const [catalog, setCatalog] = useState<ExamCatalog | null>(
    null,
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isActive = true;

    import("./loadExamCatalog")
      .then((module) => module.loadExamCatalog())
      .then((loadedCatalog) => {
        if (isActive) {
          setCatalog(loadedCatalog);
        }
      })
      .catch((caught: unknown) => {
        if (isActive) {
          setError(
            caught instanceof Error
              ? caught
              : new Error(String(caught)),
          );
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (error !== null) {
    throw error;
  }

  if (catalog === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
        <p className="text-sm text-slate-400">
          Loading exams…
        </p>
      </main>
    );
  }

  return (
    <ExamCatalogContext.Provider value={catalog}>
      {children}
    </ExamCatalogContext.Provider>
  );
}
