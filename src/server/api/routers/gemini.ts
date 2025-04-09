// server/api/routers/gemini.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { runGeminiPrompt } from "~/utils/gemini";

export const geminiRouter = createTRPCRouter({
  ask: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const response = await runGeminiPrompt(input.prompt);
      return { response };
    }),
});
