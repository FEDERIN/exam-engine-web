import { useEffect, useState } from "react";
import type { Question } from "../../../types/question";
import type {
  CategoryAllocation,
} from "../types/category";
import type { ExamSession } from "../types/exam";
import { evaluateExam } from "../services/evaluateExam";
import { createExamSession } from "../services/createExamSession";
import { getStoredQuestionsToReview } from "../services/questionReviewStorage";
import { selectExamQuestions } from "../services/selectExamQuestions";
import {
  clearActiveSession,
  getActiveSession,
  saveActiveSession,
} from "../services/examSessionStorage";

export function useExam(
  questions: Question[],
  categoryAllocations: CategoryAllocation[],
) {
  const [session, setSession] = useState<ExamSession>(() => {
    const examId = questions[0].examId;
    const storedSession = getActiveSession(examId);

    if (storedSession !== null) {
      return storedSession;
    }

    const questionsToReview =
      getStoredQuestionsToReview(examId);

    const selectedQuestions = selectExamQuestions(
      questions,
      categoryAllocations,
      questionsToReview,
    );

    return createExamSession(selectedQuestions);
  });

  const examId = session.questions[0].examId;

  useEffect(() => {
    saveActiveSession(examId, session);
  }, [examId, session]);

  const currentQuestion =
    session.questions[session.currentQuestionIndex];

  const currentAnswer = session.answers.find(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const selectedAnswer =
    currentAnswer?.selectedAnswer ?? null;

  const selectAnswer = (answer: number) => {
    setSession((current) => {
      const previousAnswer = current.answers.find(
        (item) => item.questionId === currentQuestion.id,
      );

      const selectedAnswer =
        currentQuestion.type === "multiple-choice"
          ? (() => {
              const selected = Array.isArray(
                previousAnswer?.selectedAnswer,
              )
                ? previousAnswer.selectedAnswer
                : [];

              return selected.includes(answer)
                ? selected.filter((item) => item !== answer)
                : [...selected, answer].sort((a, b) => a - b);
            })()
          : answer;

      return {
        ...current,
        answers: [
          ...current.answers.filter(
            (item) => item.questionId !== currentQuestion.id,
          ),
          {
            questionId: currentQuestion.id,
            selectedAnswer,
          },
        ],
      };
    });
  };

  const nextQuestion = () => {
    setSession((current) => ({
      ...current,
      currentQuestionIndex: Math.min(
        current.currentQuestionIndex + 1,
        current.questions.length - 1,
      ),
    }));
  };

  const previousQuestion = () => {
    setSession((current) => ({
      ...current,
      currentQuestionIndex: Math.max(
        current.currentQuestionIndex - 1,
        0,
      ),
    }));
  };

  const goToQuestion = (index: number) => {
    setSession((current) => ({
      ...current,
      currentQuestionIndex: Math.min(
        Math.max(index, 0),
        current.questions.length - 1,
      ),
    }));
  };

  const finishExam = () => {
    clearActiveSession();

    return evaluateExam(session);
  };

  return {
    session,
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    finishExam,
  };
}
