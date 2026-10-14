# LKPD Interaktif & Cetak: Modularitas Python Kelas X (Koding & Kecerdasan Artifisial)

Aplikasi Lembar Kerja Peserta Didik (LKPD) digital komprehensif dan siap cetak untuk mata pelajaran Koding & Kecerdasan Artifisial Kelas X SMA/SMK, berfokus pada materi Algoritma Pemrograman topik Modularitas dengan Python, fungsi dengan parameter dan nilai balik, optimasi kode, serta studi kasus bertahap pembangunan Sistem Kasir Otomatis.

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan konfirmasi pada tahap klarifikasi:
> 1. **Format Lembar Kerja**: Mendukung **Dual-Mode** — Mode Interaktif Digital (langsung dikerjakan siswa di browser) dan Mode Siap Cetak PDF (tata letak kertas A4 standar modul ajar Kurikulum Merdeka lengkap dengan kop sekolah, identitas siswa, petunjuk pengerjaan, dan kolom paraf guru).
> 2. **Cakupan Studi Kasus**: Disusun secara **Bertahap Lengkap (Modul 1 s.d. Modul 4)** mulai dari fungsi kalkulasi harga dasar, fungsi penentuan diskon bertingkat & diskon member, fungsi penghitungan pajak & total bersih, hingga fungsi cetak struk belanja rapi.
> 3. **Fitur Pengujian & Evaluasi**: Dilengkapi **Interactive Python Sandbox** dengan validator otomatis (test-runner) untuk menguji keluaran kode siswa, serta panel **Rubrik Penilaian & Kunci Jawaban Guru** yang dapat dikunci atau dibuka dengan sandi/toggle guru.

