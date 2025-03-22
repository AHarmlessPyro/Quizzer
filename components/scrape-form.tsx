"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { scrapeWebsite } from "@/actions/scrape"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function ScrapeForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Add http:// if missing
      let formattedUrl = url
      if (!/^https?:\/\//i.test(url)) {
        formattedUrl = `https://${url}`
      }

      const quizId = await scrapeWebsite(formattedUrl)

      if (!quizId) {
        throw new Error("Failed to generate quiz ID")
      }

      router.push(`/quiz/${quizId}`)
    } catch (err) {
      console.error("Error in form submission:", err)
      setError(err instanceof Error ? err.message : "Failed to scrape website")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Enter website URL (e.g., example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#58cc02] hover:bg-[#46a302] text-black font-bold py-3 rounded-xl"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          "Create Quiz"
        )}
      </Button>
    </form>
  )
}

