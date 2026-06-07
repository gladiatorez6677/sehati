"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Brain, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface StressAssessment {
  id: string
  levelStress: number
  gejala: string | null
  pemicu: string | null
  copingStrategy: string | null
  rekomendasi: string | null
  tanggalPenilaian: string
}

const stressQuestions = [
  {
    id: 1,
    question: "Seberapa sering Anda merasa kewalahan dengan pekerjaan atau tanggung jawab?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Sering" },
      { value: 4, label: "Sangat sering" },
    ]
  },
  {
    id: 2,
    question: "Seberapa sering Anda mengalami kesulitan tidur karena pikiran yang mengganggu?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Sering" },
      { value: 4, label: "Sangat sering" },
    ]
  },
  {
    id: 3,
    question: "Seberapa sering Anda merasa mudah marah atau frustasi?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Sering" },
      { value: 4, label: "Sangat sering" },
    ]
  },
  {
    id: 4,
    question: "Seberapa sering Anda merasa sulit untuk berkonsentrasi?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Sering" },
      { value: 4, label: "Sangat sering" },
    ]
  },
  {
    id: 5,
    question: "Seberapa sering Anda merasa cemas atau khawatir berlebihan?",
    options: [
      { value: 0, label: "Tidak pernah" },
      { value: 1, label: "Jarang" },
      { value: 2, label: "Kadang-kadang" },
      { value: 3, label: "Sering" },
      { value: 4, label: "Sangat sering" },
    ]
  }
]

export default function ManajemenStressPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [assessments, setAssessments] = useState<StressAssessment[]>([])
  const [gejala, setGejala] = useState("")
  const [pemicu, setPemicu] = useState("")

  useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/manajemen-stress")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
    }
  }

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value })
    
    if (currentQuestion < stressQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const calculateStressLevel = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
    const maxScore = stressQuestions.length * 4
    return Math.round((totalScore / maxScore) * 10)
  }

  const getStressCategory = (level: number) => {
    if (level <= 2) return { text: "Rendah", color: "text-green-600 bg-green-50" }
    if (level <= 4) return { text: "Normal", color: "text-blue-600 bg-blue-50" }
    if (level <= 6) return { text: "Sedang", color: "text-yellow-600 bg-yellow-50" }
    if (level <= 8) return { text: "Tinggi", color: "text-orange-600 bg-orange-50" }
    return { text: "Sangat Tinggi", color: "text-red-600 bg-red-50" }
  }

  const getRecommendations = (level: number) => {
    if (level <= 2) {
      return "Tingkat stress Anda rendah. Pertahankan gaya hidup sehat dan terus lakukan aktivitas yang membuat Anda rileks."
    } else if (level <= 4) {
      return "Tingkat stress Anda normal. Tetap jaga keseimbangan hidup dengan olahraga teratur dan istirahat cukup."
    } else if (level <= 6) {
      return "Tingkat stress Anda sedang. Cobalah teknik relaksasi seperti meditasi atau yoga. Atur waktu istirahat dengan baik."
    } else if (level <= 8) {
      return "Tingkat stress Anda tinggi. Pertimbangkan untuk berbicara dengan teman/keluarga. Gunakan fitur relaksasi kami secara rutin."
    } else {
      return "Tingkat stress Anda sangat tinggi. Sangat disarankan untuk berkonsultasi dengan psikolog atau konselor profesional."
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const stressLevel = calculateStressLevel()
    const rekomendasi = getRecommendations(stressLevel)

    try {
      const response = await fetch("/api/manajemen-stress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          levelStress: stressLevel,
          gejala: gejala || null,
          pemicu: pemicu || null,
          rekomendasi,
        }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Penilaian stress berhasil disimpan",
        })
        fetchAssessments()
        resetAssessment()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan penilaian",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setGejala("")
    setPemicu("")
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-500" />
          Manajemen Stress
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Evaluasi dan kelola tingkat stress Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Penilaian Tingkat Stress</CardTitle>
              <CardDescription>
                Jawab pertanyaan berikut untuk mengetahui tingkat stress Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResult ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Pertanyaan {currentQuestion + 1} dari {stressQuestions.length}
                    </span>
                    <Progress
                      value={((currentQuestion + 1) / stressQuestions.length) * 100}
                      className="w-32"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">
                      {stressQuestions[currentQuestion].question}
                    </h3>
                    <RadioGroup
                      value={answers[currentQuestion]?.toString()}
                      onValueChange={(value) => handleAnswer(parseInt(value))}
                    >
                      {stressQuestions[currentQuestion].options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`option-${option.value}`}
                          />
                          <Label
                            htmlFor={`option-${option.value}`}
                            className="cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="text-6xl font-bold text-primary mb-2">
                        {calculateStressLevel()}/10
                      </div>
                      <Badge
                        className={`${getStressCategory(calculateStressLevel()).color}`}
                        variant="secondary"
                      >
                        Stress {getStressCategory(calculateStressLevel()).text}
                      </Badge>
                    </div>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {getRecommendations(calculateStressLevel())}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gejala">
                        Gejala yang Anda rasakan (opsional)
                      </Label>
                      <Textarea
                        id="gejala"
                        placeholder="Contoh: sakit kepala, sulit tidur, mudah lelah..."
                        value={gejala}
                        onChange={(e) => setGejala(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pemicu">
                        Pemicu stress (opsional)
                      </Label>
                      <Textarea
                        id="pemicu"
                        placeholder="Contoh: pekerjaan, keluarga, keuangan..."
                        value={pemicu}
                        onChange={(e) => setPemicu(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={resetAssessment}
                      className="flex-1"
                    >
                      Ulangi Penilaian
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Hasil"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History & Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Penilaian</CardTitle>
            </CardHeader>
            <CardContent>
              {assessments.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada riwayat penilaian</p>
              ) : (
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Level: {assessment.levelStress}/10
                        </span>
                        <Badge
                          className={`${
                            getStressCategory(assessment.levelStress).color
                          } text-xs`}
                          variant="secondary"
                        >
                          {getStressCategory(assessment.levelStress).text}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(assessment.tanggalPenilaian),
                          "dd MMM yyyy",
                          { locale: id }
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips Mengelola Stress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm">
                  Lakukan olahraga ringan 30 menit sehari
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm">
                  Tidur 7-8 jam setiap malam
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm">
                  Praktikkan teknik pernapasan dalam
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm">
                  Batasi konsumsi kafein
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className="text-sm">
                  Luangkan waktu untuk hobi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}