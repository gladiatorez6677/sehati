"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  AlertCircle,
  Loader2,
  Plus,
  History,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Consultation {
  id: string
  topik: string
  messages: Message[]
  status: string
  createdAt: string
  updatedAt: string
}

export default function KonsultasiPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showNewConsultationDialog, setShowNewConsultationDialog] = useState(false)
  const [consultationTopic, setConsultationTopic] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchConsultations()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/konsultasi")
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
    }
  }

  const startNewConsultation = async () => {
    if (!consultationTopic.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/konsultasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topik: consultationTopic }),
      })

      if (response.ok) {
        const newConsultation = await response.json()
        setActiveConsultation(newConsultation)
        setMessages([])
        toast({
          title: "Konsultasi Dimulai",
          description: `Topik: ${consultationTopic}`,
        })
        fetchConsultations()
        setShowNewConsultationDialog(false)
        setConsultationTopic("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memulai konsultasi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadConsultation = (consultation: Consultation) => {
    setActiveConsultation(consultation)
    setMessages(consultation.messages || [])
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConsultation || isSending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsSending(true)

    try {
      const response = await fetch(`/api/konsultasi/${activeConsultation.id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          messages: [...messages, userMessage],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        
        // Reload consultation to get updated data
        fetchConsultations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const closeConsultation = async () => {
    if (!activeConsultation) return

    try {
      const response = await fetch(`/api/konsultasi/${activeConsultation.id}/close`, {
        method: "PUT",
      })

      if (response.ok) {
        toast({
          title: "Konsultasi Ditutup",
          description: "Konsultasi telah selesai",
        })
        setActiveConsultation(null)
        setMessages([])
        fetchConsultations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menutup konsultasi",
        variant: "destructive",
      })
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          Konsultasi AI Kesehatan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Konsultasi kesehatan dengan asisten AI kami 24/7
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Consultation History */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Riwayat
                </span>
                <Button
                  size="sm"
                  onClick={() => setShowNewConsultationDialog(true)}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px] px-4">
                {consultations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    Belum ada konsultasi
                  </p>
                ) : (
                  <div className="space-y-2 pb-4">
                    {consultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={() => loadConsultation(consultation)}
                        className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          activeConsultation?.id === consultation.id
                            ? "bg-primary/10 border-primary"
                            : ""
                        }`}
                      >
                        <p className="font-medium text-sm line-clamp-1">
                          {consultation.topik}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(consultation.createdAt), "d MMM yyyy HH:mm", {
                            locale: id,
                          })}
                        </p>
                        <Badge
                          variant={consultation.status === "ACTIVE" ? "default" : "secondary"}
                          className="mt-1 text-xs"
                        >
                          {consultation.status === "ACTIVE" ? "Aktif" : "Selesai"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {activeConsultation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">
                        {activeConsultation.topik}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Asisten AI siap membantu Anda
                      </CardDescription>
                    </div>
                    {activeConsultation.status === "ACTIVE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={closeConsultation}
                      >
                        Selesai
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">
                          Mulai percakapan dengan mengirim pesan
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.role === "user" ? "justify-end" : ""
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.content}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.role === "user"
                                    ? "text-primary-foreground/70"
                                    : "text-gray-500"
                                }`}
                              >
                                {format(message.timestamp, "HH:mm")}
                              </p>
                            </div>
                            {message.role === "user" && (
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isSending && (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          </div>
                        )}
                        <div ref={scrollRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                {activeConsultation.status === "ACTIVE" && (
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan Anda..."
                        disabled={isSending}
                      />
                      <Button onClick={sendMessage} disabled={!input.trim() || isSending}>
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Mulai Konsultasi Baru
                  </h3>
                  <p className="text-gray-500 mb-4 max-w-sm">
                    Klik tombol di bawah untuk memulai konsultasi kesehatan dengan AI
                  </p>
                  <Button onClick={() => setShowNewConsultationDialog(true)} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memulai...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Konsultasi Baru
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Disclaimer:</p>
              <p>
                Konsultasi AI ini hanya untuk informasi umum dan tidak menggantikan
                konsultasi dengan dokter atau tenaga kesehatan profesional. Selalu
                konsultasikan masalah kesehatan Anda dengan dokter.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Consultation Dialog */}
      <Dialog open={showNewConsultationDialog} onOpenChange={setShowNewConsultationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mulai Konsultasi Baru</DialogTitle>
            <DialogDescription>
              Masukkan topik konsultasi kesehatan yang ingin Anda diskusikan dengan AI
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Topik Konsultasi</Label>
              <Textarea
                id="topic"
                placeholder="Contoh: Sakit kepala berulang, Tips menjaga kesehatan jantung, Pola makan sehat..."
                value={consultationTopic}
                onChange={(e) => setConsultationTopic(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewConsultationDialog(false)
                setConsultationTopic("")
              }}
            >
              Batal
            </Button>
            <Button
              onClick={startNewConsultation}
              disabled={!consultationTopic.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memulai...
                </>
              ) : (
                "Mulai Konsultasi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}