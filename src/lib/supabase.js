import { createClient } from '@supabase/supabase-js'

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}

const supabaseUrl = env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes('your-project') &&
      !supabaseAnonKey.includes('your-anon-key'),
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null

// Mappers antara model Javascript (camelCase) dan SQL Supabase (snake_case)
export const mappers = {
  member: {
    toDb: (m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      division: m.division,
      build: m.build || 'LIGHT',
      sx: m.sx || 1.0,
      sy: m.sy || 1.0,
      aura: m.aura || '#facc15',
      skin: m.skin || '#d9a07a',
      hair: m.hair || 'buzz',
      hair_color: m.hairColor || '#1a1410',
      bio: m.bio || '',
      password: m.password || 'magang2026',
    }),
    fromDb: (row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      division: row.division,
      build: row.build,
      sx: Number(row.sx) || 1,
      sy: Number(row.sy) || 1,
      aura: row.aura,
      skin: row.skin,
      hair: row.hair,
      hairColor: row.hair_color || '#1a1410',
      bio: row.bio || '',
      password: row.password || 'magang2026',
    }),
  },
  journal: {
    toDb: (j) => ({
      id: j.id,
      member_id: j.memberId,
      date: j.date,
      month: j.month || 1,
      category: j.category,
      title: j.title,
      desc: j.desc,
      photo: j.photo || 'none',
      status: j.status || 'Selesai',
    }),
    fromDb: (row) => ({
      id: row.id,
      memberId: row.member_id,
      date: typeof row.date === 'string' ? row.date.slice(0, 10) : row.date,
      month: row.month,
      category: row.category,
      title: row.title,
      desc: row.desc,
      photo: row.photo,
      status: row.status,
    }),
  },
  project: {
    toDb: (p) => ({
      id: p.id,
      member_id: p.memberId,
      title: p.title,
      metric: p.metric,
      mock: p.mock || 'web',
      desc: p.desc,
      tags: Array.isArray(p.tags) ? p.tags : [],
    }),
    fromDb: (row) => ({
      id: row.id,
      memberId: row.member_id,
      title: row.title,
      metric: row.metric,
      mock: row.mock,
      desc: row.desc,
      tags: row.tags || [],
    }),
  },
}

/**
 * Mengambil semua data dari Supabase
 */
export async function fetchSupabaseData() {
  if (!supabase) return null

  try {
    const [mRes, jRes, pRes] = await Promise.all([
      supabase.from('members').select('*').order('created_at', { ascending: true }),
      supabase.from('journals').select('*').order('date', { ascending: true }),
      supabase.from('projects').select('*').order('created_at', { ascending: true }),
    ])

    if (mRes.error || jRes.error || pRes.error) {
      console.warn('Supabase fetch error:', mRes.error || jRes.error || pRes.error)
      return null
    }

    if (!mRes.data?.length) {
      return null // tabel belum di-seed
    }

    return {
      members: (mRes.data || []).map(mappers.member.fromDb),
      journals: (jRes.data || []).map(mappers.journal.fromDb),
      projects: (pRes.data || []).map(mappers.project.fromDb),
    }
  } catch (err) {
    console.warn('Gagal menghubungi Supabase:', err)
    return null
  }
}

/**
 * Menyinkronkan seluruh dataset ke Supabase
 */
export async function syncAllToSupabase(data) {
  if (!supabase) return { success: false, error: 'Supabase belum dikonfigurasi di .env' }

  try {
    const dbMembers = data.members.map(mappers.member.toDb)
    const dbJournals = data.journals.map(mappers.journal.toDb)
    const dbProjects = data.projects.map(mappers.project.toDb)

    const [mRes, jRes, pRes] = await Promise.all([
      supabase.from('members').upsert(dbMembers),
      supabase.from('journals').upsert(dbJournals),
      supabase.from('projects').upsert(dbProjects),
    ])

    if (mRes.error || jRes.error || pRes.error) {
      const err = mRes.error || jRes.error || pRes.error
      return { success: false, error: err.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message || 'Gagal sinkronisasi data ke Supabase' }
  }
}
