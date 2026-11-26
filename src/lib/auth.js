const AUTH_KEY = 'finals-pkl-admin'
const SESSION_KEY = 'finals-pkl-session'

// Ganti lewat .env.local atau .env kalau perlu:
// VITE_ADMIN_USER=admin
// VITE_ADMIN_PASS=pkl2026
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const ADMIN_USER = (env.VITE_ADMIN_USER || 'admin').toLowerCase()
const ADMIN_PASS = env.VITE_ADMIN_PASS || 'pkl2026'

export function getAuthSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && (parsed.role === 'admin' || parsed.role === 'member')) {
        return parsed
      }
    }
    // Cek backwards compatibility admin
    if (sessionStorage.getItem(AUTH_KEY) === '1') {
      return {
        role: 'admin',
        memberId: null,
        name: 'Administrator',
        username: ADMIN_USER,
      }
    }
  } catch {
    return null
  }
  return null
}

export function saveSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
    if (session.role === 'admin') {
      sessionStorage.setItem(AUTH_KEY, '1')
    } else {
      sessionStorage.removeItem(AUTH_KEY)
    }
  } catch {
    /* private mode */
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(AUTH_KEY)
  } catch {
    /* private mode */
  }
}

/**
 * Autentikasi untuk anggota magang atau admin
 * @param {string} username - Username / id / nama anggota atau 'admin'
 * @param {string} password - Password
 * @param {Array} members - Daftar anggota dari Supabase
 * @returns {{ success: boolean, session?: object, error?: string }}
 */
export function login(username, password, members = []) {
  const u = String(username || '').trim().toLowerCase()
  const p = String(password || '').trim()

  if (!u) {
    return { success: false, error: 'Username atau nama anggota wajib diisi.' }
  }
  if (!p) {
    return { success: false, error: 'Password wajib diisi.' }
  }

  // 1. Cek Admin
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    const session = {
      role: 'admin',
      memberId: null,
      name: 'Administrator',
      username: ADMIN_USER,
    }
    saveSession(session)
    return { success: true, session }
  }

  // 2. Cek Anggota Magang (berdasarkan ID atau Nama)
  const member = members.find(
    (m) =>
      m.id.toLowerCase() === u ||
      m.name.toLowerCase() === u ||
      m.id.toLowerCase().replace(/[^a-z0-9]/g, '') === u.replace(/[^a-z0-9]/g, ''),
  )

  if (member) {
    const customPass = member.password ? String(member.password).trim() : null
    const isDefaultPass = !customPass || customPass === 'magang2026'
    const valid =
      (customPass && p === customPass) ||
      (isDefaultPass &&
        (p === 'magang2026' ||
          p === 'pkl2026' ||
          p.toLowerCase() === member.id.toLowerCase()))

    if (valid) {
      const session = {
        role: 'member',
        memberId: member.id,
        name: member.name,
        username: member.id,
      }
      saveSession(session)
      return { success: true, session }
    }
    return {
      success: false,
      error: isDefaultPass
        ? `Password salah untuk ${member.name}. Password default: magang2026`
        : `Password salah untuk ${member.name}.`,
    }
  }

  return {
    success: false,
    error: `Akun "${username}" tidak ditemukan. Masukkan nama/ID anggota magang (contoh: ahmad, abimanyu, rafly) atau admin.`,
  }
}

export function logout() {
  clearSession()
}

// Backwards compatibility helpers
export function isAdminAuthed() {
  const session = getAuthSession()
  return session?.role === 'admin'
}

export function isMemberAuthed(memberId = null) {
  const session = getAuthSession()
  if (!session) return false
  if (session.role === 'admin') return true
  return session.role === 'member' && (!memberId || session.memberId === memberId)
}

export function adminLogin(username, password) {
  const res = login(username, password, [])
  return res.success && res.session?.role === 'admin'
}

export function adminLogout() {
  logout()
}
