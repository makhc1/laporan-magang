export const pad = (n) => String(n).padStart(2, '0')

export const fmtDate = (date) => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
  } catch {
    return date
  }
}

export const STATUS_COLORS = {
  Selesai: '#10b981',
  Berjalan: '#facc15',
  Revisi: '#ef4444',
}

export const byDate = (a, b) => (a.date < b.date ? -1 : 1)

export const fmtShort = (date) => {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(`${date}T00:00:00`))
  } catch {
    return date
  }
}

// Judul otomatis dari deskripsi singkat: ambil beberapa kata pertama.
export const autoTitle = (desc, maxWords = 9) => {
  const clean = String(desc || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!clean) return 'Kegiatan Magang'

  const words = clean.split(' ')
  const slice = words.slice(0, maxWords).join(' ')
  const title = slice.charAt(0).toUpperCase() + slice.slice(1)
  return words.length > maxWords ? `${title}…` : title
}
