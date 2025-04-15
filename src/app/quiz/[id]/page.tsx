"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Quiz } from "~/lib/types";
import ViewQuiz from "~/app/_components/ViewQuiz";
import type { QuizApi } from "~/lib/types";

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz>();

  const getQuiz = async () => {
    const res = await fetch(`/api/getQuiz?id=${String(id)}`);
    const data = (await res.json()) as QuizApi;
    setQuiz({
      ...data,
      questions: data.questions.map((q) => ({
        answer: q.correctAnswer,
        ...q,
        options: {
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
        },
      })),
    });
    console.log(data);
  };

  useEffect(() => {
    void getQuiz();
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl rounded-lg p-6">
      <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
        Quiz Details
      </h1>
      {quiz ? (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">
              Quiz Title: {quiz.title}
            </h2>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Score:</span> {quiz.score}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
            <ViewQuiz data={quiz.questions ?? []} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading quiz...</p>
      )}
    </div>
  );
}
