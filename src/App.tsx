import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { ExamSelection } from "./features/exam/pages/ExamSelection";
import { ExamRunner } from "./features/exam/pages/ExamRunner";
import { ExamHistory } from "./features/exam/pages/ExamHistory";
import { ExamHistoryDetail } from "./features/exam/pages/ExamHistoryDetail";

import { useExamCatalog } from "./features/exam/catalog/examCatalogContext";

function ExamSelectionRoute() {
  const catalog = useExamCatalog();
  const navigate = useNavigate();
  const [selectedExamId, setSelectedExamId] =
    useState<string | null>(null);

  return (
    <ExamSelection
      exams={catalog.exams}
      selectedExamId={selectedExamId}
      availableQuestionCounts={catalog.availableQuestionCounts}
      availableCategoryCounts={catalog.availableCategoryCounts}
      onExamSelected={setSelectedExamId}
      onHistory={() => navigate("/history")}
      onContinue={() => {
        if (selectedExamId !== null) {
          navigate(`/exam/${selectedExamId}`);
        }
      }}
    />
  );
}

function ExamRunnerRoute() {
  const catalog = useExamCatalog();
  const navigate = useNavigate();
  const { examId } = useParams();

  const exam =
    catalog.exams.find((item) => item.id === examId) ??
    null;

  const availableQuestions =
    exam === null
      ? 0
      : (catalog.availableQuestionCounts[exam.id] ?? 0);

  if (exam === null || availableQuestions === 0) {
    return <Navigate to="/" replace />;
  }

  return (
    <ExamRunner
      exam={exam}
      questionBank={catalog.questionBank}
      onBack={() => navigate("/")}
    />
  );
}

function ExamHistoryRoute() {
  const navigate = useNavigate();

  return (
    <ExamHistory
      onBack={() => navigate("/")}
      onSelectEntry={(entryId) =>
        navigate(`/history/${entryId}`)
      }
    />
  );
}

function ExamHistoryDetailRoute() {
  const navigate = useNavigate();
  const { entryId } = useParams();

  return (
    <ExamHistoryDetail
      entryId={entryId ?? ""}
      onBack={() => navigate("/history")}
    />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamSelectionRoute />} />
      <Route
        path="/exam/:examId"
        element={<ExamRunnerRoute />}
      />
      <Route
        path="/history"
        element={<ExamHistoryRoute />}
      />
      <Route
        path="/history/:entryId"
        element={<ExamHistoryDetailRoute />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
