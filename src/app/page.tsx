import React from "react";
import { auth } from "~/server/auth";
import GeminiChat from "./_components/GeminiChat";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h2>Mock Quiz</h2>
      <div>
        {session?.user ? (
          <GeminiChat />
        ) : (
          <p>Please sign in to write the quiz</p>
        )}
      </div>
    </div>
  );
}
