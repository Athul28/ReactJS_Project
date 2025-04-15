// utils/analyzeQuizAndGetResources.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Question,Resources } from "~/lib/types";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getLearningResources(
  title: string,
  questions: Question[],
) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

  const wrongQuestions = questions.filter(
    (q) => q.selectedAnswer && q.selectedAnswer !== q.answer,
  );

  if (wrongQuestions.length === 0) {
    return { error: "No mistakes to analyze" };
  }

  const formatted = wrongQuestions
    .map((q, i) => {
      return `
  ${i + 1}.
  Question: ${q.question}
  Options:
    - option1: ${q.options.option1}
    - option2: ${q.options.option2}
    - option3: ${q.options.option3}
    - option4: ${q.options.option4}
  Correct Answer: ${q.answer}
  User Answer: ${q.selectedAnswer}
  Explanation: ${q.explanation}
        `;
    })
    .join("\n\n");

  const prompt = `
  You are an intelligent learning assistant.
  
  A user took a quiz on the topic "${title}" and here are the questions they got wrong:
  
  ${formatted}
  
  Based on their mistakes, analyze the concepts they are struggling with. Then recommend resources to help them improve their understanding.
  
  Return only a valid JSON array in this format:
  
  [
    {
      "topic": "Concept or skill the user lacks",
      "youtube": [
        "https://example.com/resource1",
        "https://example.com/resource2",
        "Optional explanation"
      ],
      "websites": [
        "https://example.com/resource1",
        "https://example.com/resource2"
      ]
    }
  ]
  
  Only return valid JSON. No markdown, no explanation text.
  If there are no mistakes to analyze, return: { "error": "No mistakes to analyze" }
  `;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const response = result.response;
  let text = response.text();
  text = text.replace(/```(?:json)?/g, "").trim();

  try {
    return JSON.parse(text) as Resources[];
  } catch (e) {
    return { error: "Invalid JSON returned by Gemini", raw: text };
  }
}
