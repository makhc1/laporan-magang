import { useCallback, useEffect, useMemo, useState } from 'react'
import { BUILD, seed } from '../data/seed'
import {
  fetchSupabaseData,
  isSupabaseConfigured,
  mappers,
  supabase,
  syncAllToSupabase,
} from './supabase'

const KEY = 'finals-pkl-v2'

function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.members?.length && parsed?.journals && parsed?.projects) return parsed
    }
  } catch {
    /* fallback to seed */
  }
  return seed()
}

export function useData() {
  const [data, setData] = useState(loadLocal)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(() => (isSupabaseConfigured() ? 'connecting' : 'local'))

  // Simpan ke localStorage sebagai cache offline
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      /* quota */
    }
  }, [data])

  // Sinkronisasi awal dengan Supabase & langganan Realtime
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setSyncStatus('local')
      return
    }

    let isMounted = true
    setSyncStatus('syncing')

    // 1. Ambil data dari Supabase
    fetchSupabaseData()
      .then((remoteData) => {
        if (!isMounted) return
        if (remoteData) {
          setData(remoteData)
          setSyncStatus('connected')
        } else {
          setSyncStatus('connected')
        }
      })
      .catch(() => {
        if (isMounted) setSyncStatus('error')
      })

    // 2. Langganan Supabase Realtime (update otomatis multi-user)
    const channel = supabase
      .channel('pkl-live-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journals' },
        () => {
          fetchSupabaseData().then((fresh) => {
            if (fresh && isMounted) setData(fresh)
          })
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchSupabaseData().then((fresh) => {
            if (fresh && isMounted) setData(fresh)
          })
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        () => {
          fetchSupabaseData().then((fresh) => {
            if (fresh && isMounted) setData(fresh)
          })
        },
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // CRUD Operations (Optimistic UI + Background Supabase Sync)
  const saveJournal = useCallback((entry, editingId) => {
    setData((d) => ({
      ...d,
      journals: editingId
        ? d.journals.map((j) => (j.id === editingId ? entry : j))
        : [...d.journals, entry],
    }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('journals')
        .upsert(mappers.journal.toDb(entry))
        .then(({ error }) => {
          if (error) console.error('Supabase saveJournal error:', error)
        })
    }
  }, [])

  const saveProject = useCallback((entry, editingId) => {
    setData((d) => ({
      ...d,
      projects: editingId
        ? d.projects.map((p) => (p.id === editingId ? entry : p))
        : [...d.projects, entry],
    }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('projects')
        .upsert(mappers.project.toDb(entry))
        .then(({ error }) => {
          if (error) console.error('Supabase saveProject error:', error)
        })
    }
  }, [])

  const deleteJournal = useCallback((id) => {
    setData((d) => ({ ...d, journals: d.journals.filter((j) => j.id !== id) }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('journals')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase deleteJournal error:', error)
        })
    }
  }, [])

  const deleteProject = useCallback((id) => {
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase deleteProject error:', error)
        })
    }
  }, [])

  const saveProfile = useCallback((id, patch) => {
    let updatedMember = null

    setData((d) => {
      const nextMembers = d.members.map((m) => {
        if (m.id !== id) return m
        const next = { ...m, ...patch }
        if (patch.build && patch.build !== m.build) {
          next.sx = BUILD[patch.build].sx
          next.sy = BUILD[patch.build].sy
        }
        updatedMember = next
        return next
      })
      return { ...d, members: nextMembers }
    })

    if (isSupabaseConfigured() && supabase && updatedMember) {
      supabase
        .from('members')
        .update(mappers.member.toDb(updatedMember))
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase saveProfile error:', error)
        })
    }
  }, [])

  const changePassword = useCallback((id, password) => {
    setData((d) => ({
      ...d,
      members: d.members.map((m) => (m.id === id ? { ...m, password } : m)),
    }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('members')
        .update({ password })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase changePassword error:', error)
        })
    }
  }, [])

  const addMember = useCallback((member) => {
    setData((d) => ({ ...d, members: [...d.members, member] }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('members')
        .insert(mappers.member.toDb(member))
        .then(({ error }) => {
          if (error) console.error('Supabase addMember error:', error)
        })
    }
  }, [])

  const removeMember = useCallback((id) => {
    setData((d) => ({
      members: d.members.filter((m) => m.id !== id),
      journals: d.journals.filter((j) => j.memberId !== id),
      projects: d.projects.filter((p) => p.memberId !== id),
    }))

    if (isSupabaseConfigured() && supabase) {
      supabase
        .from('members')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase removeMember error:', error)
        })
    }
  }, [])

  const syncLocalToSupabase = useCallback(async () => {
    setIsSyncing(true)
    const res = await syncAllToSupabase(data)
    setIsSyncing(false)
    if (res.success) setSyncStatus('connected')
    return res
  }, [data])

  const importData = useCallback((next) => {
    setData(next)
    if (isSupabaseConfigured()) {
      syncAllToSupabase(next)
    }
  }, [])

  const clearData = useCallback(async () => {
    setData((d) => ({ ...d, journals: [], projects: [] }))

    // Bersihkan draft form yang belum tersimpan.
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('pkl-journal-draft'))
        .forEach((key) => localStorage.removeItem(key))
    } catch {
      /* localStorage tidak tersedia */
    }

    if (isSupabaseConfigured() && supabase) {
      const [journalsRes, projectsRes] = await Promise.all([
        supabase.from('journals').delete().neq('id', ''),
        supabase.from('projects').delete().neq('id', ''),
      ])
      const error = journalsRes.error || projectsRes.error
      if (error) return { success: false, error: error.message }
    }

    return { success: true }
  }, [])

  const api = useMemo(
    () => ({
      saveJournal,
      saveProject,
      deleteJournal,
      deleteProject,
      saveProfile,
      changePassword,
      addMember,
      removeMember,
      syncLocalToSupabase,
      importData,
      clearData,
    }),
    [
      saveJournal,
      saveProject,
      deleteJournal,
      deleteProject,
      saveProfile,
      changePassword,
      addMember,
      removeMember,
      syncLocalToSupabase,
      importData,
      clearData,
    ],
  )

  return {
    data,
    api,
    isSyncing,
    syncStatus,
    isSupabaseConfigured: isSupabaseConfigured(),
  }
}
