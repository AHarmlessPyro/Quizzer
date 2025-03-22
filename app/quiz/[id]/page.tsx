import { kv } from "@vercel/kv"
import { notFound } from "next/navigation"
import { QuizComponent } from "@/components/quiz-component"
import type { Question } from "@/types/quiz"

interface QuizData {
  url: string
  questions: Question[]
  createdAt: string
}

export default async function QuizPage({ params }: { params: { id: string } }) {
  const quizData = await kv.get<QuizData>(`quiz:${params.id}`)

  if (!quizData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#111b21] text-white">
      <QuizComponent quizId={params.id} questions={quizData.questions} sourceUrl={quizData.url} />
    </div>
  )
}

