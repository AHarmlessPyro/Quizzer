import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Question } from "@/types/quiz"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, X, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizComponentProps {
  quizId: string
  questions: Question[]
  sourceUrl: string
}

export function QuizComponent({ quizId, questions, sourceUrl }: QuizComponentProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [lives, setLives] = useState(5)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / questions.length) * 100

  const checkAnswer = () => {
    if (selectedOptionIndex === null) return

    const correct = selectedOptionIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setIsAnswerChecked(true)

    if (!correct) {
      setLives((prev) => Math.max(0, prev - 1))
    } else {
      setScore((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    setSelectedOptionIndex(null)
    setIsAnswerChecked(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setQuizComplete(true)
    }
  }

  useEffect(() => {
    if (lives === 0) {
      setQuizComplete(true)
    }
  }, [lives])

  if (quizComplete) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={() => router.push("/")} className="text-gray-400">
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-1">
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            <span className="text-xl font-bold">{lives}</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md text-center space-y-6">
            <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            <p className="text-xl">
              Your score: {score} / {questions.length}
            </p>

            <div className="p-6 bg-gray-800 rounded-lg">
              {lives > 0 ? (
                <p className="text-green-400 text-xl font-bold">Great job! 🎉</p>
              ) : (
                <p className="text-red-400 text-xl font-bold">Better luck next time!</p>
              )}
            </div>

            <Button
              onClick={() => router.push("/")}
              className="w-full bg-[#58cc02] hover:bg-[#46a302] text-black font-bold py-3 rounded-xl"
            >
              Create New Quiz
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => router.push("/")} className="text-gray-400">
          <X className="h-6 w-6" />
        </button>
        <Progress value={progress} className="h-3 w-full max-w-xs mx-4 bg-gray-700" />
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 fill-red-500 text-red-500" />
          <span className="text-xl font-bold">{lives}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {currentQuestion.question.includes("mean") ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button className="bg-blue-500 rounded-full p-2">
                  <Volume2 className="h-5 w-5 text-white" />
                </button>
                <div>{currentQuestion.question.replace("What does", "").replace("mean?", "").trim()}</div>
              </div>
              <h2 className="text-xl font-bold">
                What does {currentQuestion.question.replace("What does", "").replace("mean?", "").trim()} mean?
              </h2>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button className="bg-blue-500 rounded-full p-2">
                  <Volume2 className="h-5 w-5 text-white" />
                </button>
                <div>{currentQuestion.question}</div>
              </div>
            </>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isAnswerChecked && setSelectedOptionIndex(index)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border border-gray-700 transition-colors",
                  selectedOptionIndex === index && !isAnswerChecked && "border-blue-500 bg-blue-900/20",
                  isAnswerChecked && index === currentQuestion.correctAnswer && "border-green-500 bg-green-900/20",
                  isAnswerChecked &&
                    selectedOptionIndex === index &&
                    index !== currentQuestion.correctAnswer &&
                    "border-red-500 bg-red-900/20",
                )}
                disabled={isAnswerChecked}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-700 text-sm">
                    {index + 1}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {isAnswerChecked && currentQuestion.explanation && (
            <div className="p-4 bg-gray-800 rounded-lg text-sm">
              <p className="font-bold mb-1">Explanation:</p>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={() => router.push("/")} variant="outline" className="border-gray-700 text-gray-400">
              Skip
            </Button>

            {isAnswerChecked ? (
              <Button
                onClick={nextQuestion}
                className="bg-[#58cc02] hover:bg-[#46a302] text-black font-bold py-3 px-8 rounded-xl"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={checkAnswer}
                disabled={selectedOptionIndex === null}
                className={cn(
                  "py-3 px-8 rounded-xl font-bold",
                  selectedOptionIndex !== null
                    ? "bg-[#58cc02] hover:bg-[#46a302] text-black"
                    : "bg-gray-700 text-gray-500",
                )}
              >
                Check
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

