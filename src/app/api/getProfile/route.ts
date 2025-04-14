import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  const profile = await db.user.findFirst({
    where: { email },
    include: { quizzes: true },
  });
  if (profile) {
    return NextResponse.json(profile);
  } else {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
