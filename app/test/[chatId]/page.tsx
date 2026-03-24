"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  ChevronLeft,
  Clock,
  BookOpen,
  AlertCircle,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface TestData {
  type: string
  topic: string
  summary: string
  difficulty: "easy" | "medium" | "hard"
  questionCount: number
  estimatedMinutes: number
  questions: Question[]
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

const DifficultyBadge = ({ level }: { level: string }) => {
  const map: Record<string, string> = {
    easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    hard: "bg-red-500/15 text-red-400 border-red-500/30",
  }
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${map[level] || map.medium}`}>
      {level}
    </span>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

const ResultsScreen = ({
  questions,
  answers,
  topic,
  onRetry,
}: {
  questions: Question[]
  answers: (number | null)[]
  topic: string
  onRetry: () => void
}) => {
  const router = useRouter()
  const correct = answers.filter((a, i) => a === questions[i].correct).length
  const total = questions.length
  const pct = Math.round((correct / total) * 100)

  const scoreColor =
    pct >= 80 ? "text-emerald-400" : pct >= 60 ? "text-amber-400" : "text-red-400"

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Score card */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-[#2a2a2a] p-8 text-center">
        <Trophy className="mx-auto mb-4 h-10 w-10 text-amber-400" />
        <h2 className="mb-1 text-2xl font-bold text-white">Test Complete!</h2>
        <p className="mb-6 text-sm text-neutral-400">{topic}</p>
        <div className={`text-6xl font-bold ${scoreColor}`}>{pct}%</div>
        <p className="mt-2 text-neutral-400">
          {correct} / {total} correct
        </p>

        {/* Score bar */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-neutral-700">
          <motion.div
            className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          {pct >= 80 ? "🎉 Excellent work!" : pct >= 60 ? "👍 Good effort!" : "📚 Keep studying!"}
        </p>
      </div>

      {/* Action buttons */}
      <div className="mb-8 flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#2a2a2a] px-5 py-3 text-sm font-medium text-neutral-200 hover:bg-white/8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Chat
        </button>
        <button
          onClick={onRetry}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Retry Test
        </button>
      </div>

      {/* Question breakdown */}
      <h3 className="mb-4 text-sm font-semibold text-neutral-400">Question Breakdown</h3>
      <div className="space-y-3">
        {questions.map((q, i) => {
          const userAnswer = answers[i]
          const isCorrect = userAnswer === q.correct
          return (
            <div
              key={q.id}
              className={`rounded-xl border p-4 ${
                isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200">{q.question}</p>
                  {!isCorrect && userAnswer !== null && (
                    <p className="mt-1 text-xs text-red-400">
                      Your answer: {q.options[userAnswer]}
                    </p>
                  )}
                  {userAnswer === null && (
                    <p className="mt-1 text-xs text-neutral-500">Skipped</p>
                  )}
                  <p className="mt-1 text-xs text-emerald-400">
                    Correct: {q.options[q.correct]}
                  </p>
                  <p className="mt-1.5 text-xs text-neutral-500">{q.explanation}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const [testData, setTestData] = useState<TestData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  // Load test data from sessionStorage
  useEffect(() => {
    const key = `test_${params.chatId}`
    const raw = sessionStorage.getItem(key)
    if (!raw) {
      setError("Test data not found. Please go back and generate the test again.")
      return
    }
    try {
      const data = JSON.parse(raw)
      setTestData(data)
      setAnswers(new Array(data.questions.length).fill(null))
    } catch {
      setError("Failed to load test data.")
    }
  }, [params.chatId])

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleSelect = (optionIdx: number) => {
    if (showFeedback) return
    setSelectedOption(optionIdx)
    setShowFeedback(true)
    const newAnswers = [...answers]
    newAnswers[currentQ] = optionIdx
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQ < (testData?.questions.length ?? 0) - 1) {
      setCurrentQ((q) => q + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    } else {
      setFinished(true)
    }
  }

  const handleRetry = () => {
    if (!testData) return
    setCurrentQ(0)
    setAnswers(new Array(testData.questions.length).fill(null))
    setSelectedOption(null)
    setShowFeedback(false)
    setFinished(false)
  }

  // ── Error state ──────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#212121] p-6 text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
        <p className="mb-6 text-neutral-300">{error}</p>
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 bg-[#2a2a2a] px-6 py-2.5 text-sm font-medium text-neutral-200 hover:bg-white/8"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!testData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#212121]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  // ── Results screen ───────────────────────────────────────────────────────

  if (finished) {
    return (
      <div className="min-h-screen overflow-y-auto bg-[#212121] text-neutral-100">
        <nav className="flex h-14 items-center border-b border-white/8 px-6">
          <span className="text-sm font-medium text-neutral-400">{testData.topic} — Results</span>
        </nav>
        <ResultsScreen
          questions={testData.questions}
          answers={answers}
          topic={testData.topic}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  // ── Quiz view ────────────────────────────────────────────────────────────

  const q = testData.questions[currentQ]
  const progress = ((currentQ + (showFeedback ? 1 : 0)) / testData.questions.length) * 100
  const isCorrect = selectedOption === q.correct

  return (
    <div className="flex min-h-screen flex-col bg-[#212121] text-neutral-100">
      <nav className="flex h-14 items-center justify-between border-b border-white/8 px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Exit
        </button>
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {currentQ + 1} / {testData.questions.length}
          </span>
          <DifficultyBadge level={testData.difficulty} />
        </div>
      </nav>

      <div className="h-1 w-full bg-neutral-800">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl"
          >
            <div className="mb-8">
              <p className="mb-1 text-xs text-neutral-500">Question {currentQ + 1}</p>
              <h2 className="text-xl font-semibold leading-snug text-white">{q.question}</h2>
            </div>
            
            <div className="space-y-3">
              {q.options.map((option, idx) => {
                let style = "border-white/10 bg-[#2a2a2a] text-neutral-200 hover:border-white/25 hover:bg-white/8"
                if (showFeedback) {
                  if (idx === q.correct) {
                    style = "border-emerald-500/50 bg-emerald-500/12 text-emerald-200"
                  } else if (idx === selectedOption && idx !== q.correct) {
                    style = "border-red-500/50 bg-red-500/12 text-red-200"
                  } else {
                    style = "border-white/5 bg-[#2a2a2a] text-neutral-500 opacity-50"
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showFeedback}
                    className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left text-sm font-medium transition-all ${style}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showFeedback && idx === q.correct && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                    {showFeedback && idx === selectedOption && idx !== q.correct && (
                      <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                    )}
                  </button>
                )
              })}
            </div>

   
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div
                    className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                      isCorrect
                        ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-300"
                        : "border-red-500/25 bg-red-500/8 text-red-300"
                    }`}
                  >
                    <p className="mb-0.5 font-medium">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</p>
                    <p className="text-xs opacity-80">{q.explanation}</p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
                  >
                    {currentQ < testData.questions.length - 1 ? (
                      <>Next Question <ArrowRight className="h-4 w-4" /></>
                    ) : (
                      <>See Results <Trophy className="h-4 w-4" /></>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
