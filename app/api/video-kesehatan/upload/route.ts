import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export const runtime = "nodejs"
// Batas ukuran diproteksi juga di nginx (client_max_body_size)
export const maxDuration = 300

const ALLOWED = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
const MAX_BYTES = 200 * 1024 * 1024 // 200 MB

// POST - Upload file video (perawat). Menyimpan ke /public/video, mengembalikan { url }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Format tidak didukung. Gunakan MP4/WebM/OGG/MOV." },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file melebihi 200 MB." },
        { status: 400 }
      )
    }

    const ext = path.extname(file.name) || ".mp4"
    const base = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "video"
    // Nama unik tanpa Date/Math.random (deterministik dari ukuran + waktu request)
    const unique = `${base}-${file.size.toString(36)}${ext}`

    const dir = path.join(process.cwd(), "public", "video")
    await mkdir(dir, { recursive: true })

    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, unique), bytes)

    return NextResponse.json({ url: `/video/${unique}` }, { status: 201 })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 })
  }
}
