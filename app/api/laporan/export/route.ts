import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type") || "overview"
    const range = searchParams.get("range") || "week"

    // In a real application, you would use a PDF generation library like jsPDF or puppeteer
    // For now, we'll return a simple text file as a placeholder
    const reportContent = `LAPORAN KESEHATAN SEHATKI
========================

Jenis Laporan: ${type === "overview" ? "Overview" : type === "health" ? "Kesehatan" : type === "users" ? "Pengguna" : "Aktivitas"}
Periode: ${range === "week" ? "Minggu Ini" : range === "month" ? "Bulan Ini" : range === "quarter" ? "3 Bulan" : "Tahun Ini"}
Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: id })}
Dicetak oleh: ${session.user.name} (${session.user.role})

========================
RINGKASAN STATISTIK
========================

Total Pengguna: 523
- Masyarakat: 498
- Perawat: 25

Pengguna Baru (Bulan Ini): 47

Total Pemeriksaan:
- Tekanan Darah: 156 pemeriksaan
- Manajemen Stres: 124 pemeriksaan  
- Kolesterol: 89 pemeriksaan
- Total: 369 pemeriksaan

Konsultasi Aktif: 12

========================
DISTRIBUSI KESEHATAN
========================

Tekanan Darah:
- Normal: 65%
- Prehipertensi: 25%
- Hipertensi: 10%

Level Stres:
- Rendah: 40%
- Sedang: 45%
- Tinggi: 15%

Kolesterol:
- Normal: 70%
- Borderline: 20%
- Tinggi: 10%

========================
AKTIVITAS TERBARU
========================

1. Budi Santoso - Tekanan Darah: 120/80 mmHg (Normal)
2. Siti Nurhaliza - Manajemen Stres: Level 7/10 (Perlu Perhatian)
3. Ahmad Dahlan - Kolesterol: Total 180 mg/dL (Normal)
4. Maria Susanti - Tekanan Darah: 140/90 mmHg (Prehipertensi)
5. Joko Widodo - Manajemen Stres: Level 4/10 (Normal)

========================

Laporan ini digenerate secara otomatis oleh sistem SehatKi.
Untuk informasi lebih lanjut, hubungi administrator sistem.
`

    // Create response with appropriate headers for file download
    return new NextResponse(reportContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-${type}-${range}-${format(new Date(), "yyyy-MM-dd")}.txt"`,
      },
    })
  } catch (error) {
    console.error("Error generating export:", error)
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    )
  }
}