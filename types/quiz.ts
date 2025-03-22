export interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Quiz {
  questions: Question[]
}

