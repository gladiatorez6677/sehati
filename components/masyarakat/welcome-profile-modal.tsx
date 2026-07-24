"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, User, Mail, Phone, MapPin, Calendar, Heart, Shield, Brain, Activity, GraduationCap, Briefcase } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface Ringkasan {
  dataDiri: {
    nama: string
    email: string
    tanggalLahir: string
    jenisKelamin: string
    nomorTelepon: string
    alamat: string | null
    pendidikanTerakhir: string | null
    pekerjaan: string | null
  } | null
  tekananDarah: { sistolik: number; diastolik: number; kategori: string; tanggalPengukuran: string } | null
  kolesterol: { totalKolesterol: number; tanggalPemeriksaan: string } | null
  stress: { levelStress: number; tanggalPenilaian: string } | null
}

function hitungUmur(tgl: string) {
  const d = new Date(tgl)
  const now = new Date()
  let u = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) u--
  return u
}
function kolLabel(t: number) {
  if (t < 200) return { label: "Normal", cls: "bg-green-100 text-green-700" }
  if (t < 240) return { label: "Borderline", cls: "bg-amber-100 text-amber-700" }
  return { label: "Tinggi", cls: "bg-red-100 text-red-700" }
}
function stressLabel(l: number) {
  if (l <= 3) return { label: "Rendah", cls: "bg-green-100 text-green-700" }
  if (l <= 6) return { label: "Sedang", cls: "bg-amber-100 text-amber-700" }
  return { label: "Tinggi", cls: "bg-red-100 text-red-700" }
}
function tdCls(kategori: string) {
  const k = kategori.toLowerCase()
  if (k.includes("normal")) return "bg-green-100 text-green-700"
  if (k.includes("pre")) return "bg-amber-100 text-amber-700"
  return "bg-red-100 text-red-700"
}

export function WelcomeProfileModal() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Ringkasan | null>(null)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return
    if (session.user.role !== "MASYARAKAT") return
    const key = `sehati_welcome_${session.user.id}`
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) return
    ;(async () => {
      try {
        const res = await fetch("/api/masyarakat/ringkasan")
        if (res.ok) {
          setData(await res.json())
          setOpen(true)
        }
      } catch { /* ignore */ }
    })()
  }, [status, session])

  const close = () => {
    if (session?.user?.id && typeof window !== "undefined") {
      sessionStorage.setItem(`sehati_welcome_${session.user.id}`, "1")
    }
    setOpen(false)
  }

  if (!open || !data) return null
  const d = data.dataDiri

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={close}>
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-pink-500 to-pink-600 px-6 py-5 text-white">
          <button onClick={close} className="absolute right-4 top-4 rounded-lg p-1 hover:bg-white/20" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
          <p className="text-sm opacity-90">Selamat datang kembali,</p>
          <h2 className="text-xl font-bold">{d?.nama || session?.user?.name}</h2>
          <p className="mt-1 text-xs opacity-90">Berikut ringkasan data diri & kondisi kesehatan Anda.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Data Diri */}
          <section>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">Data Diri</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
              {d?.email && <Info icon={Mail} label="Email" value={d.email} />}
              {d?.nomorTelepon && <Info icon={Phone} label="No. Telepon" value={d.nomorTelepon} />}
              {d?.tanggalLahir && (
                <Info icon={Calendar} label="Tanggal Lahir" value={`${format(new Date(d.tanggalLahir), "d MMM yyyy", { locale: localeId })} (${hitungUmur(d.tanggalLahir)} th)`} />
              )}
              {d?.jenisKelamin && <Info icon={User} label="Jenis Kelamin" value={d.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"} />}
              {d?.pendidikanTerakhir && <Info icon={GraduationCap} label="Pendidikan Terakhir" value={d.pendidikanTerakhir} />}
              {d?.pekerjaan && <Info icon={Briefcase} label="Pekerjaan" value={d.pekerjaan} />}
              {d?.alamat && <Info icon={MapPin} label="Alamat" value={d.alamat} full />}
            </div>
          </section>

          {/* Kondisi Kesehatan */}
          <section>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">Kondisi Kesehatan Terakhir</h3>
            <div className="space-y-2">
              {data.tekananDarah ? (
                <HealthRow icon={Heart} color="text-red-500" title="Tekanan Darah"
                  value={`${data.tekananDarah.sistolik}/${data.tekananDarah.diastolik} mmHg`}
                  badge={data.tekananDarah.kategori} badgeCls={tdCls(data.tekananDarah.kategori)}
                  tgl={data.tekananDarah.tanggalPengukuran} />
              ) : <Empty icon={Heart} title="Tekanan Darah" />}

              {data.kolesterol ? (
                <HealthRow icon={Shield} color="text-green-500" title="Kolesterol Total"
                  value={`${data.kolesterol.totalKolesterol} mg/dL`}
                  badge={kolLabel(data.kolesterol.totalKolesterol).label} badgeCls={kolLabel(data.kolesterol.totalKolesterol).cls}
                  tgl={data.kolesterol.tanggalPemeriksaan} />
              ) : <Empty icon={Shield} title="Kolesterol" />}

              {data.stress ? (
                <HealthRow icon={Brain} color="text-purple-500" title="Tingkat Stres"
                  value={`Level ${data.stress.levelStress}/10`}
                  badge={stressLabel(data.stress.levelStress).label} badgeCls={stressLabel(data.stress.levelStress).cls}
                  tgl={data.stress.tanggalPenilaian} />
              ) : <Empty icon={Brain} title="Manajemen Stres" />}
            </div>
            {!data.tekananDarah && !data.kolesterol && !data.stress && (
              <p className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-xs text-blue-700 dark:text-blue-300">
                <Activity className="mr-1 inline h-3.5 w-3.5" />
                Anda belum memiliki data kesehatan. Mulai catat tekanan darah, kolesterol, atau tingkat stres Anda dari menu terkait.
              </p>
            )}
          </section>
        </div>

        <div className="border-t px-6 py-4 dark:border-gray-800">
          <Button className="w-full" onClick={close}>Mengerti</Button>
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, label, value, full }: { icon: React.ElementType; label: string; value: string; full?: boolean }) {
  return (
    <div className={`flex items-start gap-2 ${full ? "sm:col-span-2" : ""}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white break-words">{value}</p>
      </div>
    </div>
  )
}

function HealthRow({ icon: Icon, color, title, value, badge, badgeCls, tgl }: {
  icon: React.ElementType; color: string; title: string; value: string; badge: string; badgeCls: string; tgl: string
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 dark:border-gray-800 p-3">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={`h-5 w-5 shrink-0 ${color}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
          <p className="text-xs text-gray-500">{value} • {format(new Date(tgl), "d MMM yyyy", { locale: localeId })}</p>
        </div>
      </div>
      <Badge className={`${badgeCls} hover:${badgeCls} shrink-0 text-xs`}>{badge}</Badge>
    </div>
  )
}

function Empty({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-400">
      <Icon className="h-5 w-5 shrink-0" />
      <span>{title}: belum ada data</span>
    </div>
  )
}
