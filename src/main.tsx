import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ExamCatalogProvider } from "./features/exam/catalog/ExamCatalogProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ExamCatalogProvider>
          <App />
        </ExamCatalogProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
