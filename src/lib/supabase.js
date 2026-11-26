import { createClient } from '@supabase/supabase-js'

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}

const supabaseUrl = String(env.VITE_SUPABASE_URL || '').trim()
const supabaseKey = String(
  env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
).trim()

export function getSupabaseConfigError() {
  if (!supabaseUrl || !supabaseKey) {
    return 'VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY belum diisi di file .env.'
  }

  if (
    supabaseUrl.includes('your-project') ||
    supabaseKey.includes('your-anon-key') ||
    supabaseKey.includes('your-publishable-key')
  ) {
    return 'Konfigurasi .env masih menggunakan nilai placeholder. Isi dengan URL dan Publishable/Anon Key project Supabase asli.'
  }

  if (!/^https?:\/\//i.test(supabaseUrl)) {
    return 'VITE_SUPABASE_URL tidak valid. URL harus diawali https:// (contoh: https://xxxx.supabase.co).'
  }

  if (supabaseKey.startsWith('sb_secret_')) {
    return 'VITE_SUPABASE_ANON_KEY memakai Secret Key (sb_secret_...), yang diblokir Supabase di browser (401 Forbidden). Ganti dengan Publishable Key (sb_publishable_...) atau Legacy Anon Key (eyJ...) dari Supabase Dashboard > Project Settings > API Keys.'
  }

  return null
}

export const isSupabaseConfigured = () => getSupabaseConfigError() === null

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null

export function formatSupabaseError(error) {
  if (!error) return 'Terjadi kesalahan saat menghubungi Supabase.'

  const message = typeof error === 'string' ? error : error.message || ''
  const code = typeof error === 'object' ? error.code : ''

  if (/secret api key in browser/i.test(message)) {
    return 'Supabase menolak Secret Key (sb_secret_...) di browser. Ganti VITE_SUPABASE_ANON_KEY dengan Publishable Key (sb_publishable_...) atau Legacy Anon Key (eyJ...).'
  }

  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    /could not find the table|relation .* does not exist/i.test(message)
  ) {
    return 'Tabel database belum ditemukan di Supabase. Jalankan skrip supabase/schema.sql di Supabase Dashboard > SQL Editor terlebih dahulu.'
  }

  if (code === '42501' || /row-level security/i.test(message)) {
    return 'Akses ditolak oleh Row Level Security (RLS) Supabase. Pastikan policy di supabase/schema.sql sudah dijalankan.'
  }

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return 'Gagal terhubung ke server Supabase. Periksa koneksi internet dan VITE_SUPABASE_URL.'
  }

  return message || 'Terjadi kesalahan pada database Supabase.'
}

// Mappers antara model Javascript (camelCase) dan SQL Supabase (snake_case)
export const mappers = {
  member: {
    toDb: (m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      division: m.division,
      build: m.build || 'LIGHT',
      sx: Number(m.sx) || 1.0,
      sy: Number(m.sy) || 1.0,
      aura: m.aura || '#facc15',
      skin: m.skin || '#d9a07a',
      hair: m.hair || 'buzz',
      hair_color: m.hairColor || '#1a1410',
      bio: m.bio || '',
      password: m.password || 'magang2026',
    }),
    profilePatchToDb: (patch) => {
      const dbPatch = {}
      if (patch.name !== undefined) dbPatch.name = patch.name
      if (patch.role !== undefined) dbPatch.role = patch.role
      if (patch.division !== undefined) dbPatch.division = patch.division
      if (patch.build !== undefined) dbPatch.build = patch.build
      if (patch.sx !== undefined) dbPatch.sx = Number(patch.sx)
      if (patch.sy !== undefined) dbPatch.sy = Number(patch.sy)
      if (patch.aura !== undefined) dbPatch.aura = patch.aura
      if (patch.skin !== undefined) dbPatch.skin = patch.skin
      if (patch.hair !== undefined) dbPatch.hair = patch.hair
      if (patch.hairColor !== undefined) dbPatch.hair_color = patch.hairColor
      if (patch.bio !== undefined) dbPatch.bio = patch.bio
      return dbPatch
    },
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
      month: j.month ?? 0,
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
      month: Number(row.month ?? 0),
      category: row.category,
      title: row.title,
      desc: row.desc,
      photo: row.photo || 'none',
      status: row.status || 'Selesai',
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
      mock: row.mock || 'web',
      desc: row.desc,
      tags: Array.isArray(row.tags) ? row.tags : [],
    }),
  },
}

function ensureClient() {
  if (!supabase) {
    return { client: null, error: getSupabaseConfigError() }
  }
  return { client: supabase, error: null }
}

/**
 * Mengambil semua data dari Supabase.
 * Jika tabel members kosong dan seedMembers disediakan, akun awal otomatis dibuat di Supabase.
 */
export async function fetchSupabaseData({ seedMembers } = {}) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { data: null, error: cfgError }

  try {
    const [mRes, jRes, pRes] = await Promise.all([
      client.from('members').select('*').order('created_at', { ascending: true }),
      client
        .from('journals')
        .select('*')
        .order('date', { ascending: true })
        .order('created_at', { ascending: true }),
      client.from('projects').select('*').order('created_at', { ascending: true }),
    ])

    const queryError = mRes.error || jRes.error || pRes.error
    if (queryError) {
      return { data: null, error: formatSupabaseError(queryError) }
    }

    let memberRows = mRes.data || []

    if (!memberRows.length && Array.isArray(seedMembers) && seedMembers.length) {
      const dbSeedMembers = seedMembers.map(mappers.member.toDb)
      const seedRes = await client
        .from('members')
        .upsert(dbSeedMembers, { onConflict: 'id' })
        .select('*')

      if (seedRes.error) {
        return { data: null, error: formatSupabaseError(seedRes.error) }
      }

      memberRows = seedRes.data?.length ? seedRes.data : dbSeedMembers
    }

    return {
      data: {
        members: memberRows.map(mappers.member.fromDb),
        journals: (jRes.data || []).map(mappers.journal.fromDb),
        projects: (pRes.data || []).map(mappers.project.fromDb),
      },
      error: null,
    }
  } catch (err) {
    return { data: null, error: formatSupabaseError(err) }
  }
}

export async function upsertJournal(entry) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('journals').upsert(mappers.journal.toDb(entry))
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function upsertJournals(entries) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }
  if (!entries.length) return { success: true }

  try {
    const { error } = await client.from('journals').upsert(entries.map(mappers.journal.toDb))
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function deleteJournalById(id) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('journals').delete().eq('id', id)
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function upsertProject(entry) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('projects').upsert(mappers.project.toDb(entry))
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function deleteProjectById(id) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('projects').delete().eq('id', id)
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function updateMemberProfile(id, patch) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const dbPatch = mappers.member.profilePatchToDb(patch)
    const { error } = await client.from('members').update(dbPatch).eq('id', id)
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function updateMemberPassword(id, password) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('members').update({ password }).eq('id', id)
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function insertMember(member) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('members').insert(mappers.member.toDb(member))
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function deleteMemberById(id) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const { error } = await client.from('members').delete().eq('id', id)
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

export async function clearJournalsAndProjects() {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const [journalsRes, projectsRes] = await Promise.all([
      client.from('journals').delete().not('id', 'is', null),
      client.from('projects').delete().not('id', 'is', null),
    ])
    const error = journalsRes.error || projectsRes.error
    if (error) return { success: false, error: formatSupabaseError(error) }
    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}

/**
 * Menyinkronkan seluruh dataset (restore/import) ke Supabase dengan urutan FK aman:
 * 1) Upsert members dulu, 2) Upsert journals & projects, 3) Hapus record lama yang tidak ada di snapshot.
 */
export async function syncAllToSupabase(data) {
  const { client, error: cfgError } = ensureClient()
  if (cfgError) return { success: false, error: cfgError }

  try {
    const dbMembers = (data.members || []).map(mappers.member.toDb)
    const dbJournals = (data.journals || []).map(mappers.journal.toDb)
    const dbProjects = (data.projects || []).map(mappers.project.toDb)

    const [existingMembersRes, existingJournalsRes, existingProjectsRes] = await Promise.all([
      client.from('members').select('id'),
      client.from('journals').select('id'),
      client.from('projects').select('id'),
    ])

    const existingErr =
      existingMembersRes.error || existingJournalsRes.error || existingProjectsRes.error
    if (existingErr) {
      return { success: false, error: formatSupabaseError(existingErr) }
    }

    // 1. Upsert members terlebih dahulu untuk memenuhi foreign key member_id
    if (dbMembers.length) {
      const mRes = await client.from('members').upsert(dbMembers)
      if (mRes.error) return { success: false, error: formatSupabaseError(mRes.error) }
    }

    // 2. Upsert journals dan projects secara paralel
    const [jRes, pRes] = await Promise.all([
      dbJournals.length
        ? client.from('journals').upsert(dbJournals)
        : Promise.resolve({ error: null }),
      dbProjects.length
        ? client.from('projects').upsert(dbProjects)
        : Promise.resolve({ error: null }),
    ])

    if (jRes.error || pRes.error) {
      return { success: false, error: formatSupabaseError(jRes.error || pRes.error) }
    }

    // 3. Bersihkan baris yang tidak ada di snapshot impor
    const nextMemberIds = new Set(dbMembers.map((m) => m.id))
    const nextJournalIds = new Set(dbJournals.map((j) => j.id))
    const nextProjectIds = new Set(dbProjects.map((p) => p.id))

    const removedJournalIds = (existingJournalsRes.data || [])
      .map((row) => row.id)
      .filter((id) => !nextJournalIds.has(id))
    const removedProjectIds = (existingProjectsRes.data || [])
      .map((row) => row.id)
      .filter((id) => !nextProjectIds.has(id))
    const removedMemberIds = (existingMembersRes.data || [])
      .map((row) => row.id)
      .filter((id) => !nextMemberIds.has(id))

    const [delJRes, delPRes] = await Promise.all([
      removedJournalIds.length
        ? client.from('journals').delete().in('id', removedJournalIds)
        : Promise.resolve({ error: null }),
      removedProjectIds.length
        ? client.from('projects').delete().in('id', removedProjectIds)
        : Promise.resolve({ error: null }),
    ])

    if (delJRes.error || delPRes.error) {
      return { success: false, error: formatSupabaseError(delJRes.error || delPRes.error) }
    }

    if (removedMemberIds.length) {
      const delMRes = await client.from('members').delete().in('id', removedMemberIds)
      if (delMRes.error) {
        return { success: false, error: formatSupabaseError(delMRes.error) }
      }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: formatSupabaseError(err) }
  }
}
