import { NextResponse } from "next/server";
import prisma from "~/server/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
  }
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });
  return NextResponse.json(quiz);
}
