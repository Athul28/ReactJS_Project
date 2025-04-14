import { NextResponse } from "next/server";
import prisma from "~/server/prisma";
import type { Question } from "~/lib/types";

interface RequestBody {
  questions: Question[];
  email: string;
  title: string;
  score: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user?.id) {
      console.error("User  not found or user ID is undefined");
      return NextResponse.json({ error: "User  not found" }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        userId: user.id,
        score: body.score,
      },
    });

    for (const question of body.questions) {
      console.log(question);
      await prisma.question.create({
        data: {
          question: question.question,
          option1: question.options.option1,
          option2: question.options.option2,
          option3: question.options.option3,
          option4: question.options.option4,
          correctAnswer: question.answer,
          selectedAnswer: question.selectedAnswer,
          explanation:question.explanation,
          Quiz: {
            connect: {
              id: quiz.id,
            },
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Questions submitted successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting question:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
