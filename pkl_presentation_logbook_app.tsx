import React, { useState, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Presentation, 
  LayoutDashboard, 
  Calendar, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Upload, 
  X, 
  Search, 
  Crosshair, 
  UserCheck, 
  UserPlus, 
  RotateCcw,
  Settings,
  ArrowUp 
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ==========================================
// 1. LOCAL STORAGE KEYS & DITJEN KUATHAN KEMHAN DATA
// ==========================================
const LOCAL_STORAGE_MEMBERS_KEY = 'the_finals_pkl_kemhan_v4';
const LOCAL_STORAGE_LOGS_KEY = 'the_finals_pkl_logs_kemhan_v4';
const LOCAL_STORAGE_PROJECTS_KEY = 'the_finals_pkl_projects_kemhan_v4';

const INITIAL_MEMBERS = [
  {
    id: 'member-ahmad',
    name: 'Ahmad',
    role: 'IT SUPPORT & SISTEM',
    division: 'Subbag Datin / IT Support',
    buildType: 'HEAVY BUILD',
    bio: 'Penanganan helpdesk IT kedinasan, troubleshooting jaringan LAN & intranet kantor, pemeliharaan hardware PC kerja staf, serta otomasi sistem pelaporan internal Ditjen Kuathan Kemhan.',
    tintColor: '#facc15'
  },
  {
    id: 'member-abimanyu',
    name: 'Abimanyu',
    role: 'TATA USAHA SDM',
    division: 'Bagian TU / Subbag SDM',
    buildType: 'LIGHT BUILD',
    bio: 'Pengelolaan arsip administrasi kepegawaian, verifikasi data personel Ditjen Kuathan Kemhan, rekapitulasi presensi dinas, serta penataan berkas mutasi dan cuti pegawai.',
    tintColor: '#ef4444'
  },
  {
    id: 'member-rafly',
    name: 'Rafly',
    role: 'TATA USAHA DITMAT',
    division: 'Bagian TU Dit Materiil',
    buildType: 'LIGHT BUILD',
    bio: 'Administrasi logistik dan pencatatan distribusi materiil kedinasan, digitalisasi berkas pengadaan & mutasi materiil pertahanan, serta rekapitulasi inventaris barang dinas Ditjen Kuathan Kemhan.',
    tintColor: '#38bdf8'
  },
  {
    id: 'member-fero',
    name: 'Fero',
    role: 'IT SUPPORT & TEKNISI',
    division: 'Subbag Datin / IT Support',
    buildType: 'LIGHT BUILD',
    bio: 'Troubleshooting sistem operasi & software kedinasan, pemeliharaan printer sharing dinas, backup data penting unit kerja, dan dukungan teknis ruang rapat virtual Ditjen Kuathan Kemhan.',
    tintColor: '#10b981'
  },
  {
    id: 'member-alfi',
    name: 'Alfi',
    role: 'TATA USAHA FASJAS',
    division: 'Bagian TU Dit Fasilitas & Jasa',
    buildType: 'LIGHT BUILD',
    bio: 'Pengelolaan administrasi fasilitas kerja kedinasan, pendataan sarana & prasarana dinas, koordinasi pemeliharaan fasilitas kantor, serta arsip surat pengadaan jasa Ditjen Kuathan Kemhan.',
    tintColor: '#a855f7'
  }
];

const INITIAL_LOGS = [
  // Ahmad - IT Support
  {
    id: 'log-1',
    memberId: 'member-ahmad',
    date: '2026-02-10',
    month: 'Bulan 1',
    title: 'Troubleshooting Jaringan LAN & Intranet Ruang Staf Ditjen Kuathan',
    description: 'Melakukan pengecekan dan perbaikan koneksi LAN pada 8 PC staf lantai 2, mengganti konektor RJ45 yang longgar, dan memastikan akses ke server portal intranet Kemhan berjalan lancar tanpa packet loss.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-2',
    memberId: 'member-ahmad',
    date: '2026-02-24',
    month: 'Bulan 1',
    title: 'Konfigurasi Printer Sharing & Hak Akses Folder Jaringan Datin',
    description: 'Mengonfigurasi ulang printer jaringan multifungsi Subbag Datin agar dapat diakses bersama oleh 15 komputer staf, serta mengatur permission folder sharing dokumen kerja kedinasan.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-3',
    memberId: 'member-ahmad',
    date: '2026-03-12',
    month: 'Bulan 2',
    title: 'Pembangunan Sistem Web Pencatatan Tiket Aduan Kendala IT',
    description: 'Mengembangkan aplikasi web sederhana berbasis antarmuka modern untuk mencatat tiket aduan kendala perangkat komputer dan jaringan dari tiap direktorat di Ditjen Kuathan.',
    category: 'Sistem',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-4',
    memberId: 'member-ahmad',
    date: '2026-03-26',
    month: 'Bulan 2',
    title: 'Setup & Pendampingan Teknis Video Conference Rapat Koordinasi',
    description: 'Menyiapkan routing perangkat audio, kamera PTZ, dan koneksi platform video conference untuk rapat koordinasi Ditjen Kuathan dengan jajaran terkait.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
  },

  // Abimanyu - TU SDM
  {
    id: 'log-5',
    memberId: 'member-abimanyu',
    date: '2026-02-12',
    month: 'Bulan 1',
    title: 'Pemeriksaan & Rekapitulasi Data Induk Kepegawaian Personel',
    description: 'Melakukan verifikasi berkas riwayat hidup, kepangkatan, dan unit penempatan personel di lingkungan Ditjen Kuathan Kemhan ke dalam lembar kerja induk kepegawaian.',
    category: 'SDM',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-6',
    memberId: 'member-abimanyu',
    date: '2026-02-26',
    month: 'Bulan 1',
    title: 'Pengelolaan Administrasi Presensi & Monitoring Surat Perintah Tugas',
    description: 'Mengompilasi data absensi sidik jari pegawai, mencocokkan lampiran Surat Perintah Tugas (SPT) kedinasan, serta merekapitulasi rekap kehadiran bulanan.',
    category: 'Administrasi',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-7',
    memberId: 'member-abimanyu',
    date: '2026-03-14',
    month: 'Bulan 2',
    title: 'Digitalisasi & Pengindeksan Berkas Mutasi serta Kenaikan Pangkat',
    description: 'Memindai dokumen fisik SK Kenaikan Pangkat dan SK Mutasi ke dalam format PDF terindeks dengan kode NIP/NRP untuk mempermudah temu kembali arsip personalia.',
    category: 'SDM',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-8',
    memberId: 'member-abimanyu',
    date: '2026-03-27',
    month: 'Bulan 2',
    title: 'Penyusunan Format Rekapitulasi Evaluasi Kepegawaian Akhir Bulan',
    description: 'Menyusun laporan rekapitulasi data kekuatan personel per bagian/subbag di Ditjen Kuathan Kemhan sebagai bahan laporan evaluasi berkala pimpinan.',
    category: 'Administrasi',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },

  // Rafly - TU Ditmat
  {
    id: 'log-9',
    memberId: 'member-rafly',
    date: '2026-02-15',
    month: 'Bulan 1',
    title: 'Registrasi & Pendataan Surat Masuk/Keluar Distribusi Materiil',
    description: 'Mencatat nomor agenda, asal instansi, perihal, dan mendistribusikan disposisi berkas administrasi materiil pertahanan kepada staf teknis Dit Materiil.',
    category: 'Materiil',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-10',
    memberId: 'member-rafly',
    date: '2026-02-27',
    month: 'Bulan 1',
    title: 'Inventarisasi Aset Barang & Logistik Kerja Subbag Materiil',
    description: 'Mengecek ketersediaan fisik barang materiil perkantoran dan logistik kedinasan, mencocokkan nomor inventaris, serta mencatat status kondisi barang.',
    category: 'Logistik',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-11',
    memberId: 'member-rafly',
    date: '2026-03-16',
    month: 'Bulan 2',
    title: 'Penataan Arsip Digital Berita Acara Serah Terima (BAST) Materiil',
    description: 'Mengelompokkan dan mengarsipkan dokumen BAST pengadaan materiil berdasarkan tahun anggaran dan rekanan pengadaan dalam format digital terstruktur.',
    category: 'Materiil',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-12',
    memberId: 'member-rafly',
    date: '2026-03-29',
    month: 'Bulan 2',
    title: 'Rekapitulasi Laporan Triwulan Distribusi Materiil Ditjen Kuathan',
    description: 'Menyusun rekapitulasi data sirkulasi material dinas dan membuat lembar verifikasi berkas pengiriman logistik untuk evaluasi berkala.',
    category: 'Logistik',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },

  // Fero - IT Support
  {
    id: 'log-13',
    memberId: 'member-fero',
    date: '2026-02-14',
    month: 'Bulan 1',
    title: 'Pembersihan Fisik PC Kerja & Pengecekan Kinerja Hardware',
    description: 'Melakukan perawatan berkala pada 12 unit PC staf Ditjen Kuathan, membersihkan debu kipas pendingin prosesor, dan memeriksa kondisi kesehatan storage SSD.',
    category: 'Hardware',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-14',
    memberId: 'member-fero',
    date: '2026-02-25',
    month: 'Bulan 1',
    title: 'Instalasi Sistem Operasi & Standarisasi Software Kerja Dinas',
    description: 'Melakukan instalasi ulang sistem operasi Windows pada PC pengganti staf, menginstal driver resmi, antivirus kedinasan, dan konfigurasi profil akun pengguna.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-15',
    memberId: 'member-fero',
    date: '2026-03-15',
    month: 'Bulan 2',
    title: 'Troubleshooting Printer Macet & Penggantian Toner Dinas',
    description: 'Memperbaiki kendala paper jam pada printer laser printer dinas, mengganti cartridge toner, serta melakukan kalibrasi hasil cetak dokumen naskah dinas.',
    category: 'Hardware',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-16',
    memberId: 'member-fero',
    date: '2026-03-28',
    month: 'Bulan 2',
    title: 'Backup Data Rutin Berkas Unit Kerja & Manajemen Kabel Workstation',
    description: 'Membantu proses backup berkas kerja penting staf ke penyimpanan eksternal aman, serta merapikan perkabelan daya dan data di bawah meja kerja pegawai.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },

  // Alfi - TU Fasjas
  {
    id: 'log-17',
    memberId: 'member-alfi',
    date: '2026-02-16',
    month: 'Bulan 1',
    title: 'Pendataan & Pengecekan Kondisi Sarana Prasarana Ruang Kerja',
    description: 'Menginspeksi kelayakan perangkat pendingin udara (AC), pencahayaan, dan kelengkapan fasilitas operasional staf pada ruangan Direktorat Fasilitas dan Jasa.',
    category: 'Fasjas',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-18',
    memberId: 'member-alfi',
    date: '2026-02-28',
    month: 'Bulan 1',
    title: 'Administrasi Permohonan Perbaikan Fasilitas & Perlengkapan Kantor',
    description: 'Membuat rekapitulasi form usulan perbaikan sarana kantor dari berbagai ruangan dan meneruskan nota dinas tindak lanjut ke bagian pemeliharaan.',
    category: 'Administrasi',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-19',
    memberId: 'member-alfi',
    date: '2026-03-18',
    month: 'Bulan 2',
    title: 'Penataan Berkas Kontrak Kerja Sama Pengadaan Jasa Kebersihan & Gedung',
    description: 'Menyortir dan menyusun arsip dokumen perjanjian kerja sama jasa perawatan gedung serta pengadaan perlengkapan kantor agar tersimpan sistematis.',
    category: 'Fasjas',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-20',
    memberId: 'member-alfi',
    date: '2026-03-30',
    month: 'Bulan 2',
    title: 'Penyusunan Rekap Inventarisasi Fasilitas Gedung Triwulan I',
    description: 'Mengompilasi data akhir kondisi fasilitas kerja, menyusun laporan status pemeliharaan berkala sarpras, serta pengarsipan lembar kontrol gedung.',
    category: 'Sarpras',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_PROJECTS = [
  // Ahmad - IT Support
  {
    id: 'proj-1',
    memberId: 'member-ahmad',
    title: 'Sistem Manajemen Tiket Helpdesk IT Datin',
    description: 'Aplikasi pencatatan dan monitoring aduan kendala teknis komputer, printer, dan konektivitas jaringan staf Ditjen Kuathan Kemhan agar tertangani cepat dan terdata transparan.',
    tags: ['Helpdesk IT', 'Intranet Kemhan', 'Monitoring', 'IT Support'],
    metric: '100% Tercatat',
    previewType: 'web'
  },
  {
    id: 'proj-2',
    memberId: 'member-ahmad',
    title: 'Revitalisasi Jalur Jaringan LAN Lantai Kerja',
    description: 'Penataan ulang perkabelan patch cord pada rack switch dan crimping ulang 20 titik terminal LAN ruang staf guna memastikan koneksi stabil tanpa gangguan latency.',
    tags: ['Jaringan LAN', 'UTP Cat6', 'Switch Rack', 'Troubleshooting'],
    metric: '20 Titik Optimal',
    previewType: 'network'
  },

  // Abimanyu - TU SDM
  {
    id: 'proj-3',
    memberId: 'member-abimanyu',
    title: 'Digitalisasi Database Arsip Personel Ditjen Kuathan',
    description: 'Alih media dan pengelompokan 200+ berkas arsip kepegawaian personel ke format digital PDF terindeks dengan sistem penamaan kode bagian yang mempermudah pencarian berkas.',
    tags: ['Database SDM', 'E-Filing', 'Kepegawaian', 'Arsip Digital'],
    metric: '200+ Dokumen',
    previewType: 'archive'
  },
  {
    id: 'proj-4',
    memberId: 'member-abimanyu',
    title: 'Sistem Rekapitulasi Presensi & Surat Tugas Kedinasan',
    description: 'Pengembangan template otomasi spreadsheet untuk verifikasi kehadiran bulanan dan monitoring surat perintah tugas dinas personel secara cepat dan akurat.',
    tags: ['Otomasi Spreadsheet', 'Presensi Dinas', 'Administrasi SDM'],
    metric: 'Efisien & Akurat',
    previewType: 'dashboard'
  },

  // Rafly - TU Ditmat
  {
    id: 'proj-5',
    memberId: 'member-rafly',
    title: 'Katalog Digital Inventaris Materiil Kedinasan',
    description: 'Penyusunan basis data katalog inventaris barang dan logistik materiil Ditjen Kuathan Kemhan terstruktur untuk mempermudah pengecekan stok dan mutasi barang dinas.',
    tags: ['Katalog Materiil', 'Ditmat', 'Inventarisasi', 'Logistik Kemhan'],
    metric: 'Data Terstruktur',
    previewType: 'archive'
  },
  {
    id: 'proj-6',
    memberId: 'member-rafly',
    title: 'Monitoring Berita Acara Serah Terima (BAST) Materiil',
    description: 'Penyusunan dashboard rekapitulasi alur dokumen BAST pendistribusian materiil pertahanan antar-satuan kerja guna memastikan validitas fisik dan administrasi barang.',
    tags: ['BAST Materiil', 'Logistik', 'Administrasi', 'Validasi Data'],
    metric: '100% Tervalidasi',
    previewType: 'dashboard'
  },

  // Fero - IT Support
  {
    id: 'proj-7',
    memberId: 'member-fero',
    title: 'Pemeliharaan & Standarisasi 25+ PC Kerja Staf',
    description: 'Pelaksanaan perawatan komprehensif hardware komputer, pembersihan berkala, instalasi sistem operasi terstandarisasi, serta konfigurasi driver printer sharing dinas.',
    tags: ['Hardware PC', 'Maintenance OS', 'Security Update', 'Printer Sharing'],
    metric: '25+ PC Siap Kerja',
    previewType: 'dashboard'
  },
  {
    id: 'proj-8',
    memberId: 'member-fero',
    title: 'Penataan Infrastruktur Kabel Workstation Staf',
    description: 'Manajemen kabel daya dan jalur data pada meja kerja staf Ditjen Kuathan agar rapi, aman dari risiko korsleting, serta meminimalisir gangguan koneksi fisik.',
    tags: ['Cable Management', 'Workstation', 'IT Support', 'Keamanan Kerja'],
    metric: 'Rapi & Zero Issue',
    previewType: 'network'
  },

  // Alfi - TU Fasjas
  {
    id: 'proj-9',
    memberId: 'member-alfi',
    title: 'Sistem Inventarisasi Sarana & Fasilitas Kerja',
    description: 'Penyusunan database pemetaan kondisi sarana kerja, inventaris peralatan ruangan, serta jadwal pemeliharaan fasilitas pada Direktorat Fasilitas dan Jasa.',
    tags: ['Fasjas', 'Sarana Prasarana', 'Inventaris Gedung', 'Ditjen Kuathan'],
    metric: 'Fasilitas Terpantau',
    previewType: 'archive'
  },
  {
    id: 'proj-10',
    memberId: 'member-alfi',
    title: 'Digitalisasi Berkas Pengadaan & Layanan Jasa Kedinasan',
    description: 'Penyortiran, pemindaian, dan pengindeksan dokumen administrasi kerja sama jasa operasional kantor Ditjen Kuathan untuk kemudahan monitoring masa berlaku kontrak.',
    tags: ['E-Dokumen', 'Pengadaan Jasa', 'Administrasi Fasjas', 'Arsip Digital'],
    metric: 'Kontrak Terindeks',
    previewType: 'archive'
  }
];

const PRESET_IMAGES = [
  { label: 'IT Support / Jaringan', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tata Usaha / Berkas', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hardware PC / Server', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fasilitas & Logistik', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80' }
];

// ==========================================
// 2. VECTOR 2D SVG "THE FINALS" FULL-BODY CONTESTANT
// ==========================================
const TheFinalsSVGAvatar = ({ memberId, buildType, tintColor, isSelected }) => {
  const stripeColor = '#facc15';

  const charAppearance = {
    'member-ahmad': { skin: '#e0a984', skinShadow: '#b87d59', hair: '#1a1817', scaleX: 1.26, scaleY: 1.06 },
    'member-abimanyu': { skin: '#c68b63', skinShadow: '#99623f', hair: '#231915', scaleX: 0.84, scaleY: 0.90 },
    'member-rafly': { skin: '#8d583b', skinShadow: '#633922', hair: '#111111', scaleX: 0.82, scaleY: 0.87 },
    'member-fero': { skin: '#dca47e', skinShadow: '#b07854', hair: '#27211e', scaleX: 0.84, scaleY: 0.92 },
    'member-alfi': { skin: '#d1956c', skinShadow: '#a36b46', hair: '#181514', scaleX: 0.85, scaleY: 0.96 }
  }[memberId] || {
    skin: '#dca47e',
    skinShadow: '#b07854',
    hair: '#1a1817',
    scaleX: buildType === 'HEAVY BUILD' ? 1.24 : 0.84,
    scaleY: buildType === 'HEAVY BUILD' ? 1.05 : 0.90
  };

  const { scaleX, scaleY } = charAppearance;

  return (
    <svg viewBox="0 0 260 520" className="w-full h-full overflow-visible select-none" fill="none">
      <defs>
        <linearGradient id={`suitGrad-${memberId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#262936" />
          <stop offset="55%" stopColor="#171922" />
          <stop offset="100%" stopColor="#0e1017" />
        </linearGradient>
        <linearGradient id={`pantsGrad-${memberId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e202b" />
          <stop offset="50%" stopColor="#12131a" />
          <stop offset="100%" stopColor="#251319" />
        </linearGradient>
        <linearGradient id={`skinLight-${memberId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={charAppearance.skin} />
          <stop offset="70%" stopColor={charAppearance.skinShadow} />
          <stop offset="100%" stopColor="#88242c" />
        </linearGradient>
        <linearGradient id={`floorRef-${memberId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050507" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#050507" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Bayangan & Pantulan Lantai */}
      <ellipse cx="130" cy="470" rx={scaleX > 1.1 ? 78 : 52} ry="12" fill="#000" opacity="0.75" />
      {isSelected && (
        <ellipse cx="130" cy="470" rx="72" ry="15" fill={tintColor || '#facc15'} opacity="0.35" />
      )}
      <g transform={`translate(130, 470) scale(${scaleX}, 1) translate(-130, -470)`}>
        <path d="M82 472 L106 472 L102 518 L76 518 Z" fill={`url(#floorRef-${memberId})`} />
        <path d="M154 472 L178 472 L184 518 L158 518 Z" fill={`url(#floorRef-${memberId})`} />
      </g>

      {/* Tubuh Karakter (Disesuaikan ScaleX & ScaleY dari Titik Pijak Kaki Y=470) */}
      <g transform={`translate(130, 470) scale(${scaleX}, ${scaleY}) translate(-130, -470)`}>
        {/* Sepatu Sneakers */}
        <path d="M84 442 L106 442 L109 466 Q109 473 98 473 L72 473 Q66 473 69 464 L79 448 Z" fill="#0c0d12" stroke="#1f212b" strokeWidth="1.2" />
        <path d="M154 442 L176 442 L181 448 L191 464 Q194 473 188 473 L162 473 Q151 473 151 466 Z" fill="#0c0d12" stroke="#1f212b" strokeWidth="1.2" />

        {/* Celana Tracksuit & Garis Kuning */}
        <path d="M80 248 L180 248 L186 305 L180 375 L175 446 L154 446 L146 372 L134 294 L126 294 L114 372 L106 446 L85 446 L80 375 L74 305 Z" fill={`url(#pantsGrad-${memberId})`} />
        <path d="M80 250 L85 250 L80 305 L85 375 L89 444 L84 444 L80 375 L74 305 Z" fill={stripeColor} />
        <path d="M180 250 L175 250 L180 305 L175 375 L171 444 L176 444 L180 375 L186 305 Z" fill={stripeColor} opacity="0.85" />

        {/* Lengan Bawah */}
        <path d="M60 198 L75 198 L72 252 L75 268 Q76 278 70 282 Q65 284 63 277 L65 266 L61 273 Q57 273 57 265 L59 250 Z" fill={`url(#skinLight-${memberId})`} />
        <path d="M200 198 L185 198 L188 252 L185 268 Q184 278 190 282 Q195 284 197 277 L195 266 L199 273 Q203 273 203 265 L201 250 Z" fill={`url(#skinLight-${memberId})`} />

        {/* Jaket Tracksuit & Strip Bahu Kuning */}
        <path d="M108 100 L152 100 L184 114 Q196 120 200 145 L205 198 L183 201 L177 154 L182 254 L78 254 L83 154 L77 201 L55 198 L60 145 Q64 120 76 114 Z" fill={`url(#suitGrad-${memberId})`} stroke="#2d3142" strokeWidth="1" />
        <path d="M108 102 L76 115 Q65 121 61 145 L57 192 L63 193 L67 146 Q70 125 80 119 L109 107 Z" fill={stripeColor} />
        <path d="M152 102 L184 115 Q195 121 199 145 L203 192 L197 193 L193 146 Q190 125 180 119 L151 107 Z" fill={stripeColor} />
        <rect x="54" y="193" width="24" height="7" rx="2" fill="#101218" />
        <rect x="182" y="193" width="24" height="7" rx="2" fill="#101218" />

        {/* Kerah & Resleting */}
        <path d="M107 82 L123 98 L123 112 L105 104 Z" fill="#1e222f" />
        <path d="M153 82 L137 98 L137 112 L155 104 Z" fill="#141720" />
        <path d="M116 86 L130 112 L144 86 Z" fill={`url(#skinLight-${memberId})`} />
        <line x1="130" y1="112" x2="130" y2="145" stroke="#090a0f" strokeWidth="2.5" />

        {/* Logo Dada THE FINALS */}
        <g transform="translate(146, 126) scale(0.85)">
          <path d="M12 0 L26 20 L19 20 L12 9 L5 20 L-2 20 Z" fill={stripeColor} />
        </g>

        {/* Kepala, Mata & Rambut */}
        <path d="M116 68 L144 68 L146 92 L130 106 L114 92 Z" fill={`url(#skinLight-${memberId})`} />
        <path d="M108 38 C108 20, 152 20, 152 38 C152 54, 148 67, 137 74 C132 77, 128 77, 123 74 C112 67, 108 54, 108 38 Z" fill={`url(#skinLight-${memberId})`} />
        <ellipse cx="120" cy="49" rx="3.2" ry="1.8" fill="#121316" />
        <ellipse cx="140" cy="49" rx="3.2" ry="1.8" fill="#121316" />
        <path d="M107 42 C106 24, 118 16, 132 17 C146 17, 154 25, 153 41 C151 33, 145 27, 136 26 C125 25, 114 31, 107 42 Z" fill={charAppearance.hair} />
      </g>
    </svg>
  );
};

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [activeMode, setActiveMode] = useState('presentasi'); // 'presentasi' | 'admin'
  
  // Persistent State Initialized from LocalStorage with safe fallbacks
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // UI Interactive States
  const [selectedMemberId, setSelectedMemberId] = useState('member-ahmad');
  const [selectedMonth, setSelectedMonth] = useState('Semua Bulan');
  const [expandedLogIds, setExpandedLogIds] = useState(['log-1']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section & Animation Refs
  const heroSectionRef = useRef(null);
  const stageSectionRef = useRef(null);
  const reportSectionRef = useRef(null);
  const toastRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const spotlightBeamRef = useRef(null);
  const spotlightPuddleRef = useRef(null);
  const shockwaveRef = useRef(null);
  const stageInnerRef = useRef(null);
  const isLandedRef = useRef(false);
  const landingTlRef = useRef(null);
  const bioTextRef = useRef(null);
  const mobileDockRef = useRef(null);
  const adminContentRef = useRef(null);
  const lenisRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Always reset scroll to top on mount / refresh & setup scroll listener for Back-to-Top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Lenis Inertial Smooth Scrolling & GSAP ScrollTrigger Integration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      infinite: false
    });
    lenisRef.current = lenis;

    // Immediately ensure top scroll position on startup
    lenis.scrollTo(0, { immediate: true });

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      setShowBackToTop(e.scroll > 380);
    });

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleScrollToHero = () => {
    if (activeMode !== 'presentasi') setActiveMode('presentasi');
    setTimeout(() => {
      if (lenisRef.current && heroSectionRef.current) {
        lenisRef.current.scrollTo(heroSectionRef.current, { offset: 0, duration: 1.1 });
      } else {
        heroSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleScrollToStage = (memberId) => {
    if (memberId) setSelectedMemberId(memberId);
    if (activeMode !== 'presentasi') setActiveMode('presentasi');
    setTimeout(() => {
      if (lenisRef.current && stageSectionRef.current) {
        lenisRef.current.scrollTo(stageSectionRef.current, { offset: -25, duration: 1.1 });
      } else {
        stageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Admin Control States
  const [adminActiveMemberId, setAdminActiveMemberId] = useState('member-ahmad');
  const [adminTab, setAdminTab] = useState('input-log'); // 'input-log' | 'input-project' | 'profil-karakter' | 'kelola-anggota' | 'backup'
  const [notification, setNotification] = useState(null);

  // Forms
  const [editingLogId, setEditingLogId] = useState(null);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'Bulan 1',
    title: '',
    description: '',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: ''
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tagsInput: '',
    metric: 'Selesai 100%',
    previewType: 'web'
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    role: '',
    buildType: 'MEDIUM BUILD',
    bio: '',
    tintColor: '#facc15'
  });

  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    role: '',
    buildType: 'MEDIUM BUILD',
    bio: ''
  });

  const [jsonInputText, setJsonInputText] = useState('');

  // Save to LocalStorage whenever state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to sync members to localStorage', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to sync logs to localStorage', e);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to sync projects to localStorage', e);
    }
  }, [projects]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const displayMembers = members.length > 0 ? members : INITIAL_MEMBERS;

  const activeMemberIndex = useMemo(() => {
    const idx = displayMembers.findIndex((m) => m.id === selectedMemberId);
    return idx >= 0 ? idx : 0;
  }, [displayMembers, selectedMemberId]);

  const activeMember = useMemo(() => {
    return displayMembers[activeMemberIndex] || INITIAL_MEMBERS[0];
  }, [displayMembers, activeMemberIndex]);

  const adminCurrentMember = useMemo(() => {
    return displayMembers.find((m) => m.id === adminActiveMemberId) || displayMembers[0] || INITIAL_MEMBERS[0];
  }, [displayMembers, adminActiveMemberId]);

  useEffect(() => {
    if (adminCurrentMember) {
      setProfileForm({
        name: adminCurrentMember.name || '',
        role: adminCurrentMember.role || '',
        buildType: adminCurrentMember.buildType || 'MEDIUM BUILD',
        bio: adminCurrentMember.bio || '',
        tintColor: adminCurrentMember.tintColor || '#facc15'
      });
    }
  }, [adminCurrentMember]);

  const handlePrevContestant = () => {
    const prevIdx = (activeMemberIndex - 1 + displayMembers.length) % displayMembers.length;
    setSelectedMemberId(displayMembers[prevIdx].id);
  };

  const handleNextContestant = () => {
    const nextIdx = (activeMemberIndex + 1) % displayMembers.length;
    setSelectedMemberId(displayMembers[nextIdx].id);
  };

  // Keyboard navigation for presentation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (activeMode === 'presentasi') {
        if (e.key === 'ArrowLeft') handlePrevContestant();
        if (e.key === 'ArrowRight') handleNextContestant();
        if (['1', '2', '3', '4', '5'].includes(e.key)) {
          const numIdx = parseInt(e.key, 10) - 1;
          if (displayMembers[numIdx]) {
            setSelectedMemberId(displayMembers[numIdx].id);
          }
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M' || e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          setAdminActiveMemberId(activeMember?.id);
          setActiveMode('admin');
        }
      } else if (activeMode === 'admin') {
        if (e.key === 'Escape') {
          setActiveMode('presentasi');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, activeMemberIndex, displayMembers, activeMember]);

  // ==========================================
  // GSAP MOTION ENGINE (Lightweight & Hardware-Accelerated)
  // ==========================================

  // 1. Hero Entrance, Ambient Stripes & Section ScrollTriggers
  useEffect(() => {
    if (activeMode !== 'presentasi') return;
    const ctx = gsap.context(() => {
      // 1.1 Ambient Crimson Stripes Infinite Drift
      gsap.to('.gsap-ambient-stripes', {
        backgroundPosition: '200px 0px',
        duration: 16,
        repeat: -1,
        ease: 'none'
      });

      // 1.2 Hero Slam & Skew Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.gsap-hero-slam', {
        y: 80,
        skewY: 5,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'back.out(1.7)',
        clearProps: 'all'
      })
      .from('.gsap-hero-desc', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      }, '-=0.35')
      .from('.gsap-hero-cta', {
        opacity: 0,
        scale: 0.9,
        duration: 0.45,
        ease: 'back.out(1.5)',
        clearProps: 'all'
      }, '-=0.25')
      .from('.gsap-bento-card', {
        opacity: 0,
        scale: 0.8,
        stagger: 0.08,
        duration: 0.45,
        ease: 'back.out(1.5)',
        clearProps: 'all',
        onStart: () => {
          // Bento Metrics Counter Roll-Up (0 to target)
          const counterEls = heroSectionRef.current?.querySelectorAll('.gsap-counter');
          counterEls?.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            const isPadded = el.getAttribute('data-pad') === 'true';
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                const rounded = Math.round(obj.val);
                el.textContent = isPadded && rounded < 10 ? `0${rounded}` : `${rounded}`;
              }
            });
          });
        }
      }, '-=0.3')
      .from('.gsap-roster-item', {
        opacity: 0,
        x: 60,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out',
        clearProps: 'all'
      }, '-=0.45');

      // 1.3 Stage Superhero Squad Drop & Landing Sequence on Scroll
      if (stageSectionRef.current) {
        if (!isLandedRef.current) {
          gsap.set('.gsap-landing-side', { y: -360, opacity: 0 });
          gsap.set('.gsap-landing-center', { y: -480, opacity: 0, scaleY: 1.15, scaleX: 0.88 });
          if (selectionBoxRef.current) {
            gsap.set(selectionBoxRef.current, { y: 40, opacity: 0 });
          }
        }

        ScrollTrigger.create({
          trigger: stageSectionRef.current,
          start: 'top 75%',
          onEnter: () => {
            if (isLandedRef.current) return;
            isLandedRef.current = true;

            if (landingTlRef.current) landingTlRef.current.kill();
            const dropTl = gsap.timeline({
              onComplete: () => {
                // Clear temporary landing inline styles once landed so carousel & UI are permanently clean
                gsap.set('.gsap-char-landing-wrapper', { clearProps: 'y,opacity,scaleX,scaleY' });
                if (selectionBoxRef.current) {
                  gsap.set(selectionBoxRef.current, { clearProps: 'all' });
                }
              }
            });
            landingTlRef.current = dropTl;

            // Stage header entrance
            dropTl.fromTo(
              '.gsap-stage-header',
              { opacity: 0, y: -20 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all' }
            )

            // 1. Side characters drop first in rapid succession
            .to('.gsap-landing-side', {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.07,
              ease: 'power3.in'
            }, '-=0.15')
            .to('.gsap-landing-side', {
              scaleY: 0.94,
              scaleX: 1.04,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'power1.out',
              clearProps: 'scaleX,scaleY'
            }, '-=0.1')

            // 2. Center hero drops fast & hard! (Superhero Landing)
            .to('.gsap-landing-center', {
              y: 0,
              opacity: 1,
              duration: 0.48,
              ease: 'power4.in'
            }, '-=0.12')

            // 3. Impact Point: Shockwave + Flash + Stage Micro-shake + Compression
            .add(() => {
              if (shockwaveRef.current) {
                gsap.fromTo(
                  shockwaveRef.current,
                  { scale: 0.1, opacity: 1 },
                  { scale: 2.5, opacity: 0, duration: 0.65, ease: 'power2.out' }
                );
              }
              if (spotlightBeamRef.current) {
                gsap.fromTo(
                  spotlightBeamRef.current,
                  { opacity: 0.95, scaleX: 1.35 },
                  { opacity: 0.35, scaleX: 1, duration: 0.55, ease: 'power3.out' }
                );
              }
              if (spotlightPuddleRef.current) {
                gsap.fromTo(
                  spotlightPuddleRef.current,
                  { opacity: 1, scale: 1.5 },
                  { opacity: 0.65, scale: 1, duration: 0.55, ease: 'power3.out' }
                );
              }
              if (stageInnerRef.current) {
                gsap.timeline()
                  .to(stageInnerRef.current, { x: -4, y: 2, duration: 0.04 })
                  .to(stageInnerRef.current, { x: 4, y: -2, duration: 0.04 })
                  .to(stageInnerRef.current, { x: -2, y: 1, duration: 0.04 })
                  .to(stageInnerRef.current, { x: 0, y: 0, duration: 0.05, clearProps: 'x,y' });
              }
            })

            // 4. Center character landing compression & spring bounce
            .to('.gsap-landing-center', {
              scaleY: 0.85,
              scaleX: 1.15,
              duration: 0.12,
              transformOrigin: 'bottom center',
              ease: 'power2.out'
            })
            .to('.gsap-landing-center', {
              scaleY: 1,
              scaleX: 1,
              duration: 0.4,
              transformOrigin: 'bottom center',
              ease: 'elastic.out(1.1, 0.4)',
              clearProps: 'y,opacity,scaleX,scaleY'
            })

            // 5. Selection Box HUD Punch-In from bottom
            .fromTo(
              selectionBoxRef.current,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', clearProps: 'all' },
              '-=0.15'
            )

            // 6. Resume smooth idle breathing on active contestant
            .add(() => {
              gsap.to('.gsap-breathing-avatar', {
                y: -4,
                scaleY: 1.015,
                transformOrigin: 'bottom center',
                duration: 1.6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
              });
            });
          },
          onLeaveBack: () => {
            // Only reset if user has actually scrolled all the way up to Hero section
            if (window.scrollY < 200) {
              isLandedRef.current = false;
              if (landingTlRef.current) landingTlRef.current.kill();
              gsap.set('.gsap-landing-side', { y: -360, opacity: 0 });
              gsap.set('.gsap-landing-center', { y: -480, opacity: 0, scaleY: 1.15, scaleX: 0.88 });
              if (selectionBoxRef.current) {
                gsap.set(selectionBoxRef.current, { y: 40, opacity: 0 });
              }
            }
          }
        });
      }

      // ScrollTrigger for Report section header
      if (reportSectionRef.current) {
        ScrollTrigger.create({
          trigger: reportSectionRef.current,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              '.gsap-report-header',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
            );
          },
          once: true
        });
      }
    });

    return () => ctx.revert();
  }, [activeMode]);

  // 2. Operator Switch Animation (Idle Breathing, Spotlight Flicker, Bio Box Text Refresh)
  useEffect(() => {
    if (activeMode !== 'presentasi') return;
    const ctx = gsap.context(() => {
      // 2.1 Idle Breathing Animation on the Active Contestant
      gsap.to('.gsap-breathing-avatar', {
        y: -4,
        scaleY: 1.015,
        transformOrigin: 'bottom center',
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 2.2 Stadium Spotlight Flicker & Beam
      if (spotlightBeamRef.current) {
        gsap.fromTo(
          spotlightBeamRef.current,
          { scaleX: 0.3, opacity: 0.12 },
          { scaleX: 1, opacity: 0.35, duration: 0.45, ease: 'power4.out' }
        );
      }
      if (spotlightPuddleRef.current) {
        gsap.fromTo(
          spotlightPuddleRef.current,
          { scale: 0.4, opacity: 0.2 },
          { scale: 1, opacity: 0.7, duration: 0.45, ease: 'power4.out' }
        );
      }

      // 2.3 ONLY Bio Text refresh inside the box (Selection Box itself remains 100% visible and stable)
      if (bioTextRef.current) {
        gsap.fromTo(
          bioTextRef.current,
          { x: 18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out', clearProps: 'all' }
        );
      }
    }, stageSectionRef);

    return () => ctx.revert();
  }, [selectedMemberId, activeMode]);

  // 3. Logbook & Featured Projects Stagger Entrance + Timeline Line Draw
  useEffect(() => {
    if (activeMode !== 'presentasi') return;
    const ctx = gsap.context(() => {
      // 3.1 Timeline Line Draw
      gsap.fromTo(
        '.gsap-timeline-line',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.55, ease: 'power2.out' }
      );

      // 3.2 Logbook Cards Stagger Entrance
      gsap.fromTo(
        '.gsap-log-card',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', clearProps: 'all' }
      );

      // 3.3 Featured Projects Stagger Entrance
      gsap.fromTo(
        '.gsap-proj-card',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out', clearProps: 'all' }
      );
    }, reportSectionRef);

    return () => ctx.revert();
  }, [selectedMemberId, selectedMonth, searchQuery, activeMode]);

  // 4. Toast Spring Animation
  useEffect(() => {
    if (notification && toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { y: 35, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }
      );
    }
  }, [notification]);

  // 5. Admin Tab Transition
  useEffect(() => {
    if (activeMode === 'admin' && adminContentRef.current) {
      gsap.fromTo(
        adminContentRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [adminTab, activeMode]);

  // 6. Mobile Dock Spring Entrance
  useEffect(() => {
    if (activeMode === 'presentasi' && mobileDockRef.current) {
      gsap.fromTo(
        mobileDockRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: 0.25, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [activeMode]);

  const handleSelectAndScroll = () => {
    if (activeMode !== 'presentasi') setActiveMode('presentasi');
    setTimeout(() => {
      if (lenisRef.current && reportSectionRef.current) {
        lenisRef.current.scrollTo(reportSectionRef.current, { offset: -25, duration: 1.1 });
      } else {
        reportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchMember = log.memberId === activeMember?.id;
      const matchMonth = selectedMonth === 'Semua Bulan' || log.month === selectedMonth;
      const matchSearch =
        !searchQuery.trim() ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMember && matchMonth && matchSearch;
    });
  }, [logs, activeMember, selectedMonth, searchQuery]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => proj.memberId === activeMember?.id);
  }, [projects, activeMember]);

  const adminMemberLogs = useMemo(() => {
    return logs.filter((log) => log.memberId === adminCurrentMember?.id);
  }, [logs, adminCurrentMember]);

  const adminMemberProjects = useMemo(() => {
    return projects.filter((proj) => proj.memberId === adminCurrentMember?.id);
  }, [projects, adminCurrentMember]);

  const toggleLogExpand = (id) => {
    setExpandedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // CRUD Handlers
  const handleSaveLog = (e) => {
    e.preventDefault();
    if (!logForm.title.trim() || !logForm.description.trim()) {
      showToast('Judul dan deskripsi kegiatan wajib diisi!', 'error');
      return;
    }

    const payload = {
      id: editingLogId || `log-${Date.now()}`,
      memberId: adminCurrentMember.id,
      date: logForm.date,
      month: logForm.month,
      title: logForm.title.trim(),
      description: logForm.description.trim(),
      category: logForm.category,
      status: logForm.status,
      imageUrl: logForm.imageUrl.trim()
    };

    if (editingLogId) {
      setLogs((prev) => prev.map((l) => (l.id === editingLogId ? payload : l)));
      showToast('Jurnal kegiatan berhasil diperbarui!');
      setEditingLogId(null);
    } else {
      setLogs((prev) => [payload, ...prev]);
      showToast(`Kegiatan baru ditambahkan untuk ${adminCurrentMember.name}!`);
    }

    setLogForm({
      date: new Date().toISOString().split('T')[0],
      month: logForm.month,
      title: '',
      description: '',
      category: logForm.category,
      status: 'Selesai',
      imageUrl: ''
    });
  };

  const handleEditLogClick = (log) => {
    setEditingLogId(log.id);
    setLogForm({
      date: log.date,
      month: log.month,
      title: log.title,
      description: log.description,
      category: log.category,
      status: log.status || 'Selesai',
      imageUrl: log.imageUrl || ''
    });
    setAdminTab('input-log');
  };

  const handleDeleteLog = (id) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Kegiatan berhasil dihapus.');
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      showToast('Nama project dan deskripsi wajib diisi!', 'error');
      return;
    }

    const parsedTags = projectForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: editingProjectId || `proj-${Date.now()}`,
      memberId: adminCurrentMember.id,
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Project PKL'],
      metric: projectForm.metric.trim() || 'Selesai',
      previewType: projectForm.previewType
    };

    if (editingProjectId) {
      setProjects((prev) => prev.map((p) => (p.id === editingProjectId ? payload : p)));
      showToast('Hasil kerja / project berhasil diperbarui!');
      setEditingProjectId(null);
    } else {
      setProjects((prev) => [payload, ...prev]);
      showToast(`Project baru ditambahkan untuk ${adminCurrentMember.name}!`);
    }

    setProjectForm({
      title: '',
      description: '',
      tagsInput: '',
      metric: 'Selesai 100%',
      previewType: 'web'
    });
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      tagsInput: (proj.tags || []).join(', '),
      metric: proj.metric || 'Selesai',
      previewType: proj.previewType || 'web'
    });
    setAdminTab('input-project');
  };

  const handleDeleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project berhasil dihapus.');
  };

  const handleSaveContestantProfile = (e) => {
    e.preventDefault();
    if (!adminCurrentMember) return;
    
    setMembers((prev) =>
      prev.map((m) =>
        m.id === adminCurrentMember.id
          ? {
              ...m,
              name: profileForm.name.trim() || adminCurrentMember.name,
              role: profileForm.role.trim() || adminCurrentMember.role,
              buildType: profileForm.buildType,
              bio: profileForm.bio.trim(),
              tintColor: profileForm.tintColor || '#facc15'
            }
          : m
      )
    );
    showToast(`Profil Contestant ${profileForm.name} berhasil diupdate!`);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.role.trim()) {
      showToast('Nama dan role wajib diisi!', 'error');
      return;
    }

    const newId = 'member-' + Date.now();
    const payload = {
      id: newId,
      name: newMemberForm.name.trim(),
      role: newMemberForm.role.trim().toUpperCase(),
      division: 'Divisi Operasional PKL',
      buildType: newMemberForm.buildType || 'MEDIUM BUILD',
      bio: newMemberForm.bio.trim() || 'Anggota tim Praktik Kerja Lapangan (PKL) dengan kontribusi aktif.',
      tintColor: '#38bdf8'
    };

    setMembers((prev) => [...prev, payload]);
    setNewMemberForm({ name: '', role: '', buildType: 'MEDIUM BUILD', bio: '' });
    setAdminActiveMemberId(newId);
    setSelectedMemberId(newId);
    showToast(`Contestant baru (${payload.name}) berhasil ditambahkan!`);
  };

  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      members: displayMembers,
      logs,
      projects
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'backup_laporan_pkl_the_finals.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File JSON berhasil di-download!');
  };

  const handleImportJSON = () => {
    if (!jsonInputText.trim()) return;
    try {
      const parsed = JSON.parse(jsonInputText);
      if (Array.isArray(parsed.members) && parsed.members.length > 0) {
        setMembers(parsed.members);
      }
      if (Array.isArray(parsed.logs)) {
        setLogs(parsed.logs);
      }
      if (Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
      }
      setJsonInputText('');
      showToast('Data JSON berhasil di-import dan disinkronkan!');
    } catch (err) {
      console.error('Import error:', err);
      showToast('Format JSON tidak valid!', 'error');
    }
  };

  const handleResetDefaultData = () => {
    if (window.confirm('Kembalikan semua data anggota, logbook, dan project ke pengaturan awal template?')) {
      setMembers(INITIAL_MEMBERS);
      setLogs(INITIAL_LOGS);
      setProjects(INITIAL_PROJECTS);
      setSelectedMemberId('member-ahmad');
      setAdminActiveMemberId('member-ahmad');
      showToast('Semua data berhasil di-reset ke template bawaan!');
    }
  };

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const renderProjectPreview = (proj) => {
    switch (proj.previewType) {
      case 'web':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">localhost/pkl-system</span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto pt-2">
              <div className="col-span-1 bg-slate-900/90 h-14 rounded border border-slate-800 p-1.5 flex flex-col gap-1">
                <div className="h-1.5 w-10 bg-yellow-400/70 rounded"></div>
                <div className="h-1 w-8 bg-slate-700 rounded"></div>
              </div>
              <div className="col-span-2 bg-slate-900/60 h-14 rounded border border-slate-800 p-2 flex flex-col justify-between">
                <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                <span className="h-3.5 px-1.5 bg-yellow-400/20 border border-yellow-400/50 rounded text-[8px] text-yellow-300 flex items-center justify-center font-bold">DEPLOYED</span>
              </div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 text-xs font-mono font-bold">RTR</div>
              <div className="w-10 h-0.5 bg-yellow-400"></div>
              <div className="w-8 h-8 rounded-lg bg-yellow-950/80 border border-yellow-400/50 flex items-center justify-center text-yellow-400 text-xs font-mono font-bold">SW</div>
            </div>
            <div className="mt-3 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-yellow-400 font-mono">LAN NETWORK OK</div>
          </div>
        );
      case 'archive':
      case 'doc':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-500/30 font-bold">E-ARSIP DATABASE</span>
              <span className="text-[10px] text-emerald-400 font-mono">✓ VERIFIED</span>
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-4 bg-slate-900 rounded border border-slate-800 px-2 flex items-center justify-between text-[9px] text-slate-300">
                <span>📁 Arsip_Surat_2026.pdf</span>
                <span className="text-yellow-400 font-bold">250+ File</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-yellow-400 font-bold">OPERASIONAL // DITJEN KUATHAN</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto text-center">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-xs font-bold text-white uppercase">SISTEM</div>
                <div className="text-[9px] text-slate-300">Tervalidasi</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-xs font-bold text-yellow-400 uppercase">DINAS</div>
                <div className="text-[9px] text-slate-300">Kemhan RI</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 uppercase">STATUS</div>
                <div className="text-[9px] text-slate-300">Aktif & Siap</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans selection:bg-yellow-400 selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div ref={toastRef} className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border-2 border-yellow-400 transition-all bg-zinc-950 text-sm">
          {notification.type === 'error' ? (
            <X className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
          )}
          <span className="font-bold tracking-wide uppercase text-xs">{notification.message}</span>
        </div>
      )}

      {/* Floating Back To Top Button */}
      {activeMode === 'presentasi' && (
        <button
          type="button"
          onClick={handleScrollToHero}
          aria-label="Kembali ke atas (Home Briefing)"
          title="Kembali ke Bagian Atas // Home Briefing"
          className={`fixed z-40 bottom-20 right-4 md:bottom-6 md:right-6 p-3 rounded-xl bg-[#090b10]/90 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-[0_8px_25px_rgba(0,0,0,0.85)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-90 group focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
            showBackToTop
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* ========================================== */}
      {/* STICKY TOP NAVBAR                         */}
      {/* ========================================== */}
      <nav className="sticky top-0 z-50 w-full bg-[#090b10]/95 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <button
            type="button"
            onClick={handleScrollToHero}
            className="flex items-center gap-3 cursor-pointer group select-none text-left p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none transition-all"
            title="Kembali ke Home Briefing"
          >
            <div className="w-8 h-7 bg-yellow-400 flex items-center justify-center rounded-sm transform -skew-x-6 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 36 28" className="w-5 h-4 fill-black">
                <path d="M18 0 L36 28 L27 28 L18 13 L9 28 L0 28 Z" />
                <path d="M18 17 L25 28 L11 28 Z" fill="#dc2626" />
              </svg>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="text-lg sm:text-xl font-black italic tracking-tighter uppercase text-white drop-shadow">
                THE FINALS
              </span>
              <span className="text-[10px] sm:text-xs font-black italic uppercase px-1.5 py-0.5 rounded bg-yellow-400 text-black tracking-widest">
                // DITJEN KUATHAN KEMHAN
              </span>
            </div>
          </button>

          {/* 3 Navigasi Smooth-Scroll (Saat Mode Presentasi) */}
          {activeMode === 'presentasi' ? (
            <div className="hidden md:flex items-center gap-1 sm:gap-2 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={handleScrollToHero}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black italic uppercase text-zinc-300 hover:text-yellow-400 hover:bg-white/5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              >
                01 // Home Briefing
              </button>
              <button
                onClick={() => handleScrollToStage()}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black italic uppercase text-zinc-300 hover:text-yellow-400 hover:bg-white/5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              >
                02 // Pilih Karakter
              </button>
              <button
                onClick={handleSelectAndScroll}
                className="px-3.5 py-1.5 rounded-lg text-xs font-black italic uppercase text-zinc-300 hover:text-yellow-400 hover:bg-white/5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              >
                03 // Logbook & Project
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-red-950/60 border border-red-500/40 px-3 py-1.5 rounded-lg text-xs font-black italic uppercase text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>MODE INPUT DATA // DITJEN KUATHAN KEMHAN</span>
            </div>
          )}

          {/* Toggle: Mode Admin (Ikon Minimalis) / Mode Presentasi */}
          <div className="flex items-center gap-3">
            {activeMode === 'presentasi' ? (
              <button
                type="button"
                onClick={() => {
                  setAdminActiveMemberId(activeMember?.id);
                  setActiveMode('admin');
                }}
                className="p-2 sm:p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-yellow-400/40 text-zinc-500 hover:text-yellow-400 transition-all flex items-center justify-center cursor-pointer active:scale-95 group focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                title="Kelola Data & Profil (Admin/Operator)"
                aria-label="Buka Pengaturan Data Admin"
              >
                <Settings className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90 group-hover:text-yellow-400 text-zinc-400" />
              </button>
            ) : (
              <button
                onClick={() => setActiveMode('presentasi')}
                className="px-3.5 sm:px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kembali ke Presentasi</span>
                <span className="sm:hidden">Presentasi</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {activeMode === 'presentasi' ? (
        <div>
          {/* ========================================== */}
          {/* SECTION 1: LANDING PAGE / HERO BRIEFING   */}
          {/* ========================================== */}
          <section
            ref={heroSectionRef}
            className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between border-b-4 border-red-600 overflow-hidden bg-[#090b10]"
          >
            {/* Background Atmosphere & Tactical Arena Diagonal Grid (Theme Identity: THE FINALS) */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 25%, rgba(220, 38, 38, 0.22) 0%, rgba(15, 17, 26, 0.95) 70%, #090b10 100%)'
                }}
              />
              <div
                className="gsap-ambient-stripes absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(118deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 40px)',
                  backgroundSize: '200px 200px'
                }}
              />
            </div>

            <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-auto">
              {/* Kolom Kiri: Headline, Penjelasan Divisi, CTA, & Bento Metrics */}
              <div className="lg:col-span-7 space-y-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/90 border-l-2 border-red-500 text-red-400 text-xs font-black italic uppercase tracking-wider gsap-hero-slam">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>ARENA BRIEFING // DITJEN KUATHAN KEMHAN RI</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black italic uppercase leading-[0.95] tracking-tight text-white drop-shadow-xl overflow-hidden">
                    <span className="block gsap-hero-slam">SATU ARENA WEB,</span>
                    <span className="block text-yellow-400 gsap-hero-slam">LIMA OPERATOR MAGANG</span>
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl gsap-hero-desc">
                    Platform presentasi interaktif dan logbook digital terpadu tim magang Direktorat Jenderal Kekuatan Pertahanan (Ditjen Kuathan) Kementerian Pertahanan RI. Menampilkan rekapitulasi kegiatan nyata, pembagian tugas divisi (IT Support, TU Ditmat, TU Fasjas, TU SDM), dan karya proyek selama 2 bulan pelaksanaan magang.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    onClick={() => handleScrollToStage()}
                    className="px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-black italic uppercase tracking-wider text-sm sm:text-base shadow-[0_0_35px_rgba(250,204,21,0.45)] hover:shadow-[0_0_50px_rgba(250,204,21,0.7)] transition-all flex items-center gap-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none gsap-hero-cta"
                  >
                    <span>PILIH OPERATOR SQUAD // MULAI PRESENTASI</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* 4 Kotak Bento Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 hover:border-yellow-400/50 transition-colors gsap-bento-card">
                    <div className="text-2xl sm:text-3xl font-black italic text-yellow-400 font-mono">
                      <span className="gsap-counter" data-target="5" data-pad="true">05</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-black uppercase text-zinc-300 tracking-wider">OPERATOR MAGANG</div>
                    <div className="text-[10px] text-zinc-300 mt-0.5">Ditjen Kuathan</div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 hover:border-yellow-400/50 transition-colors gsap-bento-card">
                    <div className="text-2xl sm:text-3xl font-black italic text-white font-mono">
                      <span className="gsap-counter" data-target={logs.length}>{logs.length}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-black uppercase text-zinc-300 tracking-wider">JURNAL HARIAN</div>
                    <div className="text-[10px] text-zinc-300 mt-0.5">Logbook 2 Bulan</div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 hover:border-yellow-400/50 transition-colors gsap-bento-card">
                    <div className="text-2xl sm:text-3xl font-black italic text-white font-mono">
                      <span className="gsap-counter" data-target={projects.length}>{projects.length}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-black uppercase text-zinc-300 tracking-wider">PROYEK KEDINASAN</div>
                    <div className="text-[10px] text-zinc-300 mt-0.5">Karya Nyata</div>
                  </div>

                  <div className="bg-zinc-900 border border-white/10 rounded-xl p-3.5 hover:border-yellow-400/50 transition-colors gsap-bento-card">
                    <div className="text-2xl sm:text-3xl font-black italic text-yellow-400 font-mono">
                      <span className="gsap-counter" data-target="2">2</span> BLN
                    </div>
                    <div className="text-[10px] sm:text-xs font-black uppercase text-zinc-300 tracking-wider">PERIODE MAGANG</div>
                    <div className="text-[10px] text-zinc-300 mt-0.5">Kuathan Kemhan</div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Quick Roster Jump */}
              <div className="lg:col-span-5 bg-zinc-900 border border-white/15 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-black italic uppercase tracking-widest text-zinc-200">
                      ACTIVE ROSTER // 5 OPERATOR MAGANG
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded">
                    KEMHAN RI
                  </span>
                </div>

                <div className="space-y-2.5">
                  {displayMembers.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => handleScrollToStage(m.id)}
                      className="w-full text-left p-3 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-yellow-400 hover:bg-zinc-900 transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none gsap-roster-item"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <span className="font-mono text-xs font-black text-yellow-400 bg-black/60 px-2 py-1 rounded border border-white/10 group-hover:border-yellow-400/50 shrink-0">
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-black italic uppercase text-white group-hover:text-yellow-400 transition-colors text-sm sm:text-base truncate">
                            {m.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-zinc-300 uppercase font-semibold truncate">
                            {m.role}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center sm:flex-col sm:items-end gap-1.5 shrink-0 ml-auto sm:ml-0">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-yellow-400 group-hover:border-yellow-400">
                          {m.buildType}
                        </span>
                        <span className="text-[9px] text-zinc-400 flex items-center gap-0.5 group-hover:text-yellow-400 font-semibold">
                          Sorot Operator <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-zinc-300 text-center italic pt-1">
                  Klik nama operator untuk langsung menyorot karakternya di panggung arena Ditjen Kuathan
                </p>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* SECTION 2: THE FINALS 5-CHARACTER STAGE    */}
          {/* ========================================== */}
          <section
            ref={stageSectionRef}
            className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] overflow-hidden flex flex-col justify-between select-none border-b-4 border-yellow-400"
          >
            {/* Crimson Red Diagonal Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(180deg, #991b1b 0%, #dc2626 52%, #450a0a 86%, #09090b 100%)'
              }}
            />
            <div
              className="gsap-ambient-stripes absolute inset-0 z-0 opacity-35 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(118deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 110px, transparent 110px, transparent 230px)',
                backgroundSize: '230px 230px'
              }}
            />

            {/* Top Stage Header Bar */}
            <div className="gsap-stage-header relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <div className="flex items-center gap-2.5">
                  <svg viewBox="0 0 36 28" className="w-8 h-6 fill-white">
                    <path d="M18 0 L36 28 L27 28 L18 13 L9 28 L0 28 Z" />
                    <path d="M18 17 L25 28 L11 28 Z" className="fill-yellow-400" />
                  </svg>
                  <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white drop-shadow">
                    SELECT OPERATOR // DITJEN KUATHAN
                  </h2>
                </div>
                <span className="hidden sm:inline-block text-[11px] font-black italic uppercase tracking-widest text-white/80">
                  ROTATING SQUAD LINEUP // DITJEN KUATHAN KEMHAN
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-black/55 border border-white/15 px-3 py-1.5 rounded">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs font-black italic uppercase tracking-wider text-white">
                    0{activeMemberIndex + 1} // {activeMember?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* PERFECTLY CENTERED ROTATING SQUAD STAGE */}
            <div ref={stageInnerRef} className="relative z-20 max-w-7xl w-full mx-auto px-2 sm:px-6 pt-4 pb-32 sm:pb-40 flex items-end justify-center min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]">
              {/* Spotlight Beam on Center Contestant */}
              <div
                ref={spotlightBeamRef}
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[460px] h-[460px] sm:h-[520px] z-20 transition-all duration-700"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${activeMember?.tintColor || '#facc15'}33 0%, rgba(250,204,21,0.06) 55%, transparent 80%)`
                }}
              />
              <div
                ref={spotlightPuddleRef}
                className="pointer-events-none absolute bottom-20 sm:bottom-32 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-12 rounded-full blur-md z-10 transition-all duration-700"
                style={{
                  background: `radial-gradient(ellipse at center, ${activeMember?.tintColor || '#facc15'}66 0%, transparent 75%)`
                }}
              />

              {/* Ground Shockwave Ring on Superhero Landing Impact */}
              <div
                ref={shockwaveRef}
                className="pointer-events-none absolute bottom-20 sm:bottom-32 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-14 sm:h-20 rounded-full border-2 border-yellow-400 opacity-0 scale-0 z-30"
                style={{
                  boxShadow: '0 0 55px rgba(250, 204, 21, 0.95), inset 0 0 30px rgba(220, 38, 38, 0.7)'
                }}
              />

              {displayMembers.map((m, idx) => {
                const isSelected = m.id === activeMember?.id;

                // Calculate relative offset distance from active member index for symmetrical carousel rotation
                const totalMembers = displayMembers.length;
                let offset = (idx - activeMemberIndex + totalMembers) % totalMembers;
                if (offset > totalMembers / 2) {
                  offset -= totalMembers; // negative for left side, positive for right side
                }

                // Symmetrical horizontal spacing, scale, depth, and z-index based on rotation offset
                const xOffsetPercent = offset * 21;
                const scale = isSelected ? 1.15 : Math.max(0.72, 1 - Math.abs(offset) * 0.12);
                const brightness = isSelected ? 'brightness-100' : 'brightness-70 hover:brightness-90';
                const zIndex = isSelected ? 40 : 25 - Math.abs(offset);
                const opacity = isSelected ? 1 : Math.max(0.55, 1 - Math.abs(offset) * 0.18);

                return (
                  <div
                    key={m.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Pilih operator ${m.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedMemberId(m.id);
                      }
                    }}
                    onClick={() => setSelectedMemberId(m.id)}
                    style={{
                      left: `calc(50% + ${xOffsetPercent}%)`,
                      transform: `translate3d(-50%, ${isSelected ? '12px' : '-24px'}, 0) scale(${scale})`,
                      zIndex: zIndex,
                      opacity: opacity,
                      transition: 'all 600ms cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                    className={`absolute bottom-20 sm:bottom-28 cursor-pointer flex flex-col items-center group select-none rounded-xl focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${brightness}`}
                  >
                    <div className={`gsap-char-landing-wrapper flex flex-col items-center ${isSelected ? 'gsap-landing-center' : 'gsap-landing-side'}`}>
                      {/* Contestant Name Badge */}
                      <div
                        className={`mb-1.5 px-3 py-0.5 rounded transition-all duration-500 flex items-center gap-1.5 whitespace-nowrap ${
                          isSelected
                            ? 'bg-yellow-400 text-black font-black italic uppercase text-xs sm:text-sm shadow-[0_0_25px_rgba(250,204,21,0.8)] scale-105'
                            : 'bg-black/75 text-zinc-300 font-bold uppercase text-[10px] border border-white/15 group-hover:border-yellow-400/50 group-hover:text-white'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
                        <span>{m.name}</span>
                      </div>

                      {/* Full-Body SVG Character */}
                      <div className={`w-28 sm:w-44 md:w-52 h-[290px] sm:h-[410px] md:h-[450px] relative flex items-end justify-center ${isSelected ? 'gsap-breathing-avatar' : ''}`}>
                        <TheFinalsSVGAvatar
                          memberId={m.id}
                          buildType={m.buildType}
                          tintColor={m.tintColor}
                          isSelected={isSelected}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* TRANSLUCENT SELECTION BOX IN FRONT */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[96%] sm:w-[94%] max-w-xl pointer-events-auto">
                <div ref={selectionBoxRef} className="w-full">
                  <div className="bg-[#1a0d12]/90 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-stretch rounded-lg overflow-hidden">
                    <button
                      onClick={handlePrevContestant}
                      className="w-12 min-w-[48px] min-h-[48px] border-r border-white/10 flex items-center justify-center text-white/90 hover:text-yellow-400 hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                      title="Sebelumnya (Panah Kiri)"
                      aria-label="Operator sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div ref={bioTextRef} className="flex-1 px-3 sm:px-6 py-2.5 sm:py-3.5 text-center space-y-1 sm:space-y-1.5">
                      <div className="text-xs sm:text-sm font-black italic uppercase tracking-wider text-white">
                        {activeMember?.buildType || 'MEDIUM BUILD'}{' '}
                        <span className="text-yellow-400">// {activeMember?.name}</span>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-300">
                        {activeMember?.role} | {activeMember?.division}
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed line-clamp-2">
                        {activeMember?.bio}
                      </p>
                    </div>

                    <button
                      onClick={handleNextContestant}
                      className="w-12 min-w-[48px] min-h-[48px] border-l border-white/10 flex items-center justify-center text-white/90 hover:text-yellow-400 hover:bg-white/5 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                      title="Selanjutnya (Panah Kanan)"
                      aria-label="Operator selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleSelectAndScroll}
                    className="mt-2 w-full sm:w-[85%] mx-auto py-2.5 bg-[#facc15] hover:bg-[#fde047] active:scale-[0.99] text-black font-black italic uppercase tracking-wider text-xs sm:text-sm shadow-[0_6px_25px_rgba(250,204,21,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                  >
                    <span>SELECT // BUKA LOGBOOK {activeMember?.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================== */}
          {/* LOGBOOK & PROJECTS SECTION                 */}
          {/* ========================================== */}
          <div ref={reportSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 md:pb-8 space-y-6">
            <div className="gsap-report-header bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold italic uppercase tracking-widest text-yellow-400">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span>DATA LAPORAN OPERATOR MAGANG // DITJEN KUATHAN KEMHAN</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
                  LOGBOOK & PROYEK KEDINASAN:{' '}
                  <span className="text-yellow-400 underline decoration-red-600 decoration-4 underline-offset-4">
                    {activeMember?.name}
                  </span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['Semua Bulan', 'Bulan 1', 'Bulan 2'].map((bulan) => (
                  <button
                    key={bulan}
                    onClick={() => setSelectedMonth(bulan)}
                    className={`px-4 py-2 min-h-[38px] rounded-lg font-bold uppercase text-xs tracking-wider transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                      selectedMonth === bulan
                        ? 'bg-yellow-400 text-black shadow-md'
                        : 'bg-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {bulan}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Logbook Timeline */}
              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-base font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span>Logbook / Jurnal Harian ({filteredLogs.length})</span>
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Catatan kegiatan harian {activeMember?.name} selama 2 bulan penugasan di Ditjen Kuathan Kemhan
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kegiatan..."
                      className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 w-full sm:w-44"
                    />
                  </div>
                </div>

                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-300 text-sm">
                      Belum ada catatan kegiatan untuk <strong className="text-white">{activeMember?.name}</strong> pada filter <strong className="text-yellow-400">{selectedMonth}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setAdminActiveMemberId(activeMember?.id);
                        setActiveMode('admin');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-yellow-400 text-black text-xs font-black italic uppercase hover:bg-yellow-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Kegiatan {activeMember?.name} Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4">
                    <div className="gsap-timeline-line absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-yellow-400 via-red-600 to-zinc-800 origin-top pointer-events-none" />
                    {filteredLogs.map((log, index) => {
                      const isExpanded = expandedLogIds.includes(log.id) || index === 0;
                      return (
                        <div
                          key={log.id}
                          className={`gsap-log-card relative rounded-xl border transition-all ${
                            isExpanded
                              ? 'bg-zinc-900 border-yellow-400/50 shadow-lg'
                              : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                          }`}
                        >
                          <span
                            className={`absolute -left-[22px] top-5 w-3.5 h-3.5 rounded-full border-2 ${
                              index === 0
                                ? 'bg-yellow-400 border-black'
                                : 'bg-red-600 border-zinc-950'
                            }`}
                          ></span>

                          <button
                            onClick={() => toggleLogExpand(log.id)}
                            className="w-full text-left p-4 flex items-start justify-between gap-3 cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-xl"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                                <span className="font-mono text-yellow-400 font-bold">
                                  {formatDateIndo(log.date)}
                                </span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase">
                                  {log.month}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-red-950/90 border border-red-500/40 text-red-300 text-[10px] font-bold uppercase">
                                  {log.category}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                                {log.title}
                              </h4>
                            </div>

                            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 mt-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          <div
                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-4 pb-4 pt-1 border-t border-zinc-800/70 space-y-3">
                                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                  {log.description}
                                </p>

                                {log.imageUrl && (
                                  <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 max-h-52 relative group">
                                    <img
                                      src={log.imageUrl}
                                      alt={log.title}
                                      className="w-full h-44 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                      onError={(e) => {
                                        e.currentTarget.classList.add('hidden');
                                        const parent = e.currentTarget.parentElement;
                                        const fallback = parent?.querySelector('.img-error-fallback');
                                        if (fallback) fallback.classList.remove('hidden');
                                      }}
                                    />
                                    <div className="img-error-fallback hidden w-full h-32 bg-zinc-900 border border-dashed border-zinc-700 flex flex-col items-center justify-center gap-1.5 text-zinc-400 text-xs p-3 text-center">
                                      <FolderGit2 className="w-5 h-5 text-yellow-400/80" />
                                      <span className="font-semibold text-zinc-200">Dokumentasi Kedinasan: {log.title}</span>
                                      <span className="text-[10px] text-zinc-400 font-mono">(Tersimpan dalam Arsip Ditjen Kuathan Kemhan)</span>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Status: {log.status || 'Selesai'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Featured Projects */}
              <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-5 sm:p-6 space-y-5">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-base font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-yellow-400" />
                    <span>Featured Projects / Hasil Kerja</span>
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Output & kontribusi utama {activeMember?.name} selama PKL
                  </p>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-300 text-xs">
                      Belum ada Featured Project untuk {activeMember?.name}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {filteredProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="gsap-proj-card group bg-zinc-900/95 border border-zinc-800 hover:border-yellow-400 rounded-xl p-4 transition-all duration-300 space-y-3 shadow-md hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(250,204,21,0.22)]"
                      >
                        {renderProjectPreview(proj)}

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
                              {proj.title}
                            </h4>
                            {proj.metric && (
                              <span className="shrink-0 px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-[10px] font-black uppercase">
                                {proj.metric}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(proj.tags || []).map((tag, i) => (
                            <span
                              key={i}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                i % 2 === 0
                                  ? 'bg-zinc-800 text-yellow-300 border-yellow-500/30'
                                  : 'bg-red-950/60 text-red-300 border-red-500/30'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE BOTTOM NAVIGATION DOCK (Thumb-Zone // Hanya di layar < md) */}
          <aside
            ref={mobileDockRef}
            aria-label="Navigasi Bawah Seluler"
            className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm bg-[#090b10]/95 border-2 border-yellow-400 shadow-[0_12px_36px_rgba(0,0,0,0.9)] rounded-xl p-1.5 flex items-center justify-around backdrop-blur-md"
          >
            <button
              type="button"
              onClick={handleScrollToHero}
              className="flex-1 py-2.5 px-1 text-center font-black italic uppercase text-[11px] text-zinc-300 hover:text-yellow-400 active:text-yellow-400 active:scale-95 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              title="Ke Home Briefing"
            >
              01 // Home
            </button>
            <div className="w-px h-6 bg-white/20 shrink-0" />
            <button
              type="button"
              onClick={() => handleScrollToStage()}
              className="flex-1 py-2.5 px-1 text-center font-black italic uppercase text-[11px] text-yellow-400 active:scale-95 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              title="Ke Panggung Karakter"
            >
              02 // Karakter
            </button>
            <div className="w-px h-6 bg-white/20 shrink-0" />
            <button
              type="button"
              onClick={handleSelectAndScroll}
              className="flex-1 py-2.5 px-1 text-center font-black italic uppercase text-[11px] text-zinc-300 hover:text-yellow-400 active:text-yellow-400 active:scale-95 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              title="Ke Logbook dan Proyek"
            >
              03 // Logbook
            </button>
          </aside>

          {/* Footer Kedinasan // Minimalis & Elegan */}
          <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8 px-4 text-center space-y-2 mt-10">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="text-yellow-400 font-black">THE FINALS THEME</span>
              <span>•</span>
              <span>Ditjen Kuathan Kemhan RI</span>
              <span>•</span>
              <span>Tim Magang 2026</span>
            </div>
            <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
              Aplikasi Rekapitulasi Laporan Praktik Kerja Lapangan (PKL) Direktorat Jenderal Kekuatan Pertahanan Kementerian Pertahanan RI.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setAdminActiveMemberId(activeMember?.id);
                  setActiveMode('admin');
                }}
                className="text-[11px] text-zinc-500 hover:text-yellow-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none rounded"
              >
                <Settings className="w-3 h-3" />
                <span>Portal Operator // Kelola Data</span>
              </button>
            </div>
          </footer>
        </div>
      ) : (
        /* ========================================== */
        /* ADMIN CONTROL PANEL                        */
        /* ========================================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-900 border border-red-500/40 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-yellow-400 text-xs font-black italic uppercase tracking-wider">
                <LayoutDashboard className="w-4 h-4" />
                <span>OPERATOR CONTROL PANEL // DITJEN KUATHAN KEMHAN</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white">
                Pilih Namamu & Update Isi Laporan Magang Ditjen Kuathan Kemhan 👇
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                Ahmad & Fero (IT Support), Abimanyu (TU SDM), Rafly (TU Ditmat), dan Alfi (TU Fasjas) dapat mengelola logbook, project, dan profil mandiri di sini!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-black/80 border border-yellow-400/50 rounded-lg p-2.5 flex items-center gap-2.5">
                <span className="text-xs text-zinc-300 font-bold uppercase">Operator:</span>
                <select
                  value={adminActiveMemberId}
                  onChange={(e) => {
                    setAdminActiveMemberId(e.target.value);
                    setSelectedMemberId(e.target.value);
                    setEditingLogId(null);
                    setEditingProjectId(null);
                  }}
                  className="bg-zinc-900 text-yellow-400 font-black uppercase text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 cursor-pointer"
                >
                  {displayMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} : {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setActiveMode('presentasi')}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-xs tracking-wider shadow-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              >
                <Presentation className="w-4 h-4" />
                <span>Kembali ke Panggung</span>
              </button>
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto pb-3 gap-2 border-b border-zinc-800 scrollbar-none sm:flex-wrap">
            <button
              onClick={() => setAdminTab('input-log')}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all shrink-0 sm:shrink cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                adminTab === 'input-log'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>1. Jurnal Harian ({adminMemberLogs.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('input-project')}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all shrink-0 sm:shrink cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                adminTab === 'input-project'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>2. Featured Project ({adminMemberProjects.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('profil-karakter')}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all shrink-0 sm:shrink cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                adminTab === 'profil-karakter'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>3. Kustomisasi Profil ({adminCurrentMember?.name})</span>
            </button>

            <button
              onClick={() => setAdminTab('kelola-anggota')}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all shrink-0 sm:shrink cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                adminTab === 'kelola-anggota'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>4. Tambah Anggota</span>
            </button>

            <button
              onClick={() => setAdminTab('backup')}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all shrink-0 sm:shrink cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none ${
                adminTab === 'backup'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Backup JSON</span>
            </button>
          </div>

          <div ref={adminContentRef}>
            {adminTab === 'input-log' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveLog}
                className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-black italic uppercase text-white">
                    {editingLogId ? '✏️ Edit Kegiatan' : `➕ Input Jurnal (${adminCurrentMember?.name})`}
                  </h3>
                  {editingLogId && (
                    <button
                      type="button"
                      onClick={() => setEditingLogId(null)}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Tanggal Kegiatan</label>
                    <input
                      type="date"
                      required
                      value={logForm.date}
                      onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Periode Bulan</label>
                    <select
                      value={logForm.month}
                      onChange={(e) => setLogForm({ ...logForm, month: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      <option value="Bulan 1">Bulan 1</option>
                      <option value="Bulan 2">Bulan 2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Judul Kegiatan Hari Ini</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Troubleshooting PC Staf / Registrasi Berkas Ditmat"
                    value={logForm.title}
                    onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Deskripsi Detail Pekerjaan</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan detail kegiatan kedinasan seperti di buku jurnal magang Ditjen Kuathan Kemhan..."
                    value={logForm.description}
                    onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={logForm.category}
                      onChange={(e) => setLogForm({ ...logForm, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      <option value="Web Dev">Web Dev</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Jaringan">Jaringan</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Arsip">Arsip</option>
                      <option value="Administrasi">Administrasi</option>
                      <option value="Multimedia">Multimedia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Status</label>
                    <select
                      value={logForm.status}
                      onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
                    >
                      <option value="Selesai">Selesai</option>
                      <option value="Proses">Proses / Berlanjut</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Link Foto Dokumentasi (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={logForm.imageUrl}
                    onChange={(e) => setLogForm({ ...logForm, imageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLogForm({ ...logForm, imageUrl: img.url })}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-yellow-300 border border-zinc-700 cursor-pointer"
                      >
                        + {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg transition-all cursor-pointer"
                >
                  {editingLogId ? 'Simpan Perubahan' : `Simpan Jurnal ${adminCurrentMember?.name}`}
                </button>
              </form>

              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white border-b border-zinc-800 pb-3">
                  Daftar Jurnal Milik <span className="text-yellow-400">{adminCurrentMember?.name}</span> ({adminMemberLogs.length})
                </h3>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {adminMemberLogs.length === 0 ? (
                    <div className="text-center py-10 text-xs text-zinc-300">
                      Belum ada kegiatan yang diinput untuk {adminCurrentMember?.name}.
                    </div>
                  ) : (
                    adminMemberLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <span className="text-yellow-400 font-mono font-bold">{log.date}</span>
                            <span>•</span>
                            <span>{log.month}</span>
                            <span>•</span>
                            <span className="text-zinc-300 font-semibold">{log.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{log.title}</h4>
                          <p className="text-xs text-zinc-300 line-clamp-2">{log.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleEditLogClick(log)}
                            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                            title="Edit"
                            aria-label={`Edit kegiatan ${log.title}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-rose-500 text-zinc-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                            title="Hapus"
                            aria-label={`Hapus kegiatan ${log.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'input-project' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveProject}
                className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-black italic uppercase text-white">
                    {editingProjectId ? '✏️ Edit Project' : `🚀 Tambah Project (${adminCurrentMember?.name})`}
                  </h3>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={() => setEditingProjectId(null)}
                      className="text-xs text-rose-400 hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none rounded"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Nama Project / Hasil Kerja Utama</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aplikasi SIARSIP Digital"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan kontribusi atau output dari hasil kerja ini..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Highlight Angka / Metric</label>
                    <input
                      type="text"
                      placeholder="Misal: 500+ Arsip / 100% Digital"
                      value={projectForm.metric}
                      onChange={(e) => setProjectForm({ ...projectForm, metric: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Visual Card Preview</label>
                    <select
                      value={projectForm.previewType}
                      onChange={(e) => setProjectForm({ ...projectForm, previewType: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 cursor-pointer"
                    >
                      <option value="web">Mockup Aplikasi Web</option>
                      <option value="archive">Database Arsip & Surat</option>
                      <option value="network">Topologi Jaringan LAN</option>
                      <option value="dashboard">System Monitor / Hardware</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Tech Stack / Tags (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    placeholder="React, Tailwind, Networking, MikroTik"
                    value={projectForm.tagsInput}
                    onChange={(e) => setProjectForm({ ...projectForm, tagsInput: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                >
                  {editingProjectId ? 'Update Project' : `Simpan Project ${adminCurrentMember?.name}`}
                </button>
              </form>

              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white border-b border-zinc-800 pb-3">
                  Daftar Project Milik <span className="text-yellow-400">{adminCurrentMember?.name}</span> ({adminMemberProjects.length})
                </h3>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {adminMemberProjects.length === 0 ? (
                    <div className="text-center py-10 text-xs text-zinc-300">
                      Belum ada project yang diinput untuk {adminCurrentMember?.name}.
                    </div>
                  ) : (
                    adminMemberProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                            {proj.metric && (
                              <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                                {proj.metric}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-300">{proj.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditProjectClick(proj)}
                            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                            title="Edit"
                            aria-label={`Edit project ${proj.title}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center bg-zinc-800 hover:bg-rose-500 text-zinc-300 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                            title="Hapus"
                            aria-label={`Hapus project ${proj.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'profil-karakter' && (
            <div className="max-w-2xl bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-5">
              <div className="space-y-1 border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-yellow-400" />
                  <span>Kustomisasi Profil & Peran: <span className="text-yellow-400">{adminCurrentMember?.name}</span></span>
                </h3>
                <p className="text-xs text-zinc-300">
                  Ubah postur tubuh (Build), warna aura panggung, spesialisasi pekerjaan, dan biografi singkat.
                </p>
              </div>

              <form onSubmit={handleSaveContestantProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Nama Contestant</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Tipe Postur Tubuh (Build)</label>
                    <select
                      value={profileForm.buildType}
                      onChange={(e) => setProfileForm({ ...profileForm, buildType: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 cursor-pointer"
                    >
                      <option value="LIGHT BUILD">LIGHT BUILD (Ramping & Lincah)</option>
                      <option value="MEDIUM BUILD">MEDIUM BUILD (Standar Atletik)</option>
                      <option value="HEAVY BUILD">HEAVY BUILD (Kekar & Kokoh)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Role / Spesialisasi Pekerjaan</label>
                    <input
                      type="text"
                      required
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Warna Aura / Spotlight</label>
                    <input
                      type="color"
                      value={profileForm.tintColor}
                      onChange={(e) => setProfileForm({ ...profileForm, tintColor: e.target.value })}
                      className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Deskripsi Singkat Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                >
                  Simpan Perubahan Profil
                </button>
              </form>
            </div>
          )}

          {adminTab === 'kelola-anggota' && (
            <div className="max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-yellow-400" />
                  <span>Tambah Contestant Baru ke Panggung</span>
                </h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Tambahkan anggota tim baru agar ikut tampil dalam rotasi panggung THE FINALS.
                </p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Dimas"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Role / Fokus PKL</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: NETWORK & HARDWARE OPS"
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Tipe Postur Tubuh (Build)</label>
                  <select
                    value={newMemberForm.buildType}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, buildType: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 cursor-pointer"
                  >
                    <option value="LIGHT BUILD">LIGHT BUILD</option>
                    <option value="MEDIUM BUILD">MEDIUM BUILD</option>
                    <option value="HEAVY BUILD">HEAVY BUILD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Biografi Singkat</label>
                  <textarea
                    rows={2}
                    placeholder="Deskripsikan peran dan keahlian anggota ini..."
                    value={newMemberForm.bio}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, bio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                >
                  + Tambahkan ke Panggung
                </button>
              </form>
            </div>
          )}

          {adminTab === 'backup' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-yellow-400" />
                  <span>Download Backup Data (JSON)</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Unduh seluruh database kegiatan, project, dan kustomisasi profil tim ke dalam file JSON lokal.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black italic uppercase flex items-center gap-2 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export backup_pkl.json</span>
                  </button>
                  <button
                    onClick={handleResetDefaultData}
                    className="px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 text-xs font-black italic uppercase flex items-center gap-2 cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Data Template</span>
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore / Import JSON</span>
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Paste isi teks file backup JSON untuk memulihkan seluruh data secara instan.
                </p>
                <textarea
                  rows={4}
                  placeholder="Paste isi file backup JSON di sini..."
                  value={jsonInputText}
                  onChange={(e) => setJsonInputText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
                />
                <button
                  onClick={handleImportJSON}
                  className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black italic uppercase text-xs cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                >
                  Import & Sinkronkan Data
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
