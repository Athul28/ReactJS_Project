// components/GeminiChat.tsx
"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import Quiz from "./Quiz";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [data, setData] = useState<
    | {
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
    | { error: string }
    | { error: string; raw: string }
  >();

  const mutation = api.gemini.ask.useMutation({
    onSuccess: (data) => {
      setResponse(
        typeof data.response === "string"
          ? data.response
          : JSON.stringify(data.response),
      );
      setData(data.response);
      console.log(data.response);
    },
  });

  return (
    <div className="p-4">
      <textarea
        className="w-full rounded border p-2"
        rows={4}
        placeholder="Ask something..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => mutation.mutate({ prompt })}
        disabled={mutation.status === "pending"}
      >
        {mutation.status === "pending" ? "Generating Questions" : "Submit"}
      </button>
      {Array.isArray(data) && data.every((item) => "id" in item) && (
        <Quiz
          data={data}
          setData={setData as React.Dispatch<React.SetStateAction<typeof data>>}
        />
      )}
      {data && "error" in data && (
        <div className="mt-4 text-red-600">
          <p>Error: {data.error}</p>
          {data && "raw" in data && <p>Raw: {data.raw}</p>}
        </div>
      )}
    </div>
  );
}
