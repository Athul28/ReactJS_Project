// utils/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function runGeminiPrompt(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }); // ✅ model prefix added

  const updatedPrompt = `
You are an intelligent assistant for an e-learning platform.

Your task is to generate **10 multiple-choice questions** based on the topic: "${prompt}"

Return only a JSON array in the following format:

[
  {
    "id": 1,
    "question": "What is ...?",
    "options": {
      "option1": "Choice A",
      "option2": "Choice B",
      "option3": "Choice C",
      "option4": "Choice D"
    },
    "answer": "option2"
  },
  ...
]

- The questions should be relevant to the topic.
- Return only valid JSON. No explanations, no markdown, no code blocks.
- Do not include any explanations or extra text.
- Each question should contain exactly 4 options
- If the topic is unrelated to education or too vague, return this JSON instead:

{ "error": "Irrelevant topic" }
`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: updatedPrompt }],
      },
    ],
  });

  const response = result.response;
  let text = response.text();

  // ✅ Remove triple backticks and trim
  text = text.replace(/```(?:json)?/g, "").trim();
  try {
    return JSON.parse(text) as
      | {
          id: number;
          question: string;
          options: {
            option1: string;
            option2: string;
            option3: string;
            option4: string;
          };
          answer: string;
        }[]
      | { error: string };
  } catch (e) {
    return { error: "Invalid JSON returned by Gemini", raw: text };
  }
}
