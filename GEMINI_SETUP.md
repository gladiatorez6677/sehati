# Setup Google Gemini AI untuk SehatKi

## Cara Mendapatkan API Key Gemini (GRATIS)

1. **Buka Google AI Studio**
   - Kunjungi: https://makersuite.google.com/app/apikey
   - Login dengan akun Google Anda

2. **Buat API Key**
   - Klik tombol "Create API Key"
   - Pilih "Create API key in new project" atau pilih project yang sudah ada
   - Copy API key yang muncul

3. **Tambahkan ke File .env**
   - Buka file `.env` di root project
   - Ganti `YOUR_GEMINI_API_KEY_HERE` dengan API key yang sudah dicopy:
   ```
   GEMINI_API_KEY="paste_api_key_anda_disini"
   ```

4. **Restart Server**
   - Stop server dengan Ctrl+C
   - Jalankan kembali: `pnpm dev`

## Batasan Gratis Gemini AI

- **60 requests per menit** (RPM)
- **1 juta requests per hari** (RPD)
- Gratis selamanya untuk penggunaan personal
- Model: Gemini Pro (text only)

## Fitur AI yang Tersedia

1. **Konsultasi Kesehatan Cerdas**
   - Memahami konteks percakapan
   - Memberikan saran kesehatan yang relevan
   - Mengenali kondisi darurat

2. **Deteksi Kondisi Darurat**
   - Otomatis mendeteksi kata kunci darurat
   - Memberikan notifikasi untuk segera ke dokter
   - Eskalasi ke perawat jika diperlukan

3. **Riwayat Percakapan**
   - AI mengingat konteks percakapan sebelumnya
   - Memberikan jawaban yang konsisten
   - Personalisasi berdasarkan topik konsultasi

## Troubleshooting

### Error: "API key not valid"
- Pastikan API key sudah benar
- Cek apakah API key sudah diaktifkan di Google AI Studio

### Error: "Quota exceeded"
- Anda melebihi batas 60 requests/menit
- Tunggu beberapa saat dan coba lagi

### AI tidak merespons
- Cek koneksi internet
- Pastikan file .env sudah tersimpan
- Restart development server

## Tips Penggunaan

1. **Ajukan pertanyaan spesifik** untuk mendapat jawaban yang lebih akurat
2. **Berikan konteks** seperti gejala, durasi, dan riwayat
3. **Gunakan bahasa Indonesia** yang jelas
4. AI akan selalu mengingatkan untuk **konsultasi dokter** jika diperlukan

## Contoh Pertanyaan

- "Saya demam 38 derajat sudah 2 hari, apa yang harus saya lakukan?"
- "Tips menjaga kesehatan jantung untuk usia 40 tahun"
- "Makanan apa yang baik untuk penderita diabetes?"
- "Cara mengatasi stress karena pekerjaan"
- "Olahraga yang cocok untuk menurunkan berat badan"