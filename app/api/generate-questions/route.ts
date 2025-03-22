import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { z } from "zod"

// Define schema for a single quiz question
const QuizQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number().int(),
})

// Define schema for the complete quiz
const QuizSchema = z.object({
  questions: z.array(QuizQuestion),
})

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { content, url } = await request.json()

    if (!content || !url) {
      return NextResponse.json({ error: "Content and URL are required" }, { status: 400 })
    }

    // Truncate content if it's too long
    const truncatedContent = content.length > 10000 ? content.substring(0, 10000) + "..." : content

    // Generate questions using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert quiz creator. Create multiple-choice questions based on the provided content.
          Each question should have exactly 3 options. Make sure the questions test understanding, not just memorization.
          Ensure the incorrect options are plausible but clearly wrong to someone who understands the content.`,
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
          
          The correctAnswer should be the index (0, 1, or 2) of the correct option.`,
        },
      ],
    })

    const result = response.choices[0]?.message?.content

    if (!result) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 })
    }

    try {
      // Parse and validate the response
      const parsedResult = JSON.parse(result)
      const validatedResult = QuizSchema.parse(parsedResult)

      return NextResponse.json(validatedResult)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)

      // Fallback: Try to extract JSON using regex
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const extractedJson = jsonMatch[0]

        const parsedResult = JSON.parse(extractedJson)
        const validatedResult = QuizSchema.parse(parsedResult)

        return NextResponse.json(validatedResult)
      }

      return NextResponse.json(
        {
          error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: `Failed to generate questions: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

