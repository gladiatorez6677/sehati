"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/perawat/rich-text-editor"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ClientSelect } from "@/components/ui/client-select"
import { ImageUpload } from "@/components/perawat/image-upload"
import { EbookUpload } from "@/components/perawat/ebook-upload"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Send } from "lucide-react"

const artikelSchema = z.object({
  judul: z.string().min(10, "Judul minimal 10 karakter"),
  konten: z.string().min(100, "Konten minimal 100 karakter"),
  kategori: z.string().min(1, "Pilih kategori"),
  tipeArtikel: z.enum(["UTAMA", "PENDUKUNG", "LOKAL"]),
  gambar: z.string().optional().or(z.literal("")),
  ebook: z.string().optional().or(z.literal("")),
  tags: z.string().optional(),
})

type ArtikelFormValues = z.infer<typeof artikelSchema>

export default function ArtikelBaruPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<ArtikelFormValues>({
    resolver: zodResolver(artikelSchema),
    defaultValues: {
      judul: "",
      konten: "",
      kategori: "",
      tipeArtikel: "UTAMA",
      gambar: "",
      ebook: "",
      tags: "",
    },
  })

  const handleSave = async (data: ArtikelFormValues, status: "DRAFT" | "PUBLISHED") => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/artikel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, status }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: status === "PUBLISHED" 
            ? "Artikel berhasil dipublikasi" 
            : "Artikel berhasil disimpan sebagai draft",
        })
        router.push("/perawat/artikel")
      } else {
        throw new Error("Failed to save article")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan artikel",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSaveAsDraft = () => {
    form.handleSubmit((data) => handleSave(data, "DRAFT"))()
  }

  const onPublish = () => {
    form.handleSubmit((data) => handleSave(data, "PUBLISHED"))()
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.push("/perawat/artikel")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Artikel Baru</CardTitle>
          <CardDescription>
            Tulis artikel kesehatan untuk masyarakat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Artikel</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul artikel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <ClientSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Pilih kategori"
                        items={[
                          { value: "Nutrisi", label: "Nutrisi" },
                          { value: "Olahraga", label: "Olahraga" },
                          { value: "Penyakit", label: "Penyakit" },
                          { value: "Kesehatan Mental", label: "Kesehatan Mental" },
                          { value: "Gaya Hidup", label: "Gaya Hidup" },
                          { value: "Pencegahan", label: "Pencegahan" },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipeArtikel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Artikel</FormLabel>
                    <FormControl>
                      <ClientSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Pilih jenis artikel"
                        items={[
                          { value: "UTAMA", label: "Artikel Utama" },
                          { value: "PENDUKUNG", label: "Artikel Pendukung" },
                          { value: "LOKAL", label: "Artikel Lokal Berbahasa Daerah" },
                        ]}
                      />
                    </FormControl>
                    <FormDescription>
                      Menentukan pengelompokan tab di halaman artikel masyarakat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="konten"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konten</FormLabel>
                    <FormControl>
                      <RichTextEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Gunakan toolbar untuk memformat teks (tebal, judul, daftar, dll) — tanpa perlu menulis kode HTML.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gambar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gambar (Opsional)</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Unggah gambar untuk artikel (JPG/PNG/WebP/GIF, maks 10 MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-book PDF (Opsional)</FormLabel>
                    <FormControl>
                      <EbookUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      Unggah file PDF (maks 50 MB). Akan tampil sebagai buku yang bisa dibaca
                      per halaman di sisi masyarakat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Opsional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="kesehatan, tips, olahraga"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Pisahkan tags dengan koma
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSaveAsDraft}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Draft
                </Button>
                <Button
                  type="button"
                  onClick={onPublish}
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publikasi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}