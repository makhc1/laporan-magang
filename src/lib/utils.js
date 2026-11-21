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
