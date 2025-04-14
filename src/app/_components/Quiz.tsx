import React from "react";

type QuizProps = {
  data: {
    id: number;
    question: string;
    options: {
      option1: string;
      option2: string;
      option3: string;
      option4: string;
    };
    answer: string;
    selectedAnswer?: string;
  }[];
  setData: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        question: string;
        options: {
          option1: string;
          option2: string;
          option3: string;
          option4: string;
        };
        answer: string;
        selectedAnswer?: string;
      }[]
    >
  >;
};

export default function Quiz({ data, setData }: QuizProps) {
  return (
    <div className="text-white">
      {Array.isArray(data) && (
        <div className="mt-4">
          {data.map((item, index) => (
            <div key={item.id} className="mb-2 rounded border bg-black p-5">
              <h3 className="font-bold">
                Question {index + 1}: {item.question}
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {Object.entries(item.options).map(([key, option]) => (
                  <button
                    key={key}
                    className={`rounded border cursor-pointer px-4 py-2 ${
                      item.selectedAnswer === key
                        ? "bg-green-500 text-white"
                        : ""
                    }`}
                    onClick={() => {
                      const selectedAnswer = key;
                      setData((prevData) =>
                        Array.isArray(prevData)
                          ? prevData.map((q) =>
                              q.id === item.id ? { ...q, selectedAnswer } : q,
                            )
                          : prevData,
                      );
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            className="mt-4 rounded bg-green-600 px-4 py-2 text-white cursor-pointer"
            onClick={() => {
              if (Array.isArray(data)) {
                const score = data.reduce((acc, item) => {
                  return acc + (item.selectedAnswer === item.answer ? 1 : 0);
                }, 0);
                alert(`Your score is ${score} out of ${data.length}`);
              }
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}
