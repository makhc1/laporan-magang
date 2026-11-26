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
    sx: 1.24,
    sy: 1.02,
    aura: '#facc15',
    skin: '#d9a07a',
    hair: 'curly',
    hairColor: '#1a1410',
    bio: 'Membangun website layanan internal dari analisis kebutuhan sampai deployment di server lokal.',
  },
  {
    id: 'abimanyu',
    name: 'Abimanyu',
    role: 'Network Admin',
    division: 'Jaringan LAN',
    build: 'LIGHT',
    sx: 0.9,
    sy: 1.0,
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
    sx: 0.88,
    sy: 1.0,
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
    sx: 0.9,
    sy: 1.0,
    aura: '#10b981',
    skin: '#b9805b',
    hair: 'crop',
    hairColor: '#120d0a',
    bio: 'Menyusun dashboard monitoring yang merangkum data operasional menjadi grafik yang mudah dibaca.',
  },
  {
    id: 'alfi',
    name: 'Alfi',
    role: 'UI/UX & Dokumentasi',
    division: 'Desain & Laporan',
    build: 'LIGHT',
    sx: 0.88,
    sy: 1.0,
    aura: '#a855f7',
    skin: '#e0ac86',
    hair: 'beard',
    hairColor: '#1a1410',
    bio: 'Merancang antarmuka di Figma dan merapikan dokumentasi seluruh pekerjaan kelompok.',
  },
]

export function monthOf(date) {
  const month = String(date).slice(0, 7)
  if (month === '2026-10') return 1
  if (month === '2026-11') return 2
  return 0
}

// Mulai kosong: hanya akun anggota yang di-seed.
// Jurnal & project sengaja tidak diisi agar bisa diinput sendiri tanpa ketimpa data contoh.
export function seed() {
  return {
    members: MEMBERS.map((m) => ({ ...m })),
    journals: [],
    projects: [],
  }
}
