import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PERAWAT_ID = 'cmf40bfoh0002f5rw6xctx5y7'

interface Article {
  judul: string
  konten: string
  kategori: string
  tags: string
  status: 'PUBLISHED'
}

const articles: Article[] = [
  {
    judul: 'Istilah-Istilah Penting dalam Hipertensi yang Wajib Anda Ketahui',
    kategori: 'Penyakit',
    tags: 'hipertensi, istilah medis, tekanan darah, edukasi kesehatan',
    status: 'PUBLISHED',
    konten: `
<p>Pemahaman istilah-istilah dasar dalam hipertensi sangat penting agar penderita dapat berkomunikasi lebih efektif dengan tenaga kesehatan, meningkatkan kepatuhan pengobatan, serta mendorong pengambilan keputusan yang tepat dalam kehidupan sehari-hari.</p>

<h2>Istilah Dasar Tekanan Darah</h2>

<table>
  <thead>
    <tr>
      <th>Istilah</th>
      <th>Pengertian</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Tekanan Darah</strong></td>
      <td>Gaya yang diberikan oleh aliran darah terhadap dinding arteri, dinyatakan dalam satuan mmHg.</td>
    </tr>
    <tr>
      <td><strong>Sistolik</strong></td>
      <td>Tekanan darah tertinggi saat ventrikel jantung berkontraksi.</td>
    </tr>
    <tr>
      <td><strong>Diastolik</strong></td>
      <td>Tekanan darah terendah saat ventrikel jantung berada dalam fase relaksasi.</td>
    </tr>
    <tr>
      <td><strong>Hipertensi</strong></td>
      <td>Kondisi peningkatan tekanan darah sistolik &ge;140 mmHg dan/atau diastolik &ge;90 mmHg secara persisten.</td>
    </tr>
  </tbody>
</table>

<h2>Jenis-Jenis Hipertensi</h2>

<table>
  <thead>
    <tr>
      <th>Istilah</th>
      <th>Pengertian</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Hipertensi Primer (Esensial)</strong></td>
      <td>Hipertensi tanpa penyebab spesifik yang jelas dan dipengaruhi faktor genetik serta gaya hidup.</td>
    </tr>
    <tr>
      <td><strong>Hipertensi Sekunder</strong></td>
      <td>Hipertensi yang disebabkan oleh kondisi medis tertentu atau penggunaan obat-obatan.</td>
    </tr>
    <tr>
      <td><strong>Prehipertensi</strong></td>
      <td>Keadaan tekanan darah di atas normal namun belum memenuhi kriteria hipertensi.</td>
    </tr>
    <tr>
      <td><strong>Hipertensi Resisten</strong></td>
      <td>Hipertensi yang tidak terkontrol meskipun telah menggunakan &ge;3 jenis obat antihipertensi dengan dosis optimal.</td>
    </tr>
    <tr>
      <td><strong>Krisis Hipertensi</strong></td>
      <td>Tekanan darah &ge;180/120 mmHg yang berisiko menyebabkan kerusakan organ target.</td>
    </tr>
  </tbody>
</table>

<h2>Istilah Terkait Komplikasi dan Pengelolaan</h2>

<table>
  <thead>
    <tr>
      <th>Istilah</th>
      <th>Pengertian</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Organ Target</strong></td>
      <td>Organ yang rentan rusak akibat hipertensi kronis, seperti jantung, otak, ginjal, dan retina.</td>
    </tr>
    <tr>
      <td><strong>Self-Management</strong></td>
      <td>Kemampuan individu mengelola penyakit kronis melalui pemantauan dan perubahan perilaku.</td>
    </tr>
    <tr>
      <td><strong>Self-Efficacy</strong></td>
      <td>Keyakinan individu terhadap kemampuannya melakukan perilaku kesehatan tertentu.</td>
    </tr>
    <tr>
      <td><strong>Diet DASH</strong></td>
      <td>Pendekatan diet untuk menurunkan tekanan darah melalui pola makan seimbang dan rendah garam.</td>
    </tr>
    <tr>
      <td><strong>Aterosklerosis</strong></td>
      <td>Penebalan dan pengerasan arteri akibat penumpukan plak lemak.</td>
    </tr>
    <tr>
      <td><strong>Retinopati Hipertensi</strong></td>
      <td>Kerusakan pembuluh darah retina akibat tekanan darah tinggi kronis.</td>
    </tr>
    <tr>
      <td><strong>Nefropati Hipertensi</strong></td>
      <td>Kerusakan ginjal akibat hipertensi jangka panjang yang tidak terkontrol.</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Mengapa Istilah Ini Penting?</strong><br>
  Pemahaman istilah hipertensi membantu penderita berkomunikasi lebih efektif dengan tenaga kesehatan, meningkatkan kepatuhan pengobatan, serta mendorong pengambilan keputusan yang tepat dalam kehidupan sehari-hari.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya memahami arti sistolik dan diastolik</li>
  <li>Saya mengetahui perbedaan hipertensi primer dan sekunder</li>
  <li>Saya dapat menyebutkan batas tekanan darah normal</li>
</ul>
`.trim()
  },

  {
    judul: 'Definisi dan Klasifikasi Hipertensi: Memahami Tekanan Darah Anda',
    kategori: 'Penyakit',
    tags: 'hipertensi, tekanan darah, klasifikasi, definisi, JNC VII',
    status: 'PUBLISHED',
    konten: `
<h2>Pengertian Tekanan Darah</h2>

<p>Tekanan darah merupakan kekuatan yang dihasilkan oleh aliran darah terhadap dinding pembuluh darah arteri ketika jantung memompa darah ke seluruh tubuh. Tekanan darah menjadi salah satu indikator vital kesehatan kardiovaskular karena mencerminkan keseimbangan antara curah jantung, elastisitas pembuluh darah, dan resistensi perifer.</p>

<p>Pengukuran tekanan darah dinyatakan dalam satuan milimeter air raksa (mmHg) dan terdiri atas dua komponen utama, yaitu <strong>tekanan sistolik</strong> dan <strong>tekanan diastolik</strong>. Nilai tekanan darah seseorang dapat bervariasi sepanjang hari, dipengaruhi oleh aktivitas fisik, kondisi emosi, asupan makanan, serta faktor lingkungan.</p>

<h2>Definisi Hipertensi</h2>

<p>Hipertensi didefinisikan sebagai kondisi meningkatnya tekanan darah secara persisten di atas batas normal. Menurut <strong>Organisasi Kesehatan Dunia (WHO)</strong>, seseorang dikatakan menderita hipertensi apabila hasil pengukuran tekanan darah sistolik &ge;140 mmHg dan/atau tekanan darah diastolik &ge;90 mmHg pada dua kali pemeriksaan atau lebih dalam waktu yang berbeda.</p>

<p>Hipertensi bersifat kronis dan sering kali tidak menimbulkan gejala pada tahap awal, sehingga banyak penderita tidak menyadari kondisi yang dialaminya. Inilah yang menyebabkan hipertensi dikenal sebagai <strong><em>silent killer</em></strong>, karena dapat menimbulkan komplikasi berat tanpa tanda peringatan yang jelas.</p>

<h2>Klasifikasi Tekanan Darah</h2>

<p>Klasifikasi tekanan darah bertujuan untuk memudahkan penentuan risiko kesehatan dan strategi penatalaksanaan yang tepat.</p>

<h3>Klasifikasi Menurut JNC VII</h3>

<table>
  <thead>
    <tr>
      <th>Klasifikasi</th>
      <th>Sistolik (mmHg)</th>
      <th>Diastolik (mmHg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Normal</td>
      <td>&lt; 120</td>
      <td>&lt; 80</td>
    </tr>
    <tr>
      <td>Pra Hipertensi</td>
      <td>120 &ndash; 139</td>
      <td>80 &ndash; 89</td>
    </tr>
    <tr>
      <td>Stadium I</td>
      <td>140 &ndash; 159</td>
      <td>90 &ndash; 99</td>
    </tr>
    <tr>
      <td>Stadium II</td>
      <td>&ge; 160</td>
      <td>&ge; 100</td>
    </tr>
  </tbody>
</table>

<p><em>Sumber: National Institutes of Health, 2003</em></p>

<h3>Klasifikasi Menurut WHO-ISH 2003</h3>

<table>
  <thead>
    <tr>
      <th>Kategori</th>
      <th>Sistolik (mmHg)</th>
      <th>Diastolik (mmHg)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Optimal Normal</td>
      <td>&lt; 120</td>
      <td>&lt; 80</td>
    </tr>
    <tr>
      <td>Normal</td>
      <td>&lt; 130</td>
      <td>&lt; 85</td>
    </tr>
    <tr>
      <td>Normal Tinggi</td>
      <td>130 &ndash; 139</td>
      <td>85 &ndash; 89</td>
    </tr>
    <tr>
      <td>Tingkat 1 (Ringan)</td>
      <td>140 &ndash; 159</td>
      <td>90 &ndash; 99</td>
    </tr>
    <tr>
      <td>Tingkat 2 (Sedang)</td>
      <td>160 &ndash; 179</td>
      <td>100 &ndash; 109</td>
    </tr>
    <tr>
      <td>Tingkat 3 (Berat)</td>
      <td>&ge; 180</td>
      <td>&ge; 110</td>
    </tr>
  </tbody>
</table>

<p><em>Sumber: Whitworth, 2003</em></p>

<blockquote>
  <strong>Hipertensi Bukan Sekadar Angka</strong><br>
  Tekanan darah yang tinggi bukan hanya masalah angka pada alat ukur, tetapi mencerminkan risiko kerusakan organ vital yang dapat dicegah melalui pengendalian yang tepat.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya mengetahui batas tekanan darah normal</li>
  <li>Saya memahami kriteria seseorang disebut hipertensi</li>
  <li>Saya menyadari bahwa hipertensi memerlukan pengelolaan jangka panjang</li>
</ul>
`.trim()
  },

  {
    judul: 'Manajemen Diri Penderita Hipertensi: Kunci Pengendalian Jangka Panjang',
    kategori: 'Gaya Hidup',
    tags: 'hipertensi, manajemen diri, self-management, gaya hidup sehat, kepatuhan obat',
    status: 'PUBLISHED',
    konten: `
<h2>Konsep Manajemen Diri dalam Hipertensi</h2>

<p>Manajemen diri (<em>self-management</em>) pada penderita hipertensi merupakan kemampuan individu untuk secara aktif mengelola kondisi kesehatannya melalui pengambilan keputusan sehari-hari yang berkaitan dengan perilaku, pengobatan, pemantauan kesehatan, serta interaksi dengan lingkungan sosial dan sistem pelayanan kesehatan.</p>

<p>Dalam konteks kesehatan masyarakat, manajemen diri tidak hanya berfokus pada kepatuhan minum obat, tetapi juga mencakup <strong>perubahan gaya hidup</strong>, <strong>pengelolaan stres</strong>, <strong>penguatan motivasi</strong>, serta <strong>dukungan keluarga dan komunitas</strong>.</p>

<h2>Komponen Utama Manajemen Diri Hipertensi</h2>

<h3>1. Pemantauan Tekanan Darah Mandiri</h3>
<p>Pemantauan tekanan darah secara rutin memungkinkan penderita mengetahui kondisi kesehatannya, mendeteksi peningkatan tekanan darah sejak dini, serta mengevaluasi efektivitas pengobatan dan perubahan gaya hidup yang dilakukan.</p>

<h3>2. Kepatuhan Pengobatan</h3>
<p>Kepatuhan terhadap terapi farmakologis merupakan faktor kunci dalam pengendalian hipertensi. Banyak penderita menghentikan pengobatan ketika merasa sehat, padahal hipertensi sering kali tidak menimbulkan gejala. Manajemen diri menekankan pentingnya <strong>minum obat sesuai anjuran</strong> tenaga kesehatan meskipun tidak ada keluhan.</p>

<h3>3. Modifikasi Gaya Hidup</h3>
<p>Perubahan perilaku seperti pengaturan pola makan, peningkatan aktivitas fisik, berhenti merokok, dan pembatasan konsumsi alkohol merupakan bagian integral dari manajemen diri. Modifikasi gaya hidup terbukti mampu menurunkan tekanan darah dan mengurangi risiko komplikasi.</p>

<h3>4. Manajemen Stres dan Emosi</h3>
<p>Stres psikologis berperan dalam peningkatan tekanan darah melalui aktivasi sistem saraf simpatis. Oleh karena itu, kemampuan mengelola stres, emosi, dan tekanan sosial menjadi bagian penting dalam manajemen diri hipertensi.</p>

<h2>Komponen Manajemen Diri</h2>

<table>
  <thead>
    <tr>
      <th>Komponen</th>
      <th>Bentuk Praktik</th>
      <th>Dampak pada Tekanan Darah</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Monitoring mandiri</td>
      <td>Ukur tekanan darah rutin</td>
      <td>Deteksi dini peningkatan</td>
    </tr>
    <tr>
      <td>Kepatuhan obat</td>
      <td>Minum obat teratur</td>
      <td>Tekanan darah terkontrol</td>
    </tr>
    <tr>
      <td>Pola hidup sehat</td>
      <td>Diet &amp; aktivitas fisik</td>
      <td>Penurunan tekanan darah</td>
    </tr>
    <tr>
      <td>Manajemen stres</td>
      <td>Relaksasi &amp; coping</td>
      <td>Stabilitas tekanan darah</td>
    </tr>
  </tbody>
</table>

<h2>Peran Keluarga dan Lingkungan Sosial</h2>

<p>Dukungan keluarga berperan sebagai faktor penguat dalam manajemen diri hipertensi. Keluarga dapat membantu mengingatkan jadwal minum obat, menyediakan makanan sehat, serta menciptakan lingkungan yang mendukung perubahan perilaku.</p>

<h2>Tantangan dan Strategi Peningkatan</h2>

<p>Beberapa tantangan dalam manajemen diri hipertensi antara lain kurangnya pengetahuan, rendahnya motivasi, keterbatasan akses layanan kesehatan, serta faktor ekonomi. Strategi yang dapat dilakukan meliputi:</p>
<ul>
  <li>Edukasi berkelanjutan</li>
  <li>Penggunaan media digital kesehatan</li>
  <li>Pendekatan <em>peer support</em></li>
  <li>Penguatan peran kader kesehatan</li>
</ul>

<blockquote>
  <strong>Hipertensi dan Tanggung Jawab Diri</strong><br>
  Hipertensi tidak dapat disembuhkan, tetapi dapat dikendalikan. Keberhasilan pengendalian sangat bergantung pada keputusan kecil yang diambil setiap hari oleh penderita.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya mengukur tekanan darah secara rutin</li>
  <li>Saya minum obat sesuai anjuran tenaga kesehatan</li>
  <li>Saya menerapkan pola hidup sehat</li>
  <li>Saya mampu mengelola stres sehari-hari</li>
  <li>Keluarga saya mendukung pengendalian hipertensi</li>
</ul>
`.trim()
  },

  {
    judul: 'Penyebab Hipertensi: Faktor Risiko yang Perlu Anda Waspadai',
    kategori: 'Penyakit',
    tags: 'hipertensi, penyebab, faktor risiko, genetik, gaya hidup',
    status: 'PUBLISHED',
    konten: `
<h2>Gambaran Umum</h2>

<p>Hipertensi merupakan kondisi multifaktorial yang dipengaruhi oleh interaksi antara faktor biologis, perilaku, psikologis, sosial, dan lingkungan. Secara umum, penyebab hipertensi dibagi menjadi dua kelompok besar, yaitu <strong>hipertensi primer (esensial)</strong> dan <strong>hipertensi sekunder</strong>.</p>

<h2>Hipertensi Primer (Esensial)</h2>

<p>Hipertensi primer merupakan jenis yang paling banyak ditemukan, mencakup sekitar <strong>90&ndash;95%</strong> dari seluruh kasus hipertensi. Tidak ditemukan penyebab tunggal yang spesifik, melainkan hasil interaksi berbagai faktor risiko.</p>

<h3>1. Faktor Genetik</h3>
<p>Riwayat keluarga dengan hipertensi meningkatkan risiko seseorang mengalami kondisi serupa. Faktor genetik memengaruhi regulasi tekanan darah melalui mekanisme sistem saraf, hormon, serta fungsi ginjal.</p>

<h3>2. Usia dan Jenis Kelamin</h3>
<p>Peningkatan usia berhubungan dengan menurunnya elastisitas pembuluh darah. Pada usia produktif, hipertensi lebih sering ditemukan pada laki-laki, sedangkan pada usia lanjut prevalensinya meningkat pada perempuan, terutama setelah menopause.</p>

<h3>3. Pola Makan Tidak Sehat</h3>
<p>Konsumsi garam berlebih, makanan tinggi lemak jenuh, serta rendahnya asupan buah dan sayur berkontribusi terhadap peningkatan tekanan darah.</p>

<h3>4. Kurang Aktivitas Fisik</h3>
<p>Gaya hidup sedentari menyebabkan peningkatan berat badan, resistensi insulin, dan gangguan fungsi pembuluh darah yang pada akhirnya meningkatkan tekanan darah.</p>

<h3>5. Stres Psikososial</h3>
<p>Stres kronis memicu aktivasi sistem saraf simpatis dan peningkatan hormon stres yang dapat menyebabkan peningkatan tekanan darah secara persisten.</p>

<h2>Hipertensi Sekunder</h2>

<p>Hipertensi sekunder disebabkan oleh kondisi medis tertentu atau penggunaan obat-obatan. Beberapa penyebabnya antara lain:</p>
<ul>
  <li>Penyakit ginjal kronis</li>
  <li>Gangguan endokrin (hiperaldosteronisme, feokromositoma)</li>
  <li>Kelainan pembuluh darah</li>
  <li>Penggunaan kontrasepsi hormonal dan obat antiinflamasi nonsteroid</li>
</ul>

<h2>Faktor Risiko Hipertensi</h2>

<table>
  <thead>
    <tr>
      <th>Tidak Dapat Dimodifikasi</th>
      <th>Dapat Dimodifikasi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Usia</td>
      <td>Kelebihan berat badan dan obesitas</td>
    </tr>
    <tr>
      <td>Jenis kelamin</td>
      <td>Merokok</td>
    </tr>
    <tr>
      <td>Ras/etnik dan faktor genetik</td>
      <td>Konsumsi garam berlebihan</td>
    </tr>
    <tr>
      <td>Riwayat penyakit keluarga</td>
      <td>Konsumsi alkohol</td>
    </tr>
    <tr>
      <td></td>
      <td>Kurang aktivitas fisik dan olahraga</td>
    </tr>
  </tbody>
</table>

<p><em>Sumber: Kementerian Kesehatan Republik Indonesia, 2024</em></p>

<blockquote>
  <strong>Fokus pada Faktor yang Bisa Diubah</strong><br>
  Meskipun beberapa faktor risiko hipertensi tidak dapat dihindari, sebagian besar faktor risiko dapat dimodifikasi melalui perubahan gaya hidup.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya mengetahui faktor risiko hipertensi yang tidak dapat saya ubah</li>
  <li>Saya mengidentifikasi faktor risiko yang dapat saya perbaiki</li>
  <li>Saya menjaga berat badan ideal</li>
  <li>Saya membatasi konsumsi garam dan makanan tinggi lemak</li>
  <li>Saya melakukan aktivitas fisik secara teratur</li>
  <li>Saya mengelola stres dengan cara yang sehat</li>
</ul>
`.trim()
  },

  {
    judul: 'Gejala Hipertensi: Kenali Tanda-Tanda Bahaya Si Silent Killer',
    kategori: 'Penyakit',
    tags: 'hipertensi, gejala, silent killer, tanda bahaya, tekanan darah tinggi',
    status: 'PUBLISHED',
    konten: `
<h2>Hipertensi sebagai Silent Killer</h2>

<p>Hipertensi sering disebut sebagai <strong><em>silent killer</em></strong> karena pada sebagian besar penderita tidak menimbulkan gejala yang jelas, terutama pada tahap awal. Banyak individu dengan tekanan darah tinggi merasa sehat dan tetap dapat beraktivitas seperti biasa, sehingga hipertensi sering kali tidak terdeteksi hingga muncul komplikasi serius pada organ target seperti jantung, otak, ginjal, dan mata.</p>

<p>Ketiadaan gejala bukan berarti tekanan darah berada dalam batas aman. Tekanan darah yang meningkat secara perlahan namun menetap dapat menyebabkan kerusakan pembuluh darah dan organ vital secara progresif. Oleh karena itu, <strong>pemeriksaan tekanan darah secara rutin</strong> menjadi satu-satunya cara yang paling efektif untuk mendeteksi hipertensi sejak dini.</p>

<h2>Gejala Umum Hipertensi</h2>

<p>Pada sebagian penderita, hipertensi dapat menimbulkan keluhan yang bersifat ringan dan tidak spesifik. Gejala-gejala ini sering kali diabaikan atau dikaitkan dengan kelelahan, stres, atau faktor usia. Gejala umum meliputi:</p>

<ul>
  <li>Sakit kepala, terutama di bagian belakang kepala</li>
  <li>Pusing atau rasa melayang</li>
  <li>Mudah lelah</li>
  <li>Jantung berdebar</li>
  <li>Gangguan tidur</li>
  <li>Telinga berdenging</li>
  <li>Penglihatan kabur</li>
  <li>Rasa berat di tengkuk</li>
</ul>

<h2>Gejala Hipertensi Berat dan Krisis Hipertensi</h2>

<p>Pada hipertensi berat atau krisis hipertensi, gejala yang muncul biasanya lebih jelas dan bersifat <strong>gawat darurat</strong>. Krisis hipertensi terjadi ketika tekanan darah meningkat sangat tinggi dalam waktu singkat dan berisiko menyebabkan kerusakan organ target secara akut.</p>

<p>Gejala yang dapat muncul antara lain:</p>
<ul>
  <li>Sakit kepala hebat</li>
  <li>Nyeri dada</li>
  <li>Sesak napas</li>
  <li>Gangguan penglihatan berat</li>
  <li>Mual dan muntah</li>
  <li>Penurunan kesadaran</li>
  <li>Tanda-tanda stroke (kelemahan satu sisi tubuh atau kesulitan berbicara)</li>
</ul>

<p><strong>Kondisi ini memerlukan penanganan medis segera.</strong></p>

<h2>Gejala Berdasarkan Tingkat Keparahan</h2>

<table>
  <thead>
    <tr>
      <th>Tingkat Hipertensi</th>
      <th>Gejala yang Mungkin Muncul</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ringan &ndash; Sedang</td>
      <td>Sering tanpa gejala, sakit kepala ringan, pusing</td>
    </tr>
    <tr>
      <td>Berat</td>
      <td>Sakit kepala hebat, jantung berdebar, penglihatan kabur</td>
    </tr>
    <tr>
      <td>Krisis Hipertensi</td>
      <td>Nyeri dada, sesak napas, penurunan kesadaran, gejala stroke</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Jangan Menunggu Gejala</strong><br>
  Hipertensi sering tidak memberikan tanda peringatan. Menunggu munculnya gejala justru meningkatkan risiko komplikasi. Pemeriksaan tekanan darah secara rutin adalah langkah paling aman untuk melindungi kesehatan.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya memahami bahwa hipertensi dapat terjadi tanpa gejala</li>
  <li>Saya memeriksa tekanan darah secara rutin</li>
  <li>Saya mengenali tanda bahaya hipertensi berat</li>
  <li>Saya segera mencari pertolongan medis jika muncul gejala berat</li>
</ul>
`.trim()
  },

  {
    judul: 'Komplikasi Hipertensi: Bahaya pada Jantung, Otak, Ginjal, dan Mata',
    kategori: 'Penyakit',
    tags: 'hipertensi, komplikasi, jantung, stroke, ginjal, retinopati',
    status: 'PUBLISHED',
    konten: `
<h2>Hipertensi dan Kerusakan Organ Target</h2>

<p>Hipertensi yang tidak terkontrol dalam jangka panjang dapat menyebabkan kerusakan progresif pada berbagai organ vital. Tekanan darah tinggi memberikan beban berlebih pada pembuluh darah dan organ-organ yang bergantung pada aliran darah yang stabil.</p>

<h2>Komplikasi pada Jantung</h2>

<p>Hipertensi meningkatkan risiko <strong>penyakit jantung koroner</strong>, <strong>gagal jantung</strong>, dan <strong>pembesaran jantung</strong>. Tekanan darah tinggi memaksa jantung bekerja lebih keras sehingga otot jantung menebal dan fungsi pompa menurun.</p>

<h2>Komplikasi pada Otak</h2>

<p>Tekanan darah tinggi merupakan faktor risiko utama <strong>stroke iskemik</strong> dan <strong>stroke hemoragik</strong>. Selain itu, hipertensi kronis dapat menyebabkan penurunan fungsi kognitif dan <strong>demensia vaskular</strong>.</p>

<h2>Komplikasi pada Ginjal</h2>

<p>Hipertensi dapat merusak pembuluh darah ginjal dan menurunkan kemampuan ginjal dalam menyaring darah. Kondisi ini dapat berujung pada <strong>penyakit ginjal kronis</strong> hingga <strong>gagal ginjal</strong>.</p>

<h2>Komplikasi pada Mata</h2>

<p>Kerusakan pembuluh darah retina akibat hipertensi dikenal sebagai <strong>retinopati hipertensi</strong>, yang dapat menyebabkan gangguan penglihatan hingga kebutaan bila tidak ditangani.</p>

<h2>Ringkasan Komplikasi Berdasarkan Organ</h2>

<table>
  <thead>
    <tr>
      <th>Organ</th>
      <th>Komplikasi Utama</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jantung</td>
      <td>Penyakit jantung koroner, gagal jantung</td>
    </tr>
    <tr>
      <td>Otak</td>
      <td>Stroke, demensia vaskular</td>
    </tr>
    <tr>
      <td>Ginjal</td>
      <td>Penyakit ginjal kronis</td>
    </tr>
    <tr>
      <td>Mata</td>
      <td>Retinopati hipertensi</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Kendalikan Tekanan Darah, Lindungi Organ Vital</strong><br>
  Pengendalian tekanan darah yang baik dapat mencegah atau menunda terjadinya komplikasi serius akibat hipertensi.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya memahami risiko komplikasi hipertensi</li>
  <li>Saya patuh terhadap pengobatan dan anjuran tenaga kesehatan</li>
  <li>Saya melakukan pemeriksaan kesehatan secara berkala</li>
</ul>
`.trim()
  },

  {
    judul: 'Pencegahan Hipertensi: Strategi Primer, Sekunder, dan Tersier',
    kategori: 'Pencegahan',
    tags: 'hipertensi, pencegahan, gaya hidup sehat, deteksi dini, kepatuhan obat',
    status: 'PUBLISHED',
    konten: `
<p>Pencegahan hipertensi merupakan upaya komprehensif yang dilakukan untuk menurunkan risiko terjadinya hipertensi, mengendalikan tekanan darah pada penderita, serta mencegah terjadinya komplikasi lebih lanjut.</p>

<h2>Pencegahan Primer</h2>

<p>Pencegahan primer ditujukan kepada individu yang <strong>belum menderita hipertensi</strong> dengan tujuan mencegah terjadinya peningkatan tekanan darah.</p>

<h3>Modifikasi Gaya Hidup</h3>

<p>Modifikasi gaya hidup merupakan langkah utama dalam pencegahan primer hipertensi. Beberapa bentuk yang dianjurkan:</p>

<ol>
  <li>Mengonsumsi makanan bergizi seimbang dengan membatasi asupan garam, lemak jenuh, dan gula</li>
  <li>Meningkatkan konsumsi buah, sayur, dan serat</li>
  <li>Melakukan aktivitas fisik secara teratur minimal <strong>150 menit per minggu</strong></li>
  <li>Menjaga berat badan ideal dan mencegah obesitas</li>
  <li>Menghentikan kebiasaan merokok dan membatasi konsumsi alkohol</li>
  <li>Mengelola stres melalui relaksasi, istirahat cukup, dan aktivitas spiritual</li>
</ol>

<p>Perubahan gaya hidup tidak harus dilakukan secara drastis, tetapi <strong>bertahap dan konsisten</strong> agar dapat dipertahankan dalam jangka panjang.</p>

<h3>Edukasi dan Promosi Kesehatan</h3>

<p>Edukasi dan promosi kesehatan berperan penting dalam meningkatkan pengetahuan, sikap, dan perilaku masyarakat. Kegiatan edukasi dapat dilakukan melalui penyuluhan kesehatan, media cetak dan digital, serta keterlibatan kader kesehatan dan keluarga.</p>

<h2>Pencegahan Sekunder dan Tersier</h2>

<p>Pencegahan sekunder dan tersier ditujukan kepada individu yang <strong>telah menderita hipertensi</strong> dengan tujuan mendeteksi penyakit secara dini dan mencegah komplikasi.</p>

<h3>Deteksi Dini</h3>
<p>Deteksi dini dilakukan melalui pemeriksaan tekanan darah secara rutin, baik di fasilitas kesehatan maupun secara mandiri di rumah. Individu dengan faktor risiko tinggi dianjurkan untuk melakukan pemeriksaan tekanan darah lebih sering.</p>

<h3>Kepatuhan Pengobatan</h3>
<p>Pengobatan hipertensi biasanya bersifat jangka panjang bahkan seumur hidup. Penderita perlu memahami manfaat pengobatan, cara minum obat yang benar, serta risiko bila pengobatan dihentikan tanpa anjuran tenaga kesehatan.</p>

<h3>Pencegahan Komplikasi</h3>
<p>Dilakukan dengan menjaga tekanan darah tetap terkontrol, memantau kondisi organ target, serta mengendalikan penyakit penyerta seperti diabetes dan dislipidemia.</p>

<h2>Ringkasan Strategi Pencegahan</h2>

<table>
  <thead>
    <tr>
      <th>Jenis Pencegahan</th>
      <th>Sasaran</th>
      <th>Strategi Utama</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Primer</td>
      <td>Individu sehat</td>
      <td>Modifikasi gaya hidup, edukasi kesehatan</td>
    </tr>
    <tr>
      <td>Sekunder</td>
      <td>Penderita hipertensi awal</td>
      <td>Deteksi dini, pengobatan teratur</td>
    </tr>
    <tr>
      <td>Tersier</td>
      <td>Penderita dengan komplikasi</td>
      <td>Pengendalian tekanan darah, pencegahan kecacatan</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Pencegahan Dimulai dari Diri Sendiri</strong><br>
  Sebagian besar kasus hipertensi dapat dicegah melalui perubahan gaya hidup sehat yang dimulai sejak usia muda dan dilakukan secara konsisten.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya menerapkan pola makan sehat rendah garam</li>
  <li>Saya berolahraga secara teratur</li>
  <li>Saya rutin memeriksa tekanan darah</li>
  <li>Saya patuh minum obat sesuai anjuran</li>
  <li>Saya berupaya mencegah komplikasi dengan gaya hidup sehat</li>
</ul>
`.trim()
  },

  {
    judul: 'Pengelolaan Hipertensi: Pendekatan Nonfarmakologis dan Farmakologis',
    kategori: 'Gaya Hidup',
    tags: 'hipertensi, pengelolaan, farmakologis, nonfarmakologis, obat antihipertensi',
    status: 'PUBLISHED',
    konten: `
<p>Pengelolaan hipertensi bertujuan untuk menurunkan dan mempertahankan tekanan darah dalam batas target, mencegah kerusakan organ target, serta meningkatkan kualitas hidup penderita.</p>

<h2>Pengelolaan Nonfarmakologis</h2>

<p>Pengelolaan nonfarmakologis merupakan dasar utama dalam penatalaksanaan hipertensi dan harus dilakukan oleh seluruh penderita, baik yang belum maupun yang sudah mendapatkan terapi obat.</p>

<h3>Aktivitas Fisik</h3>
<p>Aktivitas fisik teratur terbukti efektif menurunkan tekanan darah sistolik dan diastolik. Jenis yang dianjurkan meliputi olahraga aerobik intensitas sedang seperti jalan cepat, bersepeda, berenang, atau senam selama <strong>30&ndash;60 menit per hari</strong>, minimal <strong>3&ndash;5 kali per minggu</strong>.</p>

<h3>Manajemen Stres</h3>
<p>Stres psikologis yang berkepanjangan dapat memicu peningkatan tekanan darah. Teknik manajemen stres yang dapat dilakukan antara lain:</p>
<ul>
  <li>Relaksasi pernapasan</li>
  <li>Meditasi dan yoga</li>
  <li>Aktivitas spiritual</li>
  <li>Manajemen waktu</li>
  <li>Keseimbangan antara pekerjaan dan istirahat</li>
</ul>

<h3>Berhenti Merokok</h3>
<p>Merokok menyebabkan penyempitan pembuluh darah dan mempercepat kerusakan dinding arteri. Berhenti merokok memberikan manfaat signifikan dalam menurunkan risiko komplikasi.</p>

<h3>Pembatasan Alkohol</h3>
<p>Konsumsi alkohol secara berlebihan berhubungan dengan peningkatan tekanan darah dan penurunan efektivitas obat antihipertensi.</p>

<h2>Pengelolaan Farmakologis</h2>

<p>Pengelolaan farmakologis dilakukan apabila perubahan gaya hidup saja belum mampu mencapai target tekanan darah.</p>

<h3>Prinsip Penggunaan Obat Antihipertensi</h3>
<p>Pemilihan jenis obat mempertimbangkan usia, tingkat keparahan hipertensi, penyakit penyerta, serta respons individu terhadap terapi. Obat antihipertensi umumnya digunakan dalam jangka panjang dan sering kali dikombinasikan.</p>

<h3>Kepatuhan Minum Obat</h3>
<p>Ketidakpatuhan dapat menyebabkan tekanan darah tidak terkontrol dan meningkatkan risiko komplikasi. Penderita dianjurkan untuk:</p>
<ul>
  <li>Minum obat secara teratur sesuai dosis dan waktu yang dianjurkan</li>
  <li>Tidak menghentikan atau mengganti obat tanpa konsultasi tenaga kesehatan</li>
</ul>

<h3>Efek Samping dan Kewaspadaan</h3>
<p>Setiap obat antihipertensi dapat menimbulkan efek samping, seperti pusing, lemas, batuk kering, atau gangguan elektrolit. Penderita perlu memahami kemungkinan efek samping dan segera melaporkannya kepada tenaga kesehatan.</p>

<h2>Ringkasan Pendekatan Pengelolaan</h2>

<table>
  <thead>
    <tr>
      <th>Pendekatan</th>
      <th>Contoh Tindakan</th>
      <th>Manfaat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Nonfarmakologis</td>
      <td>Aktivitas fisik, manajemen stres</td>
      <td>Menurunkan tekanan darah, meningkatkan kualitas hidup</td>
    </tr>
    <tr>
      <td>Farmakologis</td>
      <td>Obat antihipertensi</td>
      <td>Mengendalikan tekanan darah secara efektif</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Kombinasi yang Tepat Lebih Efektif</strong><br>
  Pengelolaan hipertensi akan lebih optimal apabila perubahan gaya hidup sehat dikombinasikan dengan penggunaan obat sesuai anjuran tenaga kesehatan.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya melakukan aktivitas fisik secara teratur</li>
  <li>Saya mengelola stres dengan cara yang sehat</li>
  <li>Saya tidak merokok dan membatasi alkohol</li>
  <li>Saya patuh minum obat antihipertensi</li>
  <li>Saya melaporkan efek samping obat kepada tenaga kesehatan</li>
</ul>
`.trim()
  },

  {
    judul: 'Cara Mengukur Tekanan Darah yang Benar di Rumah',
    kategori: 'Pencegahan',
    tags: 'tekanan darah, tensimeter, pengukuran, monitoring mandiri, hipertensi',
    status: 'PUBLISHED',
    konten: `
<p>Pengukuran tekanan darah yang akurat merupakan komponen penting dalam pencegahan dan pengelolaan hipertensi. Kesalahan dalam penggunaan alat atau teknik pengukuran dapat menghasilkan nilai yang tidak tepat.</p>

<h2>Jenis Alat Ukur Tekanan Darah</h2>

<p>Alat ukur tekanan darah (tensimeter) tersedia dalam beberapa jenis:</p>

<ul>
  <li><strong>Tensimeter air raksa</strong> &mdash; Standar emas dengan akurasi tinggi, namun penggunaannya mulai dibatasi karena alasan keamanan lingkungan</li>
  <li><strong>Tensimeter aneroid</strong> &mdash; Menggunakan jarum penunjuk, memerlukan kalibrasi rutin</li>
  <li><strong>Tensimeter digital</strong> &mdash; Lebih mudah digunakan secara mandiri, praktis untuk penggunaan di rumah</li>
</ul>

<h2>Persiapan Sebelum Pengukuran</h2>

<ol>
  <li>Beristirahat selama <strong>5&ndash;10 menit</strong> sebelum pengukuran</li>
  <li>Menghindari konsumsi kafein, merokok, dan aktivitas fisik berat minimal <strong>30 menit</strong> sebelum pengukuran</li>
  <li>Mengosongkan kandung kemih sebelum pemeriksaan</li>
  <li>Duduk dengan posisi nyaman, punggung bersandar, dan kaki menapak lantai</li>
  <li>Lengan diletakkan sejajar dengan jantung</li>
</ol>

<h2>Langkah-Langkah Pengukuran yang Benar</h2>

<p>Manset dipasang pada lengan atas dengan ukuran yang sesuai, tidak terlalu longgar atau terlalu ketat.</p>

<ul>
  <li><strong>Tensimeter manual:</strong> Pompa manset hingga aliran darah terhenti, kemudian turunkan secara perlahan sambil mendengarkan bunyi Korotkoff menggunakan stetoskop</li>
  <li><strong>Tensimeter digital:</strong> Manset akan mengembang dan mengempis secara otomatis, hasil ditampilkan pada layar</li>
</ul>

<p>Pengukuran sebaiknya dilakukan <strong>minimal dua kali</strong> dengan selang waktu 1&ndash;2 menit, kemudian diambil nilai rata-rata.</p>

<h2>Cara Membaca dan Mencatat Hasil</h2>

<p>Hasil pengukuran terdiri atas dua angka dalam satuan mmHg:</p>
<ul>
  <li><strong>Angka pertama (atas):</strong> Tekanan sistolik</li>
  <li><strong>Angka kedua (bawah):</strong> Tekanan diastolik</li>
</ul>

<p>Penderita hipertensi dianjurkan untuk <strong>mencatat hasil pengukuran secara rutin</strong> dalam buku catatan atau aplikasi kesehatan, termasuk waktu dan kondisi saat pengukuran.</p>

<h2>Kesalahan Umum Saat Pengukuran</h2>

<ul>
  <li>Penggunaan manset yang tidak sesuai ukuran</li>
  <li>Posisi tubuh yang salah</li>
  <li>Berbicara atau bergerak saat pengukuran</li>
  <li>Pengukuran segera setelah aktivitas fisik</li>
</ul>

<h2>Ringkasan Teknik Pengukuran</h2>

<table>
  <thead>
    <tr>
      <th>Tahap</th>
      <th>Hal yang Perlu Diperhatikan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Persiapan</td>
      <td>Istirahat cukup, hindari kafein dan rokok</td>
    </tr>
    <tr>
      <td>Posisi</td>
      <td>Duduk nyaman, lengan sejajar jantung</td>
    </tr>
    <tr>
      <td>Pengukuran</td>
      <td>Manset sesuai ukuran, tidak berbicara</td>
    </tr>
    <tr>
      <td>Pencatatan</td>
      <td>Catat hasil dan waktu pengukuran</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Ukur dengan Benar, Kendalikan dengan Tepat</strong><br>
  Pengukuran tekanan darah yang akurat merupakan langkah awal dalam pengendalian hipertensi yang efektif.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya menggunakan alat ukur tekanan darah yang sesuai</li>
  <li>Saya melakukan persiapan sebelum pengukuran</li>
  <li>Saya mengukur tekanan darah dengan posisi yang benar</li>
  <li>Saya mencatat hasil pengukuran secara rutin</li>
  <li>Saya menghindari kesalahan umum saat pengukuran</li>
</ul>
`.trim()
  },

  {
    judul: 'Manajemen Diri Hipertensi: Panduan Praktis Pengendalian Tekanan Darah',
    kategori: 'Gaya Hidup',
    tags: 'hipertensi, manajemen diri, self-efficacy, monitoring, dukungan keluarga',
    status: 'PUBLISHED',
    konten: `
<p>Manajemen diri (<em>self-management</em>) merupakan inti dari pengendalian hipertensi jangka panjang. Hipertensi adalah penyakit kronis yang sangat dipengaruhi oleh perilaku sehari-hari, sehingga keberhasilannya terutama ditentukan oleh keterlibatan aktif penderita sendiri.</p>

<h2>Konsep Self-Management pada Hipertensi</h2>

<p>Self-management didefinisikan sebagai kemampuan individu untuk memahami penyakitnya, memantau kondisi kesehatan, mengambil keputusan yang tepat, serta melakukan tindakan yang diperlukan untuk mengendalikan tekanan darah dan mencegah komplikasi.</p>

<p>Konsep ini mencakup:</p>
<ul>
  <li><strong>Pengelolaan medis</strong> &mdash; kepatuhan pengobatan</li>
  <li><strong>Pengelolaan perilaku</strong> &mdash; pola makan, aktivitas fisik, manajemen stres</li>
  <li><strong>Pengelolaan emosional dan sosial</strong> &mdash; motivasi dan dukungan lingkungan</li>
</ul>

<h2>Monitoring Tekanan Darah Mandiri</h2>

<p>Monitoring tekanan darah secara mandiri merupakan salah satu pilar utama. Pengukuran rutin membantu penderita mengenali pola tekanan darah, mengevaluasi efektivitas pengobatan, serta mendeteksi peningkatan secara dini.</p>

<p>Penderita dianjurkan untuk:</p>
<ul>
  <li>Mengukur tekanan darah di rumah pada pagi dan sore hari</li>
  <li>Mencatat hasil secara sistematis</li>
  <li>Membawa catatan saat kunjungan ke fasilitas kesehatan</li>
</ul>

<h2>Pengambilan Keputusan Sehari-hari</h2>

<p>Manajemen diri berkaitan erat dengan pengambilan keputusan sehari-hari, seperti memilih jenis makanan, menentukan aktivitas fisik, mengelola stres, serta memutuskan kapan harus mencari pertolongan medis. Keputusan-keputusan kecil yang dilakukan secara konsisten memiliki <strong>dampak besar</strong> terhadap pengendalian tekanan darah.</p>

<h2>Self-Efficacy dan Motivasi</h2>

<p><em>Self-efficacy</em> atau keyakinan diri merupakan faktor psikologis penting. Penderita yang yakin mampu mengendalikan tekanan darah cenderung lebih patuh terhadap pengobatan dan perubahan gaya hidup.</p>

<p>Motivasi internal dapat diperkuat melalui:</p>
<ul>
  <li>Pencapaian target kecil secara bertahap</li>
  <li>Dukungan sosial dari keluarga dan lingkungan</li>
  <li>Pemahaman akan manfaat jangka panjang pengendalian hipertensi</li>
  <li>Edukasi berkelanjutan dan pendekatan empatik dari tenaga kesehatan</li>
</ul>

<h2>Peran Keluarga dan Lingkungan Sosial</h2>

<p>Keluarga dan lingkungan sosial memiliki peran strategis. Dukungan emosional, pengingat minum obat, serta keterlibatan keluarga dalam penerapan gaya hidup sehat dapat meningkatkan keberhasilan pengendalian tekanan darah.</p>

<h2>Komponen Manajemen Diri</h2>

<table>
  <thead>
    <tr>
      <th>Komponen</th>
      <th>Bentuk Kegiatan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pengetahuan</td>
      <td>Memahami penyakit dan pengobatan</td>
    </tr>
    <tr>
      <td>Monitoring</td>
      <td>Pengukuran tekanan darah mandiri</td>
    </tr>
    <tr>
      <td>Perilaku sehat</td>
      <td>Pola makan, aktivitas fisik, manajemen stres</td>
    </tr>
    <tr>
      <td>Psikologis</td>
      <td>Self-efficacy dan motivasi</td>
    </tr>
    <tr>
      <td>Dukungan sosial</td>
      <td>Peran keluarga dan lingkungan</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Anda adalah Pengelola Utama Kesehatan Anda</strong><br>
  Keberhasilan pengendalian hipertensi sangat ditentukan oleh peran aktif penderita dalam mengelola kesehatannya setiap hari.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya memahami konsep manajemen diri hipertensi</li>
  <li>Saya rutin memantau tekanan darah secara mandiri</li>
  <li>Saya membuat keputusan sehat dalam kehidupan sehari-hari</li>
  <li>Saya memiliki motivasi untuk mengendalikan tekanan darah</li>
  <li>Saya melibatkan keluarga dalam pengelolaan hipertensi</li>
</ul>
`.trim()
  },

  {
    judul: 'Pola Makan Sehat untuk Penderita Hipertensi: Panduan Diet DASH',
    kategori: 'Nutrisi',
    tags: 'hipertensi, nutrisi, diet DASH, rendah garam, pola makan sehat',
    status: 'PUBLISHED',
    konten: `
<p>Pola makan merupakan komponen kunci dalam pengendalian hipertensi. Asupan makanan sehari-hari berpengaruh langsung terhadap tekanan darah, berat badan, kadar lemak darah, serta kesehatan pembuluh darah.</p>

<h2>Prinsip Diet DASH</h2>

<p><strong>Dietary Approaches to Stop Hypertension (DASH)</strong> merupakan pola makan yang direkomendasikan secara internasional untuk penderita hipertensi. Diet DASH menekankan:</p>
<ul>
  <li>Konsumsi makanan rendah lemak jenuh dan kolesterol</li>
  <li>Tinggi buah, sayur, dan biji-bijian utuh</li>
  <li>Protein rendah lemak dan produk susu rendah lemak</li>
  <li>Peningkatan asupan kalium, kalsium, magnesium, dan serat</li>
  <li>Pembatasan natrium (garam)</li>
</ul>

<h2>Pembatasan Garam</h2>

<p>Asupan garam yang berlebihan merupakan salah satu faktor utama peningkatan tekanan darah. Penderita hipertensi dianjurkan untuk membatasi konsumsi garam hingga <strong>kurang dari 5 gram per hari</strong> (setara satu sendok teh).</p>

<p>Pembatasan garam meliputi:</p>
<ul>
  <li>Mengurangi penggunaan garam dapur saat memasak</li>
  <li>Membatasi makanan olahan dan makanan instan</li>
  <li>Menghindari makanan kaleng</li>
  <li>Mengurangi bumbu siap saji yang mengandung natrium tinggi</li>
</ul>

<h2>Lemak Sehat dan Serat</h2>

<p>Penggantian lemak jenuh dan lemak trans dengan <strong>lemak sehat</strong> berperan penting dalam menjaga kesehatan jantung. Sumber lemak sehat:</p>
<ul>
  <li>Ikan berlemak (salmon, tuna, sarden)</li>
  <li>Kacang-kacangan dan biji-bijian</li>
  <li>Alpukat</li>
  <li>Minyak nabati (minyak zaitun)</li>
</ul>

<p>Sumber serat yang dianjurkan: buah-buahan, sayuran, kacang-kacangan, dan biji-bijian utuh.</p>

<h2>Contoh Menu Harian</h2>

<table>
  <thead>
    <tr>
      <th>Waktu</th>
      <th>Menu</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Pagi</strong></td>
      <td>Nasi merah, telur rebus, sayur bening, buah pepaya</td>
    </tr>
    <tr>
      <td><strong>Siang</strong></td>
      <td>Nasi merah, ikan panggang, tumis sayur tanpa banyak garam, buah jeruk</td>
    </tr>
    <tr>
      <td><strong>Sore</strong></td>
      <td>Buah potong atau kacang rebus</td>
    </tr>
    <tr>
      <td><strong>Malam</strong></td>
      <td>Nasi merah, tahu/tempe kukus, sayur sop rendah garam</td>
    </tr>
  </tbody>
</table>

<h2>Makanan yang Dianjurkan dan Dihindari</h2>

<table>
  <thead>
    <tr>
      <th>Dianjurkan</th>
      <th>Dihindari</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Buah dan sayur segar</td>
      <td>Makanan tinggi garam</td>
    </tr>
    <tr>
      <td>Ikan, ayam tanpa kulit</td>
      <td>Makanan olahan dan instan</td>
    </tr>
    <tr>
      <td>Kacang-kacangan</td>
      <td>Gorengan</td>
    </tr>
    <tr>
      <td>Biji-bijian utuh</td>
      <td>Lemak jenuh dan trans</td>
    </tr>
  </tbody>
</table>

<blockquote>
  <strong>Makan Sehat Setiap Hari</strong><br>
  Pola makan sehat tidak harus mahal atau rumit. Pemilihan bahan makanan sederhana dan pengolahan yang tepat sudah memberikan manfaat besar bagi pengendalian hipertensi.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Saya memahami prinsip diet DASH</li>
  <li>Saya membatasi konsumsi garam</li>
  <li>Saya memilih lemak sehat dan makanan berserat</li>
  <li>Saya menerapkan menu sehat sehari-hari</li>
  <li>Saya menghindari makanan tinggi garam dan lemak</li>
</ul>
`.trim()
  },

  {
    judul: 'Resep Obat Tradisional Pendukung untuk Penderita Hipertensi',
    kategori: 'Gaya Hidup',
    tags: 'hipertensi, obat tradisional, herbal, seledri, rosella, daun salam',
    status: 'PUBLISHED',
    konten: `
<h2>Prinsip Kehati-hatian Penggunaan Obat Tradisional</h2>

<p>Penggunaan obat tradisional atau herbal sebagai pendukung terapi hipertensi telah lama dikenal di Indonesia. Namun demikian, <strong>obat tradisional bukan pengganti terapi medis</strong>, melainkan bersifat komplementer.</p>

<p>Prinsip utama kehati-hatian meliputi:</p>
<ol>
  <li><strong>Keamanan (safety):</strong> memastikan bahan herbal bersih, tidak tercemar pestisida, logam berat, atau bahan kimia berbahaya</li>
  <li><strong>Dosis yang tepat:</strong> penggunaan berlebihan dapat menimbulkan efek toksik</li>
  <li><strong>Kontinuitas pengobatan medis:</strong> obat antihipertensi yang diresepkan tenaga kesehatan tidak boleh dihentikan sepihak</li>
  <li><strong>Konsultasi dengan tenaga kesehatan:</strong> terutama pada penderita dengan penyakit penyerta</li>
</ol>

<blockquote>
  <strong>Alami tidak selalu berarti aman.</strong> Herbal yang digunakan tanpa pengetahuan yang benar dapat menimbulkan risiko kesehatan.
</blockquote>

<h2>Tanaman Herbal yang Berpotensi Menurunkan Tekanan Darah</h2>

<table>
  <thead>
    <tr>
      <th>No</th>
      <th>Tanaman Herbal</th>
      <th>Bagian Digunakan</th>
      <th>Potensi Manfaat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Seledri (<em>Apium graveolens</em>)</td>
      <td>Daun &amp; batang</td>
      <td>Efek diuretik ringan, relaksasi pembuluh darah</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Bawang putih (<em>Allium sativum</em>)</td>
      <td>Umbi</td>
      <td>Menurunkan tekanan darah sistolik &amp; diastolik</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Daun salam</td>
      <td>Daun</td>
      <td>Antioksidan, membantu metabolisme lipid</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Kumis kucing</td>
      <td>Daun</td>
      <td>Diuretik, membantu fungsi ginjal</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Rosella</td>
      <td>Kelopak bunga</td>
      <td>Vasodilator, antioksidan</td>
    </tr>
  </tbody>
</table>

<p><em>Catatan: Bukti ilmiah herbal umumnya berasal dari studi observasional dan uji klinis terbatas, sehingga penggunaannya harus bersifat pendukung.</em></p>

<h2>Contoh Resep Tradisional Pendukung</h2>

<h3>1. Rebusan Daun Seledri</h3>
<ul>
  <li><strong>Bahan:</strong> 5&ndash;7 batang seledri segar</li>
  <li><strong>Cara:</strong> Rebus dengan 2 gelas air hingga tersisa 1 gelas</li>
  <li><strong>Aturan pakai:</strong> 1 kali sehari</li>
</ul>

<h3>2. Air Seduhan Rosella</h3>
<ul>
  <li><strong>Bahan:</strong> 2&ndash;3 kelopak rosella kering</li>
  <li><strong>Cara:</strong> Seduh dengan air panas selama 5&ndash;10 menit</li>
  <li><strong>Aturan pakai:</strong> 1&ndash;2 kali sehari tanpa gula</li>
</ul>

<h3>3. Rebusan Daun Salam</h3>
<ul>
  <li><strong>Bahan:</strong> 7 lembar daun salam</li>
  <li><strong>Cara:</strong> Rebus dengan 3 gelas air hingga tersisa 1 gelas</li>
  <li><strong>Aturan pakai:</strong> 1 kali sehari</li>
</ul>

<h2>Interaksi dengan Obat Medis</h2>

<p>Beberapa herbal dapat berinteraksi dengan obat antihipertensi:</p>
<ul>
  <li><strong>Bawang putih + obat antihipertensi</strong> &rarr; risiko hipotensi berlebihan</li>
  <li><strong>Herbal diuretik + diuretik medis</strong> &rarr; risiko dehidrasi dan gangguan elektrolit</li>
  <li><strong>Herbal tertentu + pengencer darah</strong> &rarr; meningkatkan risiko perdarahan</li>
</ul>

<p><strong>Oleh karena itu, penderita hipertensi wajib melaporkan penggunaan obat tradisional kepada tenaga kesehatan.</strong></p>

<blockquote>
  <strong>Obat tradisional harus rasional dan aman</strong><br>
  Obat tradisional dapat digunakan sebagai pendukung manajemen diri hipertensi, namun harus rasional, aman, dan terintegrasi dengan pengobatan medis berbasis bukti.
</blockquote>

<h2>Checklist Penderita</h2>
<ul>
  <li>Menggunakan bahan segar dan bersih</li>
  <li>Tidak mencampur banyak jenis herbal sekaligus</li>
  <li>Tetap minum obat dokter sesuai anjuran</li>
  <li>Menghentikan penggunaan bila muncul keluhan</li>
</ul>
`.trim()
  },

  {
    judul: 'Penutup: Pesan Kunci Manajemen Diri Hipertensi',
    kategori: 'Pencegahan',
    tags: 'hipertensi, pesan kunci, manajemen diri, kualitas hidup, pencegahan',
    status: 'PUBLISHED',
    konten: `
<h2>Penutup</h2>

<p>Hipertensi merupakan tantangan kesehatan masyarakat yang terus meningkat seiring perubahan gaya hidup, urbanisasi, dan penuaan populasi. Pendekatan kuratif saja tidak cukup, melainkan diperlukan pendekatan <strong>promotif dan preventif</strong> berbasis pemberdayaan individu dan keluarga.</p>

<p>Manajemen diri penderita hipertensi menjadi strategi kunci untuk menurunkan beban penyakit, mencegah komplikasi, dan meningkatkan kualitas hidup. Kolaborasi antara penderita, keluarga, tenaga kesehatan, dan masyarakat merupakan fondasi keberhasilan pengendalian hipertensi.</p>

<h2>Arah Kebijakan dan Praktik di Masa Depan</h2>

<ol>
  <li>Integrasi manajemen diri hipertensi dalam layanan primer</li>
  <li>Pemanfaatan teknologi digital untuk monitoring tekanan darah</li>
  <li>Penguatan edukasi kesehatan berbasis komunitas</li>
  <li>Pendekatan budaya lokal dalam promosi kesehatan</li>
  <li>Pengembangan kebijakan nasional yang berkelanjutan</li>
</ol>

<h2>Pesan Kunci</h2>

<ul>
  <li>Hipertensi sering tidak bergejala, namun berdampak serius bila tidak dikendalikan</li>
  <li>Faktor risiko dapat dimodifikasi melalui perubahan gaya hidup sehat</li>
  <li>Pencegahan primer, sekunder, dan tersier harus berjalan beriringan</li>
  <li>Pengelolaan hipertensi efektif memerlukan kombinasi terapi nonfarmakologis dan farmakologis</li>
  <li>Manajemen diri yang baik meningkatkan kualitas hidup dan menurunkan risiko komplikasi</li>
</ul>

<blockquote>
  <strong>"Hipertensi dapat dikendalikan bila setiap individu berdaya dan bertanggung jawab terhadap kesehatannya."</strong>
</blockquote>

<p><em>Hipertensi tidak dapat disembuhkan, tetapi dapat dikendalikan dengan manajemen diri yang konsisten.</em></p>
`.trim()
  }
]

async function main() {
  console.log(`Seeding ${articles.length} articles...`)

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    const created = await prisma.artikelKesehatan.create({
      data: {
        perawatId: PERAWAT_ID,
        judul: article.judul,
        konten: article.konten,
        kategori: article.kategori,
        tags: article.tags,
        status: article.status,
        viewCount: 0,
      }
    })
    console.log(`[${i + 1}/${articles.length}] Created: ${created.judul}`)
  }

  console.log('\nDone! All articles have been seeded.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
