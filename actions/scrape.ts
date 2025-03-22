"use server";

import { Hyperbrowser } from "@hyperbrowser/sdk";
import { kv } from "@vercel/kv";
import { createHash } from "crypto";
import { generateQuestions } from "./generate-questions";

// Set maximum duration for this server action (60 seconds)
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Creates a hash from a URL after removing query and search parameters
 */
function getUrlHash(url: string): string {
  try {
    // Parse the URL and remove query parameters
    const parsedUrl = new URL(url);
    parsedUrl.search = "";
    parsedUrl.hash = "";
    const cleanUrl = parsedUrl.host + parsedUrl.pathname;

    // Create a hash of the clean URL
    return createHash("sha256").update(cleanUrl).digest("hex").substring(0, 10);
  } catch (error) {
    // If URL parsing fails, hash the original URL
    return createHash("sha256").update(url).digest("hex").substring(0, 10);
  }
}

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

      // Generate a hash of the URL as the quiz ID
      const quizId = getUrlHash(url);

      // Store questions in KV store with the URL hash
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

export default scrapeWebsite;
