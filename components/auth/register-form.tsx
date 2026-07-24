"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"

const baseSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  tanggalLahir: z.string().min(1, "Tanggal lahir harus diisi"),
  jenisKelamin: z.enum(["L", "P"], {
    required_error: "Pilih jenis kelamin",
  }),
  nomorTelepon: z.string().min(10, "Nomor telepon tidak valid"),
  alamat: z.string().optional(),
})

const masyarakatSchema = baseSchema.extend({
  role: z.literal("MASYARAKAT"),
  pendidikanTerakhir: z.string().min(1, "Pilih pendidikan terakhir"),
  pekerjaan: z.string().min(1, "Isi pekerjaan"),
})

const perawatSchema = baseSchema.extend({
  role: z.literal("PERAWAT"),
  nomorSTR: z.string().min(10, "Nomor STR tidak valid"),
  spesialisasi: z.string().min(3, "Spesialisasi harus diisi"),
})

type MasyarakatFormValues = z.infer<typeof masyarakatSchema>
type PerawatFormValues = z.infer<typeof perawatSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // const [activeTab, setActiveTab] = useState("masyarakat")

  const masyarakatForm = useForm<MasyarakatFormValues>({
    resolver: zodResolver(masyarakatSchema),
    defaultValues: {
      role: "MASYARAKAT",
      email: "",
      password: "",
      nama: "",
      tanggalLahir: "",
      jenisKelamin: undefined,
      nomorTelepon: "",
      alamat: "",
      pendidikanTerakhir: "",
      pekerjaan: "",
    },
  })

  const perawatForm = useForm<PerawatFormValues>({
    resolver: zodResolver(perawatSchema),
    defaultValues: {
      role: "PERAWAT",
      email: "",
      password: "",
      nama: "",
      tanggalLahir: "",
      jenisKelamin: undefined,
      nomorTelepon: "",
      alamat: "",
      nomorSTR: "",
      spesialisasi: "",
    },
  })

  async function onSubmit(data: MasyarakatFormValues | PerawatFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: "Error",
          description: result.error || "Terjadi kesalahan",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Berhasil",
        description: "Registrasi berhasil! Silakan login.",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Registrasi</CardTitle>
        <CardDescription>
          Buat akun baru untuk menggunakan aplikasi SehatKi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tabs removed - only showing masyarakat registration */}
        <div>
            <Form {...masyarakatForm}>
              <form onSubmit={masyarakatForm.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={masyarakatForm.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={masyarakatForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="nama@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={masyarakatForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="******" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={masyarakatForm.control}
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={masyarakatForm.control}
                    name="jenisKelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={masyarakatForm.control}
                    name="nomorTelepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={masyarakatForm.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Jl. Contoh No. 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={masyarakatForm.control}
                  name="pendidikanTerakhir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendidikan Terakhir</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pendidikan terakhir" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tidak Sekolah">Tidak Sekolah</SelectItem>
                          <SelectItem value="SD">SD</SelectItem>
                          <SelectItem value="SMP">SMP</SelectItem>
                          <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                          <SelectItem value="Diploma">Diploma (D1-D4)</SelectItem>
                          <SelectItem value="Sarjana (S1)">Sarjana (S1)</SelectItem>
                          <SelectItem value="Magister (S2)">Magister (S2)</SelectItem>
                          <SelectItem value="Doktor (S3)">Doktor (S3)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={masyarakatForm.control}
                  name="pekerjaan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pekerjaan</FormLabel>
                      <FormControl>
                        <Input placeholder="mis. Petani, Wiraswasta, PNS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Daftar"}
                </Button>
              </form>
            </Form>
        </div>
        
        {/* Perawat registration hidden */}
        {/* <TabsContent value="perawat">
            <Form {...perawatForm}>
              <form onSubmit={perawatForm.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={perawatForm.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="nama@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="******" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="jenisKelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="nomorTelepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="nomorSTR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor STR</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={perawatForm.control}
                    name="spesialisasi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spesialisasi</FormLabel>
                        <FormControl>
                          <Input placeholder="Perawat Umum" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={perawatForm.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Jl. Contoh No. 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Daftar sebagai Perawat"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs> */}
        
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}