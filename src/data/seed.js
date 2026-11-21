export const BUILD = {
  LIGHT: { sx: 0.84, sy: 0.92 },
  MEDIUM: { sx: 1, sy: 1 },
  HEAVY: { sx: 1.26, sy: 1.06 },
}

const MEMBERS = [
  {
    id: 'ahmad',
    name: 'Ahmad',
    role: 'Web Developer',
    division: 'Pengembangan Web',
    build: 'HEAVY',
    sx: 1.26,
    sy: 1.06,
    aura: '#facc15',
    skin: '#d9a07a',
    hair: 'buzz',
    hairColor: '#1a1410',
    bio: 'Membangun website layanan internal dari analisis kebutuhan sampai deployment di server lokal.',
  },
  {
    id: 'abimanyu',
    name: 'Abimanyu',
    role: 'Network Admin',
    division: 'Jaringan LAN',
    build: 'LIGHT',
    sx: 0.84,
    sy: 0.9,
    aura: '#ef4444',
    skin: '#c68b64',
    hair: 'spike',
    hairColor: '#15100c',
    bio: 'Merancang topologi, menarik kabel, dan mengonfigurasi VLAN untuk jaringan kantor tiga lantai.',
  },
  {
    id: 'rafly',
    name: 'Rafly',
    role: 'Database Engineer',
    division: 'E-Arsip & Database',
    build: 'LIGHT',
    sx: 0.82,
    sy: 0.87,
    aura: '#38bdf8',
    skin: '#e3b48f',
    hair: 'side',
    hairColor: '#1b1511',
    bio: 'Mengubah arsip kertas menjadi sistem e-arsip dengan basis data terstruktur dan pencarian cepat.',
  },
  {
    id: 'fero',
    name: 'Fero',
    role: 'Dashboard Analyst',
    division: 'Dashboard & Monitoring',
    build: 'LIGHT',
    sx: 0.84,
    sy: 0.92,
    aura: '#10b981',
    skin: '#b9805b',
    hair: 'curly',
    hairColor: '#120d0a',
    bio: 'Menyusun dashboard monitoring yang merangkum data operasional menjadi grafik yang mudah dibaca.',
  },
  {
    id: 'alfi',
    name: 'Alfi',
    role: 'UI/UX & Dokumentasi',
    division: 'Desain & Laporan',
    build: 'LIGHT',
    sx: 0.85,
    sy: 0.96,
    aura: '#a855f7',
    skin: '#e0ac86',
    hair: 'cap',
    hairColor: '#1a1410',
    bio: 'Merancang antarmuka di Figma dan merapikan dokumentasi seluruh pekerjaan kelompok.',
  },
]