- **Keputusan Terkonfirmasi 1**: Format Dual-Mode (Interaktif Web & Mode Cetak Dokumen PDF resmi).
- **Keputusan Terkonfirmasi 2**: Studi kasus kasir otomatis modular 4 tahap dari input hingga struk final.
- **Keputusan Terkonfirmasi 3**: Integrasi Python Execution Sandbox (client-side interpreter & regex/AST rule validator) serta Rubrik Penilaian Standar Asesmen Otentik.
- **Keputusan Terkonfirmasi 4**: Navigasi multi-bagian: (1) Identitas & Tujuan Pembelajaran, (2) Stimulus & Eksplorasi Konsep, (3) Latihan Terstruktur & Optimasi Kode, (4) Proyek Kasir Otomatis Bertahap, (5) Refleksi & Rubrik Penilaian Guru.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Sebuah platform LKPD digital inovatif yang menggabungkan buku kerja siswa berbasis cetak dengan lingkungan pemrograman interaktif. Siswa kelas X dapat mempelajari mengapa kode monolitik (*spaghetti code*) sulit dirawat dan bagaimana mendekomposisinya menjadi fungsi-fungsi modular yang dapat digunakan kembali (*reusable*), hemat baris (*DRY - Don't Repeat Yourself*), dan mudah diuji.
- **Sasaran Pengguna**: Siswa Kelas X (Fase E Kurikulum Merdeka) pada mata pelajaran Koding dan Kecerdasan Artifisial / Informatika, serta Guru Pengampu sebagai instrumen asesmen formatif dan sumatif.
- **Nilai Utama**:
  - Konsep teoritis tidak abstrak: perbandingan visual langsung antara "Kode Monolitik Tanpa Fungsi" vs "Kode Modular Berbasis Fungsi".
  - Umpan balik seketika (*instant feedback*): validator otomatis memeriksa apakah siswa mendefinisikan nama fungsi yang tepat, parameter yang benar, dan mengembalikan `return` value yang diharapkan.
  - Portabilitas: Satu klik tombol "Cetak LKPD / Simpan PDF" menghasilkan layout cetak profesional berstandar dokumen sekolah tanpa elemen navigasi browser.

---

## 2. User Experience & Visual Design

### Alur Pengguna (User Flow)
1. **Header & Pengisian Identitas Siswa**: Siswa mengisi Nama, Kelas, Kelompok, dan Tanggal Pengerjaan. Data tersimpan otomatis di browser (`localStorage`).
2. **Tab / Bagian Pembelajaran**:
   - **Bagian 1: Capaian & Tujuan Pembelajaran (ATP)**: Peta konsep modularitas, parameter, argumen, dan return value.
   - **Bagian 2: Eksplorasi Konsep (Monolitik vs Modular)**: Komparator interaktif yang mendemonstrasikan perbaikan redundansi kode.
   - **Bagian 3: Latihan Terstruktur (Optimasi Kode)**: 3 soal terstruktur:
     - *Latihan A*: Pembuatan fungsi konversi suhu & kalkulasi diskon dasar.
     - *Latihan B*: Menemukan bug & mengoptimalkan fungsi yang redundan.
     - *Latihan C*: Pembuatan fungsi validasi input numerik.
   - **Bagian 4: Studi Kasus Sistem Kasir Otomatis (Proyek Utama)**:
     - *Modul 1*: `hitung_subtotal(harga_satuan, jumlah_barang)`
     - *Modul 2*: `hitung_diskon(subtotal, status_member)`
     - *Modul 3*: `hitung_pajak_dan_total(subtotal, diskon, tarif_pajak=0.11)`
     - *Modul 4*: `cetak_struk_belanja(nama_kasir, daftar_item, subtotal, diskon, pajak, total_akhir)`
     - *Integrasi Akhir*: Menjalankan keseluruhan modul dalam program utama `main()`.
   - **Bagian 5: Refleksi Siswa, Rubrik Penilaian & Pembahasan Guru**: Penilaian diri mandiri siswa dan Rubrik Analitik Guru (Skor 1-4 untuk Dekomposisi Masalah, Sintaks Fungsi, Optimasi Kode, dan Kerapian Output).
3. **Fitur Eksekusi & Pengujian**:
   - Setiap tugas dilengkapi editor kode Python dengan penyorotan sintaks (*syntax highlighting*).
   - Tombol "Jalankan Kode" mengeksekusi logika Python langsung di browser.
   - Tombol "Uji Solusi (Autograder)" menjalankan serangkaian unit test dan menampilkan status verifikasi (Misal: `✓ hitung_subtotal(5000, 3) mengembalikan 15000`).
4. **Mode Cetak / Ekspor PDF**:
   - Tombol "Cetak LKPD / Ekspor PDF" di bagian atas mengaktifkan tata letak khusus `@media print` yang rapi dengan format lembar tugas resmi Kementerian/Sekolah, menghilangkan tombol interaktif yang tidak perlu, dan menyusun ruang kosong bergaris untuk catatan tulisan tangan jika dicetak kosong.

### Visual Identity & Theme
- **Gaya Desain**: Bersih, akademis modern (*Educational Modern*), berpedoman pada prinsip *Anti-Slop* dan ramah cetak.
- **Palet Warna (60-30-10)**:
  - 60% Canvas: Slate-50 / Putih bersih (`#F8FAFC`, `#FFFFFF`).
  - 30% Struktur: Slate-800 (`#1E293B`) untuk teks utama dan border kartu bergaris tipis (`#E2E8F0`).
  - 10% Aksen Edukatif: Biru Indigo / Sapphire (`#2563EB`) untuk tombol aksi utama dan Hijau Zamrud (`#059669`) untuk verifikasi tes berhasil.
- **Tipografi**:
  - Judul & Display: `Plus Jakarta Sans` / `DM Sans` (SemiBold / Bold).
  - Teks Badan: `Plus Jakarta Sans` (14px–16px, line-height 1.6).
  - Kode & Numerik: `JetBrains Mono` / `IBM Plex Mono` (`tabular-nums`).

---

## 3. Key Product Decisions & Trade-Offs

- **Keputusan 1: Mesin Eksekusi Python Sisi Klien (Lightweight Client-Side Python Engine)**
  - *Pendekatan*: Menggunakan mesin simulasi parser/runtime Python berbasis JavaScript yang aman, cepat, dan bekerja tanpa memerlukan backend server atau latensi jaringan.
  - *Alasan*: Pengguna kelas X di laboratorium sekolah sering mengalami kendala kuota atau koneksi internet tidak stabil. Runtime sisi klien menjamin respon seketika (<100ms) saat menekan tombol "Jalankan Kode".
  - *Alternatif yang Ditolak*: Backend remote execution server (Docker/API) yang rentan timeout, membutuhkan koneksi internet konstan, dan biaya server tinggi.

- **Keputusan 2: Dual Mode - Form Interaktif & Template Cetak Bersih**
  - *Pendekatan*: Menggunakan CSS `@media print` murni dengan page-break terstruktur. Ketika dicetak, editor kode berubah menjadi blok cetak rapi dengan font monospace, dan input jawaban siswa tercetak jelas di lembar fisik.
  - *Alasan*: Guru dapat menggunakan aplikasi ini untuk dua skenario: praktikum komputer tanpa kertas (*paperless lab*) maupun ujian tertulis berbasis kertas (*printed worksheet*).

- **Keputusan 3: Pembatasan Akses Kunci Jawaban Guru**
  - *Pendekatan*: Fitur "Kunci Jawaban & Pembahasan Guru" dilindungi dengan sakelar toggle konfirmasi / PIN cepat (default: `GURU-X-AI`) agar siswa tidak langsung melihat solusi sebelum mencoba.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [LKPD Koding & AI Kelas X] ── [Peta Konsep · Latihan · Kasir · Rubrik] │
│  ── [Aksi: Cetak PDF / Reset Data]                                    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌─────────────────────────┐                     ┌─────────────────────────┐
│     Identitas Siswa     │                     │     Mode Pembelajaran   │
│ (Nama, Kelas, Kelompok) │                     │ (Siswa Aktif / Guru)    │
└─────────────────────────┘                     └─────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
    ▼                                                               ▼
┌───────────────────────────────────┐   ┌─────────────────────────────────┐
│   Area Modul Belajar & Soal       │   │   Interactive Code Playground   │
│ - Konsep Modularitas & Parameter  │   │ - Editor Kode Python            │
│ - Studi Kasus Kasir 4 Modul       │   │ - Python Runtime Evaluator      │
│ - Latihan Optimasi Kode           │   │ - Unit Test Autograder Engine   │
└───────────────────────────────────┘   └─────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│           Rubrik Asesmen Guru & Format Cetak Dokumen                    │
│ - 4 Indikator Penilaian (Skala 1-4 dengan Deskriptor Kinerja)           │
│ - Nilai Otomatis & Catatan Guru                                         │
│ - Template Cetak PDF (@media print) Berstandar Lembar Sekolah           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Struktur Data Utama
- `StudentIdentity`: `{ name: string, className: string, group: string, date: string }`
- `ExerciseTask`: `{ id: string, title: string, description: string, boilerplateCode: string, solutionCode: string, testCases: TestCase[], hint: string }`
- `TestCase`: `{ inputDescription: string, testFn: (runner: PythonContext) => TestResult }`
- `KasirProjectState`: `{ currentStep: number, moduleCodes: Record<number, string>, testResults: Record<number, boolean> }`
- `RubricScore`: `{ decomposition: number, syntaxFunctions: number, optimization: number, outputFormatting: number, teacherNotes: string }`

### Mapping Interaksi & State
- Perubahan kode siswa tersimpan secara reaktif di `localStorage` sehingga progres siswa tidak hilang jika tab tidak sengaja tertutup.
- Validasi tes otomatis memberikan status visual hijau/merah terperinci untuk setiap parameter dan skenario uji.
- Tombol "Muat Kode Contoh/Solusi" (di mode guru) mengisi editor dengan implementasi ideal untuk demonstrasi di kelas.
