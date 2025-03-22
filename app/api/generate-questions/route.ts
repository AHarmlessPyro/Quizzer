import { type NextRequest, NextResponse } from "next/server"
import { generateQuestions } from "@/actions/generate-questions"

export async function POST(request: NextRequest) {
  try {
    const { content, url } = await request.json()

    if (!content || !url) {
      return NextResponse.json({ error: "Content and URL are required" }, { status: 400 })
    }

    try {
      // Use the server action instead of duplicating the OpenAI logic
      const result = await generateQuestions(content, url)
      return NextResponse.json(result)
    } catch (error) {
      console.error("Error generating questions:", error)
      return NextResponse.json(
        { error: `Failed to generate questions: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}

