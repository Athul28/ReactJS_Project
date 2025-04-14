import React, { useState } from "react";
import type { Question } from "~/lib/types";

type QuizProps = {
  data: Question[];
};

export default function ViewQuiz({ data }: QuizProps) {
  const [isSubmitted, setIsSubmitted] = useState(true);

  console.log(data);

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
                  // @ts-expect-error: Suppress type checking for isCorrect
                  const isCorrect = key === item.correctAnswer;
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
        </div>
      )}
    </div>
  );
}
