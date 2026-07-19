-- Seed video kesehatan lama (idempoten via id tetap)
INSERT INTO `VideoKesehatan`
  (`id`, `judul`, `deskripsi`, `kategori`, `url`, `thumbnail`, `status`, `viewCount`, `createdAt`, `updatedAt`)
VALUES
  ('seed-video-mengenal', 'Mengenal Hipertensi',
   'Pelajari apa itu hipertensi, penyebab, dan faktor risiko yang perlu Anda ketahui.',
   'Edukasi', '/video/Mengenal%20Hipertensi%20fix.mp4', NULL, 'PUBLISHED', 0, NOW(3), NOW(3)),
  ('seed-video-pencegahan', 'Pencegahan Hipertensi',
   'Langkah-langkah efektif untuk mencegah hipertensi melalui gaya hidup sehat.',
   'Pencegahan', '/video/pencegahan%20hipertensi%20fix.mp4', NULL, 'PUBLISHED', 0, NOW(3), NOW(3)),
  ('seed-video-pengelolaan', 'Pengelolaan Hipertensi',
   'Cara mengelola hipertensi dengan tepat agar tekanan darah tetap terkontrol.',
   'Pengelolaan', '/video/pengelolaan%20hipertensi%20fix.mp4', NULL, 'PUBLISHED', 0, NOW(3), NOW(3)),
  ('seed-video-manajemen-diri', 'Manajemen Diri Penderita Hipertensi',
   'Panduan mandiri bagi penderita hipertensi untuk menjalani hidup berkualitas.',
   'Manajemen Diri', '/video/Manajemen%20diri%20penderita%20hipertensi%20fix.mp4', NULL, 'PUBLISHED', 0, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE `judul` = VALUES(`judul`);