const JOURNALS = {
  ahmad: [
    ['2026-08-03', 'Orientasi', 'Pengenalan instansi dan pembagian tugas', 'Mengikuti pengarahan pembimbing lapangan, berkeliling ruang kerja, dan menerima penugasan membangun website layanan internal.', 'Selesai', 'meeting'],
    ['2026-08-12', 'Analisis', 'Analisis kebutuhan website layanan', 'Mewawancarai staf untuk mendata fitur yang dibutuhkan: pengajuan layanan, status permohonan, dan halaman informasi.', 'Selesai', 'meeting'],
    ['2026-08-26', 'Pengembangan', 'Membuat struktur halaman dan komponen antarmuka', 'Menyusun layout responsif, navigasi, dan komponen formulir dengan HTML, CSS, dan JavaScript.', 'Selesai', 'coding'],
    ['2026-09-09', 'Pengembangan', 'Membangun backend login dan pengajuan layanan', 'Membuat autentikasi berbasis sesi serta endpoint pengajuan layanan lengkap dengan validasi input.', 'Selesai', 'coding'],
    ['2026-09-23', 'Pengujian', 'Uji coba bersama staf dan perbaikan bug', 'Menguji dengan lima staf, mencatat 14 temuan, lalu memperbaiki sebagian besar. Dua temuan tampilan masih direvisi.', 'Revisi', 'coding'],
    ['2026-10-07', 'Deployment', 'Deploy ke server lokal dan penulisan manual', 'Memasang aplikasi di server instansi dan menulis panduan penggunaan singkat untuk staf.', 'Berjalan', 'server'],
  ],
  abimanyu: [
    ['2026-08-04', 'Survei', 'Survei kondisi jaringan LAN gedung', 'Mendata jumlah titik jaringan, switch, dan kondisi kabel di tiga lantai.', 'Selesai', 'survey'],
    ['2026-08-14', 'Perancangan', 'Merancang topologi star baru', 'Menggambar topologi dan membagi segmen jaringan per ruangan bersama pembimbing.', 'Selesai', 'meeting'],
    ['2026-08-28', 'Instalasi', 'Penarikan dan crimping kabel UTP', 'Menarik kabel Cat6 ke 18 titik dan crimping konektor RJ45 dengan standar T568B.', 'Selesai', 'survey'],
    ['2026-09-11', 'Konfigurasi', 'Konfigurasi VLAN dan DHCP', 'Membagi VLAN per divisi dan mengatur DHCP pada router agar alamat IP terdistribusi otomatis.', 'Selesai', 'server'],
    ['2026-09-25', 'Pengujian', 'Uji koneksi dan pengukuran bandwidth', 'Menjalankan ping, traceroute, dan speed test di tiap segmen, lalu mencatat hasilnya.', 'Selesai', 'server'],
    ['2026-10-09', 'Dokumentasi', 'Menyusun dokumentasi jaringan', 'Membuat dokumen topologi, tabel alamat IP, dan prosedur pemeliharaan rutin.', 'Berjalan', 'meeting'],
  ],
  rafly: [
    ['2026-08-05', 'Analisis', 'Mendata alur pengarsipan manual', 'Mengamati proses penyimpanan surat dan berkas, lalu mencatat masalah pencarian dokumen.', 'Selesai', 'meeting'],
    ['2026-08-18', 'Perancangan', 'Merancang ERD basis data e-arsip', 'Menyusun entitas dokumen, kategori, unit kerja, dan pengguna beserta relasinya.', 'Selesai', 'coding'],
    ['2026-09-01', 'Pengembangan', 'Membuat tabel dan relasi MySQL', 'Menerjemahkan ERD menjadi tabel, indeks, dan kunci asing, lalu mengisi data uji.', 'Selesai', 'server'],
    ['2026-09-15', 'Pengembangan', 'Fitur unggah dan pencarian dokumen', 'Membuat form unggah berkas PDF dan pencarian berdasarkan nomor, judul, dan kategori.', 'Selesai', 'coding'],
    ['2026-09-29', 'Digitalisasi', 'Memindai dan mengunggah arsip lama', 'Memindai 320 dokumen lama dan memasukkannya ke sistem dengan metadata lengkap.', 'Berjalan', 'survey'],
    ['2026-10-13', 'Pengujian', 'Uji hak akses dan backup basis data', 'Memastikan tiap peran hanya melihat arsip miliknya dan menjadwalkan backup harian.', 'Berjalan', 'server'],
  ],
  fero: [
    ['2026-08-06', 'Analisis', 'Menentukan indikator dashboard', 'Berdiskusi dengan pembimbing untuk memilih enam indikator operasional yang paling sering dilaporkan.', 'Selesai', 'meeting'],
    ['2026-08-20', 'Perancangan', 'Wireframe dan alur data dashboard', 'Membuat sketsa tata letak dan memetakan sumber data untuk setiap indikator.', 'Selesai', 'meeting'],
    ['2026-09-03', 'Pengembangan', 'Query agregasi data', 'Menulis query SQL untuk merangkum data harian, mingguan, dan bulanan.', 'Selesai', 'coding'],
    ['2026-09-17', 'Pengembangan', 'Grafik dan kartu ringkasan', 'Menampilkan tren dengan grafik garis dan batang serta kartu angka utama.', 'Selesai', 'coding'],
    ['2026-10-01', 'Pengujian', 'Uji performa dan akurasi data', 'Membandingkan angka dashboard dengan laporan manual dan menurunkan waktu muat ke bawah dua detik.', 'Revisi', 'server'],
    ['2026-10-15', 'Presentasi', 'Demo dashboard ke pembimbing', 'Mempresentasikan dashboard dan menerima masukan untuk filter periode.', 'Berjalan', 'meeting'],
  ],
  alfi: [
    ['2026-08-07', 'Riset', 'Riset pengguna dan kebutuhan antarmuka', 'Mengamati cara staf memakai sistem lama dan mencatat kesulitan yang mereka alami.', 'Selesai', 'meeting'],
    ['2026-08-21', 'Desain', 'Wireframe low-fidelity', 'Membuat wireframe untuk 24 layar yang dipakai oleh seluruh anggota kelompok.', 'Selesai', 'coding'],
    ['2026-09-04', 'Desain', 'Prototype high-fidelity di Figma', 'Mengubah wireframe menjadi prototype interaktif dan mengujinya pada tiga pengguna.', 'Selesai', 'coding'],
    ['2026-09-18', 'Desain', 'Design system warna dan komponen', 'Menetapkan palet warna, tipografi, serta komponen tombol dan formulir yang konsisten.', 'Selesai', 'coding'],
    ['2026-10-02', 'Dokumentasi', 'Menyusun buku laporan PKL', 'Mengumpulkan jurnal dan hasil kerja seluruh anggota menjadi satu laporan.', 'Berjalan', 'meeting'],
    ['2026-10-16', 'Presentasi', 'Latihan presentasi dan finalisasi', 'Berlatih membawakan presentasi kelompok dan merapikan materi akhir.', 'Berjalan', 'meeting'],
  ],
}

