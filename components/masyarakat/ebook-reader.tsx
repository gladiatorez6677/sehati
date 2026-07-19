"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, Maximize2, Minimize2, BookOpen } from "lucide-react"

// Worker pdf.js (cocokkan versi dengan pdfjs-dist yang dipakai react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function EbookReader({ url, title }: { url: string; title?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [direction, setDirection] = useState(1)
  const [pageWidth, setPageWidth] = useState(600)
  const [fullscreen, setFullscreen] = useState(false)
  const [error, setError] = useState(false)

  // Lebar halaman responsif
  useEffect(() => {
    const update = () => {
      const w = containerRef.current?.clientWidth || 600
      const max = fullscreen ? 900 : 760
      setPageWidth(Math.min(w - 8, max))
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [fullscreen])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setPageNumber((p) => Math.max(1, p - 1))
  }, [])

  const goNext = useCallback(() => {
    setDirection(1)
    setPageNumber((p) => Math.min(numPages || p, p + 1))
  }, [numPages])

  // Navigasi keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "ArrowRight") goNext()
      else if (e.key === "Escape") setFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goPrev, goNext])

  const content = (
    <div
      ref={containerRef}
      className={
        fullscreen
          ? "fixed inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center p-4"
          : "w-full flex flex-col items-center"
      }
    >
      {/* Toolbar */}
      <div className="w-full max-w-[900px] flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 text-sm font-medium ${fullscreen ? "text-white" : ""}`}>
          <BookOpen className="h-4 w-4 text-pink-500" />
          <span className="truncate max-w-[180px] sm:max-w-xs">{title || "E-book"}</span>
        </div>
        <Button
          type="button"
          variant={fullscreen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFullscreen((f) => !f)}
        >
          {fullscreen ? (
            <>
              <Minimize2 className="h-4 w-4 mr-1" /> Tutup
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4 mr-1" /> Layar Penuh
            </>
          )}
        </Button>
      </div>

      {error ? (
        <div className="py-16 text-center text-sm text-gray-400">
          Gagal memuat PDF.{" "}
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Buka langsung
          </a>
        </div>
      ) : (
        <>
          {/* Panggung buku */}
          <div
            className="relative flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shadow-inner"
            style={{ perspective: 1600, minHeight: 200 }}
          >
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={() => setError(true)}
              loading={
                <div className="flex items-center justify-center py-24 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat e-book...
                </div>
              }
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={pageNumber}
                  custom={direction}
                  initial={{ rotateY: direction > 0 ? -28 : 28, opacity: 0.2 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: direction > 0 ? 20 : -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ transformOrigin: direction > 0 ? "left center" : "right center" }}
                  className="shadow-xl bg-white"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="flex items-center justify-center py-24 text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </Document>
          </div>

          {/* Kontrol halaman */}
          <div className="mt-4 flex items-center gap-4">
            <Button type="button" variant="outline" size="icon" onClick={goPrev} disabled={pageNumber <= 1}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className={`text-sm tabular-nums ${fullscreen ? "text-white" : "text-gray-600 dark:text-gray-300"}`}>
              Halaman <b>{pageNumber}</b> / {numPages || "…"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goNext}
              disabled={numPages > 0 && pageNumber >= numPages}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <p className={`mt-2 text-xs ${fullscreen ? "text-gray-300" : "text-muted-foreground"}`}>
            Gunakan tombol ◀ ▶ atau panah keyboard untuk berpindah halaman.
          </p>
        </>
      )}
    </div>
  )

  return content
}
