import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

export const dynamic = "force-dynamic"

function tgl(d: Date | string) {
  return format(new Date(d), "d MMM yyyy HH:mm", { locale: localeId })
}
function umur(d: Date | string | null) {
  if (!d) return ""
  const b = new Date(d)
  const now = new Date()
  let u = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) u--
  return u
}

// GET - unduh Excel: semua masyarakat + riwayat kesehatan
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const masyarakat = await prisma.masyarakat.findMany({
      include: {
        user: {
          select: {
            nama: true, email: true, jenisKelamin: true, tanggalLahir: true,
            nomorTelepon: true, alamat: true, pendidikanTerakhir: true, pekerjaan: true, createdAt: true,
          },
        },
        tekananDarah: { orderBy: { tanggalPengukuran: "desc" } },
        controlKolesterol: { orderBy: { tanggalPemeriksaan: "desc" } },
        manajemenStress: { orderBy: { tanggalPenilaian: "desc" } },
      },
      orderBy: { user: { nama: "asc" } },
    })

    // Sheet 1: Data Masyarakat
    const dataMasyarakat: (string | number)[][] = [[
      "No", "Nama", "Email", "Jenis Kelamin", "Tanggal Lahir", "Umur", "No. Telepon",
      "Alamat", "Pendidikan Terakhir", "Pekerjaan", "Tanggal Daftar",
      "Jml Tekanan Darah", "Jml Kolesterol", "Jml Stres",
    ]]
    // Sheet 2-4
    const td: (string | number)[][] = [["Nama", "Tanggal", "Sistolik", "Diastolik", "Nadi", "Kategori", "Catatan"]]
    const kol: (string | number)[][] = [["Nama", "Tanggal", "Total Kolesterol", "LDL", "HDL", "Trigliserida", "Rekomendasi"]]
    const stres: (string | number)[][] = [["Nama", "Tanggal", "Level (1-10)", "Gejala", "Pemicu", "Coping Strategy", "Rekomendasi"]]

    masyarakat.forEach((m, i) => {
      const nama = m.user?.nama || "-"
      dataMasyarakat.push([
        i + 1,
        nama,
        m.user?.email || "",
        m.user?.jenisKelamin === "L" ? "Laki-laki" : m.user?.jenisKelamin === "P" ? "Perempuan" : "",
        m.user?.tanggalLahir ? format(new Date(m.user.tanggalLahir), "d MMM yyyy", { locale: localeId }) : "",
        umur(m.user?.tanggalLahir ?? null),
        m.user?.nomorTelepon || "",
        m.user?.alamat || "",
        m.user?.pendidikanTerakhir || "",
        m.user?.pekerjaan || "",
        m.user?.createdAt ? format(new Date(m.user.createdAt), "d MMM yyyy", { locale: localeId }) : "",
        m.tekananDarah.length,
        m.controlKolesterol.length,
        m.manajemenStress.length,
      ])

      m.tekananDarah.forEach((r) =>
        td.push([nama, tgl(r.tanggalPengukuran), r.sistolik, r.diastolik, r.denyutNadi, r.kategori, r.catatan || ""]))
      m.controlKolesterol.forEach((r) =>
        kol.push([nama, tgl(r.tanggalPemeriksaan), r.totalKolesterol, r.ldl, r.hdl, r.trigliserida, r.rekomendasi || ""]))
      m.manajemenStress.forEach((r) =>
        stres.push([nama, tgl(r.tanggalPenilaian), r.levelStress, r.gejala || "", r.pemicu || "", r.copingStrategy || "", r.rekomendasi || ""]))
    })

    const wb = XLSX.utils.book_new()
    const mkSheet = (rows: (string | number)[][]) => {
      const ws = XLSX.utils.aoa_to_sheet(rows)
      ws["!cols"] = (rows[0] || []).map(() => ({ wch: 18 }))
      return ws
    }
    XLSX.utils.book_append_sheet(wb, mkSheet(dataMasyarakat), "Data Masyarakat")
    XLSX.utils.book_append_sheet(wb, mkSheet(td), "Tekanan Darah")
    XLSX.utils.book_append_sheet(wb, mkSheet(kol), "Kolesterol")
    XLSX.utils.book_append_sheet(wb, mkSheet(stres), "Manajemen Stres")

    const buffer: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
    const fname = `laporan-masyarakat-${format(new Date(), "yyyy-MM-dd")}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fname}"`,
      },
    })
  } catch (error) {
    console.error("Error export excel:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
