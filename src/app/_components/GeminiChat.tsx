// components/GeminiChat.tsx
"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import Quiz from "./Quiz";
import { useSession } from "next-auth/react";
import type { Question } from "~/lib/types";

export default function GeminiChat() {
  const { data: session, status } = useSession();

  const [prompt, setPrompt] = useState("");
  const [score, setScore] = useState(0);
  const [response, setResponse] = useState("");
  const [data, setData] = useState<Question[]>([]);

  const mutation = api.gemini.ask.useMutation({
    onSuccess: (data) => {
      setResponse(
        typeof data.response === "string"
          ? data.response
          : JSON.stringify(data.response),
      );
      if (Array.isArray(data.response)) {
        setData(data.response);
      } else {
        console.error("Unexpected response format:", data.response);
      }
      console.log(data.response);
    },
  });

  const submitQuiz = async () => {
    const res = await fetch("/api/submitQuiz", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user.email,
        title: prompt,
        score: score,
        questions: data,
      }),
    });
    const resData = await res.json();
    console.log(resData);
  };

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
          setScore={setScore}
          submitQuiz={submitQuiz}
          setData={setData}
        />
      )}
    </div>
  );
}
