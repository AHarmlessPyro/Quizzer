"use server";

import { Hyperbrowser } from "@hyperbrowser/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import { generateQuestions } from "./generate-questions";

export async function scrapeWebsite(url: string) {
  try {
    console.log("1. Scraping website...");
    // Initialize Hyperbrowser client
    const client = new Hyperbrowser({
      apiKey: process.env.HYPERBROWSER_API_KEY,
    });
    console.log("2. Created Hyperbrowser client");
    // Scrape the website
    const scrapeResult = await client.scrape.startAndWait({
      url,
      scrapeOptions: {
        formats: ["markdown"],
        onlyMainContent: true,
      },
    });

    console.log(
      `3. Scraped website ${url} => length: ${scrapeResult.data?.markdown?.length}`
    );

    if (!scrapeResult.data?.markdown) {
      throw new Error("Failed to scrape website content");
    }

    console.log("Successfully scraped website, generating questions...");

    try {
      // Call the generateQuestions server action directly
      const data = await generateQuestions(scrapeResult.data.markdown, url);

      console.log("Generated questions:", data);
      const questions = data.questions;

      if (!questions || questions.length === 0) {
        throw new Error("Failed to generate questions from content");
      }

      console.log(`Successfully generated ${questions.length} questions`);

      console.log("Storing questions in KV store...");

      // Store questions in KV store with a unique ID
      const quizId = nanoid();
      await kv.set(`quiz:${quizId}`, {
        url,
        questions,
        createdAt: new Date().toISOString(),
      });

      console.log("Questions stored in KV store:", quizId);

      return quizId;
    } catch (questionError) {
      console.error("Error generating questions:", questionError);
      throw new Error(
        `Failed to generate questions: ${
          questionError instanceof Error
            ? questionError.message
            : String(questionError)
        }`
      );
    }
  } catch (error) {
    console.error("Error in scrapeWebsite:", error);
    throw new Error(
      `Failed to scrape website and generate quiz: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
