import React from "react";
import { auth } from "~/server/auth";
import GeminiChat from "./_components/GeminiChat";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
        Mock Quiz
      </h2>
      <p>Enter a topic you want to practice</p>
      <div className="text-center">
        {session?.user ? (
          <GeminiChat />
        ) : (
          <p className="text-gray-600">Please sign in to write the quiz</p>
        )}
      </div>
    </div>
  );
}
