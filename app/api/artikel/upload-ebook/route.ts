import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export const runtime = "nodejs"
export const maxDuration = 300

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

// POST - Upload e-book PDF artikel (perawat). Simpan ke /public/uploads, kembalikan { url }
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
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (!isPdf) {
      return NextResponse.json({ error: "File harus berformat PDF." }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran PDF melebihi 50 MB." }, { status: 400 })
    }

    const base =
      path
        .basename(file.name, path.extname(file.name))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50) || "ebook"
    const unique = `${base}-${file.size.toString(36)}.pdf`

    const dir = path.join(process.cwd(), "public", "uploads")
    await mkdir(dir, { recursive: true })

    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, unique), bytes)

    return NextResponse.json({ url: `/uploads/${unique}`, name: file.name }, { status: 201 })
  } catch (error) {
    console.error("Error uploading ebook:", error)
    return NextResponse.json({ error: "Failed to upload ebook" }, { status: 500 })
  }
}
