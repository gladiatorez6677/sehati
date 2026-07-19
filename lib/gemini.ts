import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Get the generative model - model terkini (1.5 sudah usang untuk API key baru).
// Bisa dioverride via env GEMINI_MODEL.
export const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
})

// System prompt for health consultation
export const HEALTH_CONSULTATION_PROMPT = `Anda adalah asisten kesehatan AI yang ramah dan berpengetahuan. Tugas Anda adalah:
1. Memberikan informasi kesehatan yang akurat dan mudah dipahami
2. Selalu mengingatkan bahwa konsultasi ini tidak menggantikan dokter
3. Jika ada gejala serius, sarankan untuk segera ke dokter
4. Berikan jawaban dalam bahasa Indonesia yang sopan
5. Fokus pada pencegahan dan gaya hidup sehat
6. Jangan memberikan diagnosis definitif atau resep obat

Ingat: Anda BUKAN dokter, hanya asisten informasi kesehatan.`

export async function generateHealthResponse(
  message: string, 
  topic: string,
  previousMessages?: any[]
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "⚠️ Fitur AI belum dikonfigurasi. API key Gemini belum diatur — silakan hubungi administrator sistem."
  }
  try {
    // Build conversation history
    let conversationContext = `Topik konsultasi: ${topic}\n\n`
    
    if (previousMessages && previousMessages.length > 0) {
      conversationContext += "Riwayat percakapan:\n"
      previousMessages.slice(-5).forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'Pengguna' : 'AI'}: ${msg.content}\n`
      })
      conversationContext += "\n"
    }
    
    const prompt = `${HEALTH_CONSULTATION_PROMPT}

${conversationContext}

Pengguna bertanya: ${message}

Berikan respons yang informatif, empati, dan helpful. Jika pertanyaan di luar topik kesehatan, arahkan kembali ke topik kesehatan dengan sopan.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    console.error("Gemini AI Error:", error)
    
    // Fallback response
    return "Maaf, saya mengalami kesulitan dalam memproses pertanyaan Anda. " +
           "Sebagai alternatif, saya sarankan:\n\n" +
           "• Coba ajukan pertanyaan dengan kata-kata yang berbeda\n" +
           "• Konsultasikan dengan dokter untuk informasi medis yang akurat\n" +
           "• Hubungi layanan kesehatan terdekat jika kondisi darurat\n\n" +
           "Mohon maaf atas ketidaknyamanannya."
  }
}

// Function to check if message indicates emergency
export function checkEmergencyKeywords(message: string): boolean {
  const emergencyKeywords = [
    "darurat", "emergency", "parah", "segera", "sekarat",
    "pingsan", "tidak sadar", "sesak nafas", "nyeri dada",
    "pendarahan", "kecelakaan", "overdosis", "bunuh diri",
    "serangan jantung", "stroke"
  ]
  
  const lowerMessage = message.toLowerCase()
  return emergencyKeywords.some(keyword => lowerMessage.includes(keyword))
}