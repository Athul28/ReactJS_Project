"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import Quiz from "./Quiz";
import { useSession } from "next-auth/react";
import type { Question } from "~/lib/types";

export default function GeminiChat() {
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [data, setData] = useState<Question[]>([]);
  // const [resources, setResources] = useState<Resources[]>([]);

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

  // const getResourceMutation = api.gemini.getRecommendation.useMutation({
  //   onSuccess: (data) => {
  //     if (Array.isArray(data.response)) {
  //       setResources(data.response);
  //       console.log(data.response);
  //     } else {
  //       console.error("Unexpected response format:", data.response);
  //     }
  //   },
  // });

  const submitQuiz = async (score: number) => {
    const res = await fetch("/api/submitQuiz", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user.email,
        title: prompt,
        score: score,
        questions: data,
      }),
    });
    const resData = (await res.json()) as { success: boolean; message: string };
    console.log(resData);
    // getResourceMutation.mutate({
    //   title: prompt,
    //   questions: data,
    // });
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
        className="mt-2 cursor-pointer rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => {
          setData([]);
          mutation.mutate({ prompt });
        }}
        disabled={mutation.status === "pending"}
      >
        Submit
      </button>
      {mutation.status === "pending" && <p>Generating Questions...</p>}
      {Array.isArray(data) && data.every((item) => "id" in item) && (
        <Quiz data={data} submitQuiz={submitQuiz} setData={setData} />
      )}
    </div>
  );
}
