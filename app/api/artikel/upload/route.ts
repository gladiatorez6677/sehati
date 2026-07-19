import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export const runtime = "nodejs"

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}

// POST - Upload gambar artikel (perawat). Menyimpan ke /public/uploads, mengembalikan { url }
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
        { error: "Format tidak didukung. Gunakan JPG/PNG/WebP/GIF." },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran gambar melebihi 10 MB." }, { status: 400 })
    }

    const ext = EXT[file.type] || path.extname(file.name) || ".jpg"
    const base =
      path
        .basename(file.name, path.extname(file.name))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "gambar"
    const unique = `${base}-${file.size.toString(36)}${ext}`

    const dir = path.join(process.cwd(), "public", "uploads")
    await mkdir(dir, { recursive: true })

    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, unique), bytes)

    return NextResponse.json({ url: `/uploads/${unique}` }, { status: 201 })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
