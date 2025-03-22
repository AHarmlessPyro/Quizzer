"use server"

import { Hyperbrowser } from "@hyperbrowser/sdk"
import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"

export async function scrapeWebsite(url: string) {
  try {
    // Initialize Hyperbrowser client
    const client = new Hyperbrowser({
      apiKey: process.env.HYPERBROWSER_API_KEY,
    })

    // Scrape the website
    const scrapeResult = await client.scrape.startAndWait({
      url,
      scrapeOptions: {
        formats: ["markdown"],
        onlyMainContent: true,
      },
    })

    if (!scrapeResult.data?.markdown) {
      throw new Error("Failed to scrape website content")
    }

    console.log("Successfully scraped website, generating questions...")

    try {
      // Determine the base URL for the API
      // In development, use localhost
      // In production, use the absolute URL with the VERCEL_URL environment variable
      const baseUrl =
        process.env.NODE_ENV === "production" && process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"

      const apiUrl = `${baseUrl}/api/generate-questions`

      console.log(`Calling API at: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: scrapeResult.data.markdown,
          url,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      const questions = data.questions

      if (!questions || questions.length === 0) {
        throw new Error("Failed to generate questions from content")
      }

      console.log(`Successfully generated ${questions.length} questions`)

      // Store questions in KV store with a unique ID
      const quizId = nanoid()
      await kv.set(`quiz:${quizId}`, {
        url,
        questions,
        createdAt: new Date().toISOString(),
      })

      return quizId
    } catch (questionError) {
      console.error("Error generating questions:", questionError)
      throw new Error(
        `Failed to generate questions: ${questionError instanceof Error ? questionError.message : String(questionError)}`,
      )
    }
  } catch (error) {
    console.error("Error in scrapeWebsite:", error)
    throw new Error(
      `Failed to scrape website and generate quiz: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

