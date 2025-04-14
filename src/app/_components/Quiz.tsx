import React, { useState } from "react";
import type { Question } from "~/lib/types";

type QuizProps = {
  data: Question[];
  setData: React.Dispatch<React.SetStateAction<Question[]>>;
  submitQuiz: (score: number) => Promise<void>;
};

export default function Quiz({ data, setData, submitQuiz }: QuizProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="">
      {Array.isArray(data) && (
        <div className="mt-4">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="mb-5 rounded border border-black bg-gray-200 p-5"
            >
              <h3 className="font-bold">
                Question {index + 1}: {item.question}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {Object.entries(item.options).map(([key, option]) => {
                  const isCorrect = key === item.answer;
                  const isSelected = key === item.selectedAnswer;
                  const buttonClass = isSubmitted
                    ? isCorrect
                      ? "bg-green-500 text-white"
                      : isSelected
                        ? "bg-red-500 text-white"
                        : ""
                    : isSelected
                      ? "bg-blue-500 text-white"
                      : "";

                  return (
                    <button
                      key={key}
                      className={`rounded border px-4 py-2 ${buttonClass} cursor-pointer border-gray-500`}
                      onClick={() => {
                        if (!isSubmitted) {
                          const selectedAnswer = key;
                          setData((prevData) =>
                            Array.isArray(prevData)
                              ? prevData.map((q) =>
                                  q.id === item.id
                                    ? { ...q, selectedAnswer }
                                    : q,
                                )
                              : prevData,
                          );
                        }
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {isSubmitted && (
                <p className="mt-3 text-blue-600">
                  Expalanation: {item.explanation}
                </p>
              )}
            </div>
          ))}
          {data.length > 0 && (
            <button
              className="mt-4 cursor-pointer rounded border-black bg-green-600 px-4 py-2 text-white"
              onClick={() => {
                if (Array.isArray(data)) {
                  const score = data.reduce((acc, item) => {
                    return acc + (item.selectedAnswer === item.answer ? 1 : 0);
                  }, 0);
                  setIsSubmitted(true);
                  alert(`Your score is ${score} out of ${data.length}`);
                  void submitQuiz(score);
                }
              }}
            >
              Submit Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}
