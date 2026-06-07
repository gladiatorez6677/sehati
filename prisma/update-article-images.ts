import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const updates = [
  {
    id: 'cmlc9dhu90001f5sc6ho9ban0', // Istilah Hipertensi
    gambar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'
  },
  {
    id: 'cmlc9dhup0003f5sc3huxq1w4', // Definisi & Klasifikasi
    gambar: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80'
  },
  {
    id: 'cmlc9dhuy0005f5scjphp1je5', // Manajemen Diri
    gambar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80'
  },
  {
    id: 'cmlc9dhv60007f5sc84n88duw', // Penyebab Hipertensi
    gambar: 'https://images.unsplash.com/photo-1505576399279-0d309a2ba654?w=1200&q=80'
  },
  {
    id: 'cmlc9dhvf0009f5scr5fgdjgh', // Gejala Hipertensi
    gambar: 'https://images.unsplash.com/photo-1616012480717-fd5e170a4ea6?w=1200&q=80'
  },
  {
    id: 'cmlc9dhvl000bf5scg3l5kym4', // Komplikasi
    gambar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80'
  },
  {
    id: 'cmlc9dhvt000df5scqqn6dv1e', // Pencegahan
    gambar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80'
  },
  {
    id: 'cmlc9dhw0000ff5sc4yxp115f', // Pengelolaan
    gambar: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0b?w=1200&q=80'
  },
  {
    id: 'cmlc9dhwe000hf5sc89l92o9z', // Alat Ukur Tekanan Darah
    gambar: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80'
  },
  {
    id: 'cmlc9dhwr000jf5scnwt9x77e', // Manajemen Diri Praktis
    gambar: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=1200&q=80'
  },
  {
    id: 'cmlc9dhx2000lf5scd939akei', // Pola Makan / Diet DASH
    gambar: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80'
  },
  {
    id: 'cmlc9dhxk000nf5sc78m0rvle', // Obat Tradisional
    gambar: 'https://images.unsplash.com/photo-1515023115894-dfb4c0e5d8b2?w=1200&q=80'
  },
  {
    id: 'cmlc9dhxw000pf5sc93r7lwde', // Penutup
    gambar: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=80'
  },
]

async function main() {
  console.log(`Updating ${updates.length} articles with images...`)

  for (const update of updates) {
    const result = await prisma.artikelKesehatan.update({
      where: { id: update.id },
      data: { gambar: update.gambar },
      select: { id: true, judul: true, gambar: true }
    })
    console.log(`Updated: ${result.judul}`)
    console.log(`  Image: ${result.gambar}\n`)
  }

  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
