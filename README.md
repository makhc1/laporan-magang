# PKL Squad Arena

Landing page bertema arena/competition show untuk laporan Praktik Kerja Lapangan
lima anggota. Versi React dari `legacy/index.html` (file HTML statis lama tetap
disimpan apa adanya sebagai referensi).

## Stack

- **Vite 8** + **React 19**
- **Tailwind CSS 4** (via `@tailwindcss/vite`, tema di `src/index.css`)
- **Motion** (Framer Motion) untuk animasi masuk, carousel karakter, dan accordion
- **React Router 7** untuk URL per anggota, login page, dan dashboard
- **Database**: **Supabase (PostgreSQL + Realtime)** dengan fallback otomatis ke `localStorage` offline cache

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output ke dist/
npm run preview  # cek hasil build
```

## Setup Database Supabase (Multi-User & Real-time)

Aplikasi ini sudah siap terhubung ke **Supabase** agar seluruh perubahan kegiatan magang tersimpan online di PostgreSQL dan ter-update secara real-time antar perangkat.

### Langkah Setup Supabase:

1. Buat project baru secara gratis di [supabase.com](https://supabase.com).
2. Di dashboard Supabase, buka menu **SQL Editor** &rarr; **New Query**.
3. Buka file [supabase/schema.sql](file:///home/ahmad/Dokumen/CODE/magang_++/supabase/schema.sql) di project ini, salin seluruh kodenya, tempel ke SQL Editor Supabase, lalu klik **Run**.
   - Skrip ini otomatis membuat tabel `members`, `journals`, `projects`, mengatur RLS policy, mengaktifkan Realtime, serta mengisi data awal (*seed*).
4. Buat file `.env.local` di folder project ini (bisa salin dari `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
5. Isi konfigurasi Supabase di `.env.local` (didapat dari Supabase &rarr; **Project Settings** &rarr; **API**):
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. Jalankan `npm run dev`. Aplikasi akan otomatis terhubung ke Supabase dengan status `Cloud: Supabase (Realtime)`!

> *Catatan: Jika Supabase belum dikonfigurasi, aplikasi tetap otomatis berjalan normal menggunakan penyimpanan lokal (`localStorage`).*

## Routing & Akses

| URL | Isi |
| --- | --- |
| `/` | dialihkan ke `/squad/<anggota-pertama>` |
| `/login` | halaman login anggota magang & admin |
| `/dashboard` | dashboard kegiatan magang (otomatis ke akun yang sedang login) |
| `/squad/ahmad` | halaman arena anggota (id: `ahmad`, `abimanyu`, `rafly`, `fero`, `alfi`) |
| `/squad/ahmad/dashboard` | dashboard kegiatan anggota Ahmad |
| `/squad/ahmad/admin` | alias dashboard admin/anggota |

## Autentikasi & Akun Login

Setiap anggota magang dapat login melalui tombol **Login Anggota** di navigasi bar, tombol di Hero, atau URL `/login`.

### Kredensial Login:
- **Akun Anggota Magang**:
  - **Username**: ID atau nama anggota (contoh: `ahmad`, `abimanyu`, `rafly`, `fero`, `alfi`)
  - **Password default**: `magang2026` (atau `pkl2026`, atau ID anggota)
  - Di halaman login juga disediakan tombol **⚡ Pilih Cepat Akun (Demo Login)** untuk masuk instan dengan satu klik.
  - Anggota dapat mengganti password mereka sendiri di tab **Profil & Akun**.
- **Akun Super Admin**:
  - **Username**: `admin`
  - **Password**: `pkl2026` (dapat dikustomisasi via `.env.local` / `VITE_ADMIN_USER` & `VITE_ADMIN_PASS`)

## Dashboard Kegiatan Magang

Setelah login, anggota masuk ke **Dashboard Kegiatan Magang** untuk mengelola data mereka secara mandiri:

1. **Jurnal Kegiatan Harian**:
   - **Catat Cepat**: cukup tanggal, kategori (chip), dan satu kalimat kegiatan. Judul dibuat otomatis dari deskripsi bila dikosongkan; foto/status masuk bagian *Detail opsional*.
   - **Simpan & lanjut**: menyimpan entri lalu langsung menyiapkan tanggal kosong berikutnya. Tombol **Salin kegiatan terakhir** membantu mengisi hari yang mirip.
   - **Draft autosave**: ketikan yang belum disimpan tetap tersimpan di browser dan dipulihkan saat form dibuka lagi.
   - **Progres hari kerja** (1 Oktober – 30 November 2026, Senin–Jumat): jumlah hari terisi, hari kosong, progress bar, dan tombol lompat ke tanggal kosong.
   - **Isi Seminggu**: mode borongan untuk mengisi hingga 5 hari kerja kosong sekaligus (Enter pindah baris).
   - Mengganti / edit isi kegiatan yang sudah ada.
   - Hapus kegiatan (dengan konfirmasi aman).
   - Filter kegiatan per periode bulan (Bulan 1 = Oktober, Bulan 2 = November) dan status (Selesai, Berjalan, Revisi), serta pencarian teks.
2. **Featured Project & Output Magang**:
   - Tambah project magang baru (judul, metric pencapaian, mockup visual, deskripsi, tech stack).
   - Mengganti / edit isi project.
   - Hapus project.
3. **Profil & Keamanan Akun**:
   - Ubah nama, peran/role, divisi, bio, postur karakter, dan warna aura spotlight.
   - Perbarui password login anggota.
4. **Fitur Tambahan Super Admin**:
   - Switcher untuk mengelola kegiatan semua anggota.
   - Tambah contestant/anggota magang baru ke arena.
   - Backup/Import seluruh data sebagai JSON atau reset ke data contoh.
   - Tombol manual sync ke database Supabase.

> Periode magang diatur di `src/lib/pkl.js` melalui `PKL_START` dan `PKL_END`. Hari kerja dihitung Senin–Jumat, jadi jumlah harinya menyesuaikan rentang tanggal tersebut.

## Struktur

```
src/
  main.jsx              entry React + BrowserRouter
  App.jsx               halaman squad: routing, auth session, view coordinator
  index.css             Tailwind theme + komponen (.btn, .chip, .tl, stage)
  data/seed.js          data contoh: 5 anggota, 30 jurnal, 10 project
  lib/
    supabase.js         koneksi Supabase client, realtime, dan data mappers
    auth.js             autentikasi anggota magang & admin, session management
    useData.js          load/save Supabase + optimistic localStorage cache
    pkl.js              periode magang (1 Okt–30 Nov), tanggal kosong, tanggal berikutnya
    utils.js            format tanggal, warna status, judul otomatis, helper
  components/
    Nav.jsx             navigasi sticky + status login & shortcut dashboard
    Hero.jsx            hero briefing + statistik + tombol login anggota
    Stage.jsx           panggung carousel karakter
    Avatar.jsx          avatar SVG prosedural (5 gaya rambut, 3 postur)
    Logbook.jsx         timeline jurnal + project + banner akses dashboard
    LoginPage.jsx       halaman login anggota magang & admin + demo quick select
    Dashboard.jsx       dashboard mandiri untuk menambah & mengganti kegiatan magang
    Mockup.jsx          mockup SVG project (web/LAN/arsip/dashboard)
    Photo.jsx           ilustrasi dokumentasi jurnal
    Admin.jsx           wrapper backwards-compatibility untuk Dashboard
    AdminLogin.jsx      wrapper backwards-compatibility untuk LoginPage
    Tri.jsx             logo segitiga
supabase/
  schema.sql            skema PostgreSQL Supabase, RLS policies, dan initial seed
```
