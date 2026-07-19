"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Settings, User, Lock, Save, Loader2 } from "lucide-react"

interface Profile {
  nama: string
  email: string
  nomorTelepon: string
  alamat: string | null
  role: string
  perawat: { nomorSTR: string; spesialisasi: string } | null
}

export default function PengaturanPage() {
  const { update } = useSession()

  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Profil
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [nomorTelepon, setNomorTelepon] = useState("")
  const [alamat, setAlamat] = useState("")
  const [spesialisasi, setSpesialisasi] = useState("")
  const [nomorSTR, setNomorSTR] = useState("")
  const [isPerawat, setIsPerawat] = useState(false)

  // Password
  const [passwordLama, setPasswordLama] = useState("")
  const [passwordBaru, setPasswordBaru] = useState("")
  const [konfirmasi, setKonfirmasi] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/pengaturan")
        if (res.ok) {
          const data: Profile = await res.json()
          setNama(data.nama || "")
          setEmail(data.email || "")
          setNomorTelepon(data.nomorTelepon || "")
          setAlamat(data.alamat || "")
          setIsPerawat(data.role === "PERAWAT")
          setSpesialisasi(data.perawat?.spesialisasi || "")
          setNomorSTR(data.perawat?.nomorSTR || "")
        }
      } catch {
        toast({ title: "Error", description: "Gagal memuat profil", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const saveProfile = async () => {
    if (!nama.trim() || !nomorTelepon.trim()) {
      toast({
        title: "Lengkapi data",
        description: "Nama dan nomor telepon wajib diisi.",
        variant: "destructive",
      })
      return
    }
    setSavingProfile(true)
    try {
      const res = await fetch("/api/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nomorTelepon, alamat, spesialisasi }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: "Berhasil", description: "Profil berhasil diperbarui" })
        try {
          await update()
        } catch {
          /* refresh sesi opsional */
        }
      } else {
        throw new Error(data.error || "Gagal")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal memperbarui profil",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async () => {
    if (!passwordLama || !passwordBaru || !konfirmasi) {
      toast({ title: "Lengkapi data", description: "Semua kolom password wajib diisi.", variant: "destructive" })
      return
    }
    if (passwordBaru.length < 6) {
      toast({ title: "Password terlalu pendek", description: "Password baru minimal 6 karakter.", variant: "destructive" })
      return
    }
    if (passwordBaru !== konfirmasi) {
      toast({ title: "Tidak cocok", description: "Konfirmasi password tidak sama.", variant: "destructive" })
      return
    }
    setSavingPassword(true)
    try {
      const res = await fetch("/api/pengaturan/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordLama, passwordBaru }),
      })
      const data = await res.json()
      if (res.ok) {
        toast({ title: "Berhasil", description: "Password berhasil diubah" })
        setPasswordLama("")
        setPasswordBaru("")
        setKonfirmasi("")
      } else {
        throw new Error(data.error || "Gagal")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal mengubah password",
        variant: "destructive",
      })
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-pink-500" />
          Pengaturan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Kelola profil dan keamanan akun Anda
        </p>
      </div>

      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
          <CardDescription>Perbarui informasi akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} disabled className="bg-gray-50 dark:bg-gray-900/40" />
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
          </div>
          <div className="space-y-2">
            <Label>Nomor Telepon</Label>
            <Input value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} rows={3} />
          </div>
          {isPerawat && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Spesialisasi</Label>
                <Input value={spesialisasi} onChange={(e) => setSpesialisasi(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nomor STR</Label>
                <Input value={nomorSTR} disabled className="bg-gray-50 dark:bg-gray-900/40" />
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Simpan Profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ubah Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Ubah Password
          </CardTitle>
          <CardDescription>Gunakan password yang kuat dan mudah Anda ingat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Password Lama</Label>
            <Input
              type="password"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">Minimal 6 karakter.</p>
          </div>
          <div className="space-y-2">
            <Label>Konfirmasi Password Baru</Label>
            <Input
              type="password"
              value={konfirmasi}
              onChange={(e) => setKonfirmasi(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={savePassword} disabled={savingPassword}>
              {savingPassword ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Lock className="h-4 w-4 mr-2" />
              )}
              Ubah Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
