"use server";

import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { z } from "zod";

// Set maximum duration for this server action (60 seconds)
export const runtime = "nodejs";
export const maxDuration = 60;

// Define schema for a single quiz question
const QuizQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number().int(),
});

// Define schema for the complete quiz
const QuizSchema = z.object({
  questions: z.array(QuizQuestion),
});

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestions(content: string, url: string) {
  try {
    if (!content || !url) {
      throw new Error("Content and URL are required");
    }

    // Truncate content if it's too long
    const truncatedContent =
      content.length > 10000 ? content.substring(0, 10000) + "..." : content;

    const params: ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert quiz creator. Create multiple-choice questions based on the provided content.
            Each question should have exactly 3 options. Make sure the questions test understanding, not just memorization.
            Ensure the incorrect options are plausible but clearly wrong to someone who understands the content.
            Return only valid JSON without any markdown formatting or backticks.`,
        },
        {
          role: "user",
          content: `Based on the following content from ${url}, create 5-12 multiple-choice questions.
            The number of questions should be proportional to the length and complexity of the content.
            
            Content:
            ${truncatedContent}
            
            Return your response as a JSON object with the following structure:
            {
              "questions": [
                {
                  "question": "Question text",
                  "options": ["Option 1", "Option 2", "Option 3"],
                  "correctAnswer": 0
                }
              ]
            }
            
            The correctAnswer should be the index (0, 1, or 2) of the correct option.
            Do not add any markdown formatting, code blocks, or backticks around the JSON.`,
        },
      ],
    };

    console.log("OpenAI params:", params);

    console.log("Calling OpenAI...");

    // Generate questions using OpenAI
    const response = await openai.chat.completions.create(params);

    const result = response.choices[0]?.message?.content;

    if (!result) {
      throw new Error("No response from OpenAI");
    }

    console.log("OpenAI result:", result);

    // Clean the result by removing any markdown code blocks or backticks
    let cleanedResult = result
      .replace(/^```json\s*/gm, "") // Remove opening ```json
      .replace(/^```\s*/gm, "") // Remove opening ```
      .replace(/\s*```$/gm, "") // Remove closing ```
      .trim(); // Trim whitespace

    try {
      console.log("Parsing JSON...");
      // Parse and validate the response
      const parsedResult = JSON.parse(cleanedResult);
      const validatedResult = QuizSchema.parse(parsedResult);

      console.log("Validated result:", validatedResult);

      return validatedResult;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);

      // Fallback: Try to extract JSON using regex
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extractedJson = jsonMatch[0];

        const parsedResult = JSON.parse(extractedJson);
        const validatedResult = QuizSchema.parse(parsedResult);

        return validatedResult;
      }

      throw new Error(
        `Failed to parse JSON response: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error(
      `Failed to generate questions: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
export default generateQuestions;
