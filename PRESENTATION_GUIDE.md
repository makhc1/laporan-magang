# PANDUAN SIDANG & OPERASIONAL WEB PRESENTASI MAGANG
**Sistem Informasi & Logbook Terpadu Tim Magang Ditjen Kuathan Kemhan RI**

---

## 1. Ikhtisar Aplikasi
Platform web interaktif ini dirancang sebagai pengganti laporan cetak konvensional untuk pelaksanaan Sidang/Pertanggungjawaban Magang kelompok 5 Operator (**Ahmad, Abimanyu, Rafly, Fero, Alfi**) di **Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan), Kementerian Pertahanan Republik Indonesia** selama periode magang 2 bulan.

---

## 2. Cara Menjalankan Aplikasi

### Mode Pengembangan (Development)
```bash
# Masuk ke direktori proyek
cd C:\IMPORTANT_cOde\laporan-magang

# Jalankan server lokal Vite
npm run dev
```
Buka browser pada alamat `http://localhost:5173`.

### Mode Produksi (Production Build & Preview)
```bash
# Kompilasi aset statis siap deploy
npm run build

# Uji coba build produksi secara lokal
npm run preview
```

---

## 3. Daftar Pintasan Keyboard (Presentation Hotkeys)
Untuk mempermudah jalannya presentasi di hadapan Pembimbing/Dewan Penguji tanpa bergantung sepenuhnya pada klik mouse:

| Tombol Keyboard | Aksi / Fungsi |
|---|---|
| **`1`** | Beralih instan ke operator **Ahmad** (IT Support & Sistem / Subbag Datin) |
| **`2`** | Beralih instan ke operator **Abimanyu** (TU SDM / Administrasi Kepegawaian) |
| **`3`** | Beralih instan ke operator **Rafly** (TU Ditmat / Administrasi Materiil) |
| **`4`** | Beralih instan ke operator **Fero** (IT Support & Teknisi / Subbag Datin) |
| **`5`** | Beralih instan ke operator **Alfi** (TU Fasjas / Administrasi Fasilitas & Jasa) |
| **`←` / `→`** | Berpindah ke operator sebelumnya / berikutnya |
| **`P`** atau **`F`** | Membuka / menutup **Panggung Sidang Fullscreen** (Mode Slide) |
| **`A`** | Membuka / menutup **Panel Kontrol Admin & Manajemen Data** |
| **`Spasi`** | Memulai / Menjeda **Timer Sidang 15 Menit** |
| **`C`** | Mengaktifkan / Menonaktifkan **Mode Kontras Tinggi Proyektor** |
| **`?`** atau **`H`** | Membuka jendela bantuan pintasan keyboard |
| **`Esc`** | Menutup modal aktif / keluar dari panggung sidang |

---

## 4. Alur & Distribusi Waktu Sidang (Total: 15 Menit)

```
[00:00 - 02:00]  Slide 1: Pembukaan, Latar Belakang & Profil Instansi Mitra
[02:00 - 04:30]  Slide 2: Struktur Tim & Pembagian Tanggung Jawab 5 Operator
[04:30 - 09:30]  Slide 3: Deep-Dive Capaian Tiap Siswa (1 Menit/Siswa: Ahmad, Abimanyu, Rafly, Fero, Alfi)
[09:30 - 12:30]  Slide 4: Demonstrasi Proyek Nyata (SILAT, VLAN Mikrotik, E-Arsip, dsb.)
[12:30 - 15:00]  Slide 5: Kesimpulan, Evaluasi Diri & Sesi Tanya Jawab Penguji
```

> **Catatan Pengingat Waktu:**  
> Ketika waktu tersisa **kurang dari 3 menit**, header aplikasi akan menampilkan bilah peringatan merah berkedip sebagai sinyal bagi presenter untuk segera merangkum pemaparan.

---

## 5. Fitur Cetak Lembar Evaluasi & Rekapitulasi (PDF Ready)
1. Klik tombol **"Cetak Dokumen"** di bilah navigasi atas (ikon printer).
2. Tinjau lembar rekapitulasi formal yang mencakup:
   - Rekap kinerja 5 siswa (Total tugas tuntas, persentase kehadiran, jam kerja).
   - Daftar proyek & dampak efisiensi operasional.
   - Kolom tanda tangan resmi untuk: Guru Pembimbing Sekolah, Pembimbing Lapangan DU/DI, dan Dewan Penguji.
3. Klik tombol **"Cetak / Simpan PDF"** atau gunakan pintasan bawaan browser `Ctrl + P`. Layout dokumen telah dioptimalkan secara otomatis dengan warna latar putih bersih (`@media print`).

---

## 6. Prosedur Pencadangan Data (Offline Redundancy)
* Seluruh data logbook dan proyek tersimpan secara otomatis pada **LocalStorage** browser.
* Untuk memindahkan data ke laptop lain:
  1. Tekan tombol **Ekspor Sekarang (.json)** di Panel Admin tab Backup.
  2. Buka web di laptop tujuan, lalu pilih **Pulihkan Cadangan JSON** dan unggah berkas `.json` tersebut.
