import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111b21] text-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold">404 - Not Found</h1>
        <p className="text-gray-400">The quiz you're looking for doesn't exist or has expired.</p>

        <Button asChild className="bg-[#58cc02] hover:bg-[#46a302] text-black font-bold py-3 rounded-xl">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}

