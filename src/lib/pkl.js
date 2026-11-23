// Periode magang: 1 Oktober – 30 November 2026, dihitung per hari kerja (Senin–Jumat).
export const PKL_START = '2026-10-01'
export const PKL_END = '2026-11-30'

const parseDate = (date) => new Date(`${date}T00:00:00`)

const toDateStr = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isWeekday = (date) => date.getDay() !== 0 && date.getDay() !== 6

export function buildPklDates(start = PKL_START, end = PKL_END) {
  const dates = []
  const cursor = parseDate(start)
  const last = parseDate(end)
  while (cursor <= last) {
    if (isWeekday(cursor)) dates.push(toDateStr(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export const PKL_DATES = buildPklDates()
export const PKL_TOTAL_DAYS = PKL_DATES.length

const shortDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })
export const PKL_RANGE_LABEL = `${shortDate.format(parseDate(PKL_START))} – ${shortDate.format(
  parseDate(PKL_END),
)} ${parseDate(PKL_END).getFullYear()}`

export const isPklDate = (date) => PKL_DATES.includes(date)

export function pklDayNumber(date) {
  const index = PKL_DATES.indexOf(date)
  return index === -1 ? 0 : index + 1
}

export function nextPklDate(date) {
  const index = PKL_DATES.indexOf(date)
  if (index === -1) return PKL_DATES.find((day) => day > date) || PKL_DATES[PKL_DATES.length - 1]
  return PKL_DATES[Math.min(index + 1, PKL_DATES.length - 1)]
}

export function nextEmptyPklDate(date, filledDates = []) {
  const filled = new Set(filledDates)
  const index = PKL_DATES.indexOf(date)
  const pool = index === -1 ? PKL_DATES.filter((day) => day > date) : PKL_DATES.slice(index + 1)
  return pool.find((day) => !filled.has(day)) || pool[pool.length - 1] || date
}

export function defaultJournalDate(filledDates = []) {
  const filled = new Set(filledDates)
  const today = toDateStr(new Date())

  if (isPklDate(today) && !filled.has(today)) return today

  return PKL_DATES.find((day) => !filled.has(day)) || PKL_DATES[PKL_DATES.length - 1]
}

export function missingPklDates(filledDates = []) {
  const filled = new Set(filledDates)
  return PKL_DATES.filter((day) => !filled.has(day))
}
