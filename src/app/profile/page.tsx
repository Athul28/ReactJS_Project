"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import type { Quizzes } from "~/lib/types";

export default function Profile() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);

  const getProfile = async () => {
    const res = await fetch(`/api/getProfile?email=${session?.user.email}`);
    const data = (await res.json()) as { quizzes: Quizzes[] };
    console.log(data);
    if (res.ok) {
      setLoading(false);
      setQuizzes(data.quizzes);
    }
  };

  useEffect(() => {
    if (session?.user) {
      void getProfile();
    }
  }, [session]);

  if (status === "unauthenticated") {
    return <div>Please sign in to continue</div>;
  }

  if (status === "loading" || loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg p-6 shadow-md">
      <div className="text-center">
        <Image
          src={session?.user.image ?? ""}
          alt="Profile Picture"
          height={200}
          width={200}
          className="mx-auto rounded-full border-4 border-blue-500"
        />
        <h2 className="mt-4 text-2xl font-bold">{session?.user.name}</h2>
        <p className="text-gray-600">{session?.user.email}</p>
      </div>
      {/* <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold">Total Score</h3>
        <p className="text-2xl font-bold text-blue-600">
          {quizzes.reduce((total, quiz) => total + quiz.score, 0)}
        </p>
      </div> */}
      <hr className="mt-4" />
      <div className="mt-8">
        <h1 className="mb-4 text-center text-xl font-semibold">
          Attempted Quizzes
        </h1>
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz, i) => (
              <div
                key={i}
                className="transform rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  {quiz.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Score:{" "}
                  <span className="font-bold text-blue-600">{quiz.score}</span>
                </p>
                <a
                  href={`/quiz/${quiz.id}`}
                  className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  View Quiz
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No quizzes attempted yet.</p>
        )}
      </div>
    </div>
  );
}
