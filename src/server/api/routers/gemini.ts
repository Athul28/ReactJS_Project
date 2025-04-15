// server/api/routers/gemini.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { runGeminiPrompt } from "~/utils/gemini";
import { getLearningResources } from "~/utils/geminiResources";
import type { Question } from "~/lib/types";
const questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  options: z.object({
    option1: z.string(),
    option2: z.string(),
    option3: z.string(),
    option4: z.string(),
  }),
  answer: z.string(),
  selectedAnswer: z.string().optional(),
  explanation: z.string(),
});

export const geminiRouter = createTRPCRouter({
  ask: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const response = await runGeminiPrompt(input.prompt);
      return { response };
    }),

  getRecommendation: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        questions: z.array(questionSchema),
      }),
    )
    .mutation(async ({ input }) => {
      const { title, questions } = input;
      const response = await getLearningResources(title, questions);
      return { response };
    }),
});
