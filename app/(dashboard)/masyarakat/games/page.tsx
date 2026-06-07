"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Gamepad,
  Trophy,
  Target,
  Brain,
  Clock,
  Star,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface Game {
  id: string
  nama: string
  deskripsi: string
  kategori: string
  difficulty: string
  pertanyaan: Question[]
}

interface GameScore {
  id: string
  gameId: string
  game: Game
  score: number
  waktuSelesai: number
  achievement: string | null
  createdAt: string
}

export default function GamesEdukasiPage() {
  const [games, setGames] = useState<Game[]>([])
  const [scores, setScores] = useState<GameScore[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGames()
    fetchScores()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data)
      }
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScores = async () => {
    try {
      const response = await fetch("/api/games/scores")
      if (response.ok) {
        const data = await response.json()
        setScores(data)
      }
    } catch (error) {
      console.error("Error fetching scores:", error)
    }
  }

  const startGame = (game: Game) => {
    setSelectedGame(game)
    setCurrentQuestion(0)
    setUserAnswers([])
    setSelectedAnswer("")
    setShowResult(false)
    setStartTime(Date.now())
  }

  const handleAnswer = () => {
    if (!selectedAnswer || !selectedGame) return

    const answer = parseInt(selectedAnswer)
    setUserAnswers([...userAnswers, answer])
    setIsCorrect(answer === selectedGame.pertanyaan[currentQuestion].correctAnswer)
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (!selectedGame) return

    if (currentQuestion < selectedGame.pertanyaan.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowResult(false)
    } else {
      finishGame()
    }
  }

  const finishGame = async () => {
    if (!selectedGame) return

    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === selectedGame.pertanyaan[index].correctAnswer
    ).length

    const score = Math.round((correctAnswers / selectedGame.pertanyaan.length) * 100)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Determine achievement
    let achievement = null
    if (score === 100) {
      achievement = "Perfect Score! 🏆"
    } else if (score >= 80) {
      achievement = "Excellent! ⭐"
    } else if (score >= 60) {
      achievement = "Good Job! 👍"
    }

    try {
      const response = await fetch("/api/games/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: selectedGame.id,
          score,
          waktuSelesai: timeTaken,
          achievement,
        }),
      })

      if (response.ok) {
        toast({
          title: "Game Selesai!",
          description: `Skor Anda: ${score}/100. ${achievement || "Terus berlatih!"}`,
        })
        fetchScores()
        setSelectedGame(null)
      }
    } catch (error) {
      console.error("Error saving score:", error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "MUDAH":
        return "bg-green-100 text-green-700"
      case "SEDANG":
        return "bg-yellow-100 text-yellow-700"
      case "SULIT":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTopScore = (gameId: string) => {
    const gameScores = scores.filter(s => s.gameId === gameId)
    return gameScores.length > 0 
      ? Math.max(...gameScores.map(s => s.score))
      : null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Gamepad className="h-6 w-6 text-orange-500" />
          Games Edukasi Kesehatan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Belajar kesehatan sambil bermain game yang menyenangkan
        </p>
      </div>

      {selectedGame ? (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedGame.nama}</CardTitle>
                  <CardDescription>
                    Pertanyaan {currentQuestion + 1} dari {selectedGame.pertanyaan.length}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGame(null)}
                >
                  Keluar
                </Button>
              </div>
              <Progress
                value={((currentQuestion + 1) / selectedGame.pertanyaan.length) * 100}
                className="mt-4"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {selectedGame.pertanyaan[currentQuestion].question}
                </h3>

                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={setSelectedAnswer}
                  disabled={showResult}
                >
                  {selectedGame.pertanyaan[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                        showResult
                          ? index === selectedGame.pertanyaan[currentQuestion].correctAnswer
                            ? "bg-green-50 dark:bg-green-900/20"
                            : parseInt(selectedAnswer) === index
                            ? "bg-red-50 dark:bg-red-900/20"
                            : ""
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                      {showResult && (
                        <>
                          {index === selectedGame.pertanyaan[currentQuestion].correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {parseInt(selectedAnswer) === index &&
                            index !== selectedGame.pertanyaan[currentQuestion].correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                        </>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {showResult && (
                <div
                  className={`p-4 rounded-lg ${
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700"
                  }`}
                >
                  <p className="font-medium mb-2">
                    {isCorrect ? "Benar! 🎉" : "Belum tepat 😅"}
                  </p>
                  <p className="text-sm">
                    {selectedGame.pertanyaan[currentQuestion].explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                {!showResult ? (
                  <Button
                    onClick={handleAnswer}
                    disabled={!selectedAnswer}
                    className="ml-auto"
                  >
                    Jawab
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="ml-auto">
                    {currentQuestion < selectedGame.pertanyaan.length - 1
                      ? "Pertanyaan Berikutnya"
                      : "Selesai"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Available Games */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pilih Game</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => {
                const topScore = getTopScore(game.id)
                return (
                  <Card
                    key={game.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {game.difficulty}
                        </Badge>
                        <Badge variant="outline">{game.kategori}</Badge>
                      </div>
                      <CardTitle className="text-lg">{game.nama}</CardTitle>
                      <CardDescription>{game.deskripsi}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Brain className="h-4 w-4" />
                            {game.pertanyaan.length} Pertanyaan
                          </span>
                          {topScore !== null && (
                            <span className="flex items-center gap-1 text-primary">
                              <Trophy className="h-4 w-4" />
                              Best: {topScore}%
                            </span>
                          )}
                        </div>
                        <Button onClick={() => startGame(game)} className="w-full">
                          Mulai Game
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Score History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Riwayat Skor</h2>
            <Card>
              <CardContent className="pt-6">
                {scores.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Belum ada riwayat permainan
                  </p>
                ) : (
                  <div className="space-y-3">
                    {scores.slice(0, 10).map((score) => (
                      <div
                        key={score.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{score.game.nama}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(score.createdAt), "dd MMM yyyy HH:mm", {
                              locale: id,
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-lg">{score.score}%</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {Math.floor(score.waktuSelesai / 60)}m {score.waktuSelesai % 60}s
                          </p>
                        </div>
                        {score.achievement && (
                          <Badge className="ml-2">{score.achievement}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}