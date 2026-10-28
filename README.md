# E-Laporan PKL // Ditjen Kuathan Kemhan RI

Platform web presentasi interaktif, jurnal kegiatan harian (*logbook*), dan portofolio hasil kerja terpadu untuk kelompok siswa Praktik Kerja Lapangan (PKL) di **Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan), Kementerian Pertahanan Republik Indonesia**.

---

## 🏛️ Profil Instansi & Periode Pelaksanaan

* **Instansi Mitra:** Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan), Kementerian Pertahanan RI
* **Institusi Pendidikan:** SMK Mitra
* **Durasi Magang:** 2 Bulan
* **Tujuan Utama:** Transformasi laporan pertanggungjawaban cetak konvensional menjadi media sidang digital interaktif yang menyajikan data kinerja nyata perorangan dan kelompok secara transparan, terstruktur, dan elegan.

---

## 👥 Struktur Tim & Pembagian Penugasan

Aplikasi ini mengintegrasikan capaian kerja dari 5 siswa magang dengan peran dan unit kerja kedinasan yang berbeda:

| No | Nama Siswa | Peran / Spesialisasi | Subbagian / Divisi Penempatan | Fokus Tanggung Jawab |
|:---:|:---|:---|:---|:---|
| **01** | **Ahmad** | IT Support & Sistem | Subbag Datin / IT Support | Helpdesk IT, troubleshooting jaringan intranet/LAN, maintenance hardware PC staf, dan otomasi web sistem tiket internal. |
| **02** | **Abimanyu** | Tata Usaha SDM | Bagian TU / Subbag SDM | Digitalisasi berkas kepegawaian, verifikasi data induk personel, monitoring absensi, dan penataan arsip mutasi/pangkat. |
| **03** | **Rafly** | Tata Usaha Ditmat | Bagian TU Dit Materiil | Administrasi logistik dinas, registrasi surat masuk/keluar materiil pertahanan, dan pengindeksan BAST pengadaan materiil. |
| **04** | **Fero** | IT Support & Teknisi | Subbag Datin / IT Support | Maintenance fisik PC kerja, instalasi sistem operasi terstandarisasi dinas, perbaikan printer sharing, dan teknisi Vicon rapat. |
| **05** | **Alfi** | Tata Usaha Fasjas | Bagian TU Dit Fasilitas & Jasa | Pendataan inventaris sarana prasarana dinas, administrasi pemeliharaan fasilitas gedung/kantor, dan pengarsipan naskah dinas. |

---

## ✨ Fitur-Fitur Utama Platform

### 1. Panggung Interaktif Karakter Avatar (Vector 2D SVG)
* Menampilkan visualisasi karakter kustom untuk setiap siswa berbasis vektor murni tanpa ketergantungan aset bitmap berat.
* Dilengkapi efek *spotlight beam*, rotasi lineup dinamis, serta transisi kartu bio otomatis yang mempertegas peran masing-masing siswa.

### 2. Logbook / Jurnal Kegiatan Harian Terverifikasi
* Rekapitulasi runtut seluruh aktivitas kerja harian siswa selama masa penugasan 2 bulan.
* Filter pencarian instan berdasarkan bulan penugasan (*Bulan 1*, *Bulan 2*) dan kata kunci teknis.
* Kartu akordion detail yang memuat uraian pekerjaan, kategori bidang tugas, dokumentasi visual, serta status penyelesaian tugas.

### 3. Galeri Hasil Kerja & Featured Projects
* Showcase hasil kerja nyata dan proyek teknis yang telah diimplementasikan di lingkungan kerja Ditjen Kuathan Kemhan.
* Dilengkapi *interactive live preview card* yang mensimulasikan sistem web aplikasi, arsitektur topologi jaringan LAN, dan sistem pangkalan data e-arsip.

### 4. Navigasi Cepat Sidang (Presentation Hotkeys)
Dirancang khusus untuk mendukung kelancaran pemaparan saat berhadapan dengan Dewan Penguji dan Guru Pembimbing:
* `1` - `5`: Beralih instan ke profil siswa yang dipilih (Ahmad, Abimanyu, Rafly, Fero, Alfi).
* `←` / `→`: Menavigasi ke siswa sebelumnya / selanjutnya.
* Pintasan terintegrasi penuh dengan motor *smooth-scrolling* untuk perpindahan bagian yang mulus di layar proyektor.

### 5. Panel Kontrol Manajemen Data & Offline Redundancy
* Antarmuka terpadu untuk memperbarui jurnal kegiatan harian, menambahkan proyek baru, serta memperbarui bio profil.
* Menggunakan persistensi *LocalStorage* berkecepatan tinggi dengan fitur pencadangan data mandiri:
  * **Ekspor JSON:** Menyimpan seluruh data logbook kelompok ke dalam berkas cadangan offline.
  * **Impor & Sinkronisasi JSON:** Memulihkan seluruh data secara instan pada laptop/perangkat penguji tanpa ketergantungan koneksi server internet.

---

## 🛠️ Arsitektur & Teknologi

* **Frontend Framework:** React 19 (Component-driven Architecture & `React.memo` performance optimization)
* **Build Tool & Bundler:** Vite 8 dengan konfigurasi *vendor code-splitting* (App core chunk < 25 kB gzipped)
* **Styling & Design System:** Tailwind CSS v4 (Modern dark-slate high-contrast palette dengan aksen kuning dinas Kemhan)
* **Motion Engine:** GSAP (GreenSock Animation Platform) 3 & ScrollTrigger (Hardware-accelerated transforms & timeline sequencing)
* **Smooth Scrolling:** Lenis Scroll Engine terintegrasi dengan GSAP ticker
* **Iconography:** Lucide Icons (Tree-shaken ES modules)
