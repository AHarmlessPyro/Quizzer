import { ScrapeForm } from "@/components/scrape-form";
import { Heart } from "lucide-react";

export const maxDuration = 60;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#111b21] text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">WebQuiz</h1>
        <div className="flex items-center gap-1">
          <Heart className="h-6 w-6 fill-red-500 text-red-500" />
          <span className="text-xl font-bold">5</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Learn from any website</h2>
            <p className="text-gray-400">
              Enter a URL below to create a quiz from its content
            </p>
          </div>

          <ScrapeForm />

          <div className="text-center text-sm text-gray-500">
            <p>Powered by Hyperbrowser and OpenAI</p>
          </div>
        </div>
      </main>
    </div>
  );
}