const PROJECTS = [
  { id: 'ahmad-p0', memberId: 'ahmad', title: 'Website Layanan Internal', metric: '12 Halaman', desc: 'Portal pengajuan dan pelacakan layanan untuk staf, dengan login, formulir, dan halaman status.', tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'], mock: 'web' },
  { id: 'ahmad-p1', memberId: 'ahmad', title: 'Panduan Penggunaan Aplikasi', metric: '18 Halaman', desc: 'Manual bergambar yang menjelaskan cara memakai setiap fitur website untuk staf baru.', tags: ['Dokumentasi', 'Markdown'], mock: 'web' },
  { id: 'abimanyu-p0', memberId: 'abimanyu', title: 'Jaringan LAN Topologi Star', metric: '18 Titik LAN', desc: 'Jaringan kantor tiga lantai dengan VLAN per divisi dan DHCP terpusat.', tags: ['Cisco', 'VLAN', 'DHCP', 'UTP Cat6'], mock: 'lan' },
  { id: 'abimanyu-p1', memberId: 'abimanyu', title: 'Dokumen Pemeliharaan Jaringan', metric: '3 Prosedur', desc: 'Tabel alamat IP, diagram topologi, dan langkah pemeriksaan rutin.', tags: ['Dokumentasi', 'Topologi'], mock: 'lan' },
  { id: 'rafly-p0', memberId: 'rafly', title: 'Sistem E-Arsip', metric: '320 Arsip', desc: 'Penyimpanan dan pencarian dokumen digital berdasarkan nomor, judul, dan kategori.', tags: ['MySQL', 'PHP', 'PDF'], mock: 'archive' },
  { id: 'rafly-p1', memberId: 'rafly', title: 'Rancangan Basis Data', metric: '9 Tabel', desc: 'ERD dan skema tabel dengan indeks untuk pencarian cepat serta jadwal backup harian.', tags: ['ERD', 'SQL'], mock: 'archive' },
  { id: 'fero-p0', memberId: 'fero', title: 'Dashboard Monitoring Operasional', metric: '6 Indikator', desc: 'Kartu ringkasan dan grafik tren harian sampai bulanan dengan filter periode.', tags: ['SQL', 'Chart.js', 'JavaScript'], mock: 'dashboard' },
  { id: 'fero-p1', memberId: 'fero', title: 'Laporan Otomatis Mingguan', metric: '1 Menit', desc: 'Rekap angka mingguan yang dibuat otomatis, menggantikan penyusunan manual.', tags: ['SQL', 'Laporan'], mock: 'dashboard' },
  { id: 'alfi-p0', memberId: 'alfi', title: 'Prototype Antarmuka Sistem', metric: '24 Layar', desc: 'Prototype interaktif di Figma yang menjadi acuan tampilan semua aplikasi kelompok.', tags: ['Figma', 'Prototype', 'UX'], mock: 'web' },
  { id: 'alfi-p1', memberId: 'alfi', title: 'Buku Laporan PKL Kelompok', metric: '1 Laporan', desc: 'Laporan terpadu yang memuat jurnal, hasil kerja, dan dokumentasi lima anggota.', tags: ['Dokumentasi', 'Laporan'], mock: 'dashboard' },
]

export function monthOf(date) {
  const m = Number(String(date).slice(5, 7)) - 7
  return m >= 1 && m <= 3 ? m : 0
}

export function seed() {
  const journals = []
  Object.keys(JOURNALS).forEach((memberId) => {
    JOURNALS[memberId].forEach((row, index) => {
      journals.push({
        id: `${memberId}-j${index}`,
        memberId,
        date: row[0],
        month: monthOf(row[0]),
        category: row[1],
        title: row[2],
        desc: row[3],
        status: row[4],
        photo: row[5],
      })
    })
  })

  return {
    members: MEMBERS.map((m) => ({ ...m })),
    journals,
    projects: PROJECTS.map((p) => ({ ...p, tags: [...p.tags] })),
  }
}
