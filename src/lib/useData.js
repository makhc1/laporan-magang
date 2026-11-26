import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BUILD, seed } from '../data/seed'
import {
  clearJournalsAndProjects,
  deleteJournalById,
  deleteMemberById,
  deleteProjectById,
  fetchSupabaseData,
  getSupabaseConfigError,
  insertMember,
  isSupabaseConfigured,
  supabase,
  syncAllToSupabase,
  updateMemberPassword,
  updateMemberProfile,
  upsertJournal,
  upsertJournals,
  upsertProject,
} from './supabase'

const EMPTY_DATA = { members: [], journals: [], projects: [] }

export function useData() {
  const configured = isSupabaseConfigured()
  const configError = getSupabaseConfigError()

  const [data, setData] = useState(EMPTY_DATA)
  const [isLoading, setIsLoading] = useState(configured)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(() => (configured ? 'loading' : 'error'))
  const [syncError, setSyncError] = useState(() => configError)

  const dataRef = useRef(data)
  dataRef.current = data

  const refresh = useCallback(async ({ silent = false } = {}) => {
    const cfgErr = getSupabaseConfigError()
    if (cfgErr || !supabase) {
      setSyncStatus('error')
      setSyncError(cfgErr)
      setIsLoading(false)
      return { success: false, error: cfgErr }
    }

    if (!silent) {
      setIsSyncing(true)
      setSyncStatus((prev) => (prev === 'loading' ? 'loading' : 'syncing'))
    }

    const res = await fetchSupabaseData({ seedMembers: seed().members })

    if (!silent) setIsSyncing(false)
    setIsLoading(false)

    if (res.error || !res.data) {
      setSyncStatus('error')
      setSyncError(res.error || 'Gagal memuat data dari Supabase.')
      return { success: false, error: res.error || 'Gagal memuat data dari Supabase.' }
    }

    setData(res.data)
    setSyncStatus('connected')
    setSyncError(null)
    return { success: true, data: res.data }
  }, [])

  // Sinkronisasi awal dengan Supabase & langganan Realtime
  useEffect(() => {
    if (!configured || !supabase) {
      setSyncStatus('error')
      setSyncError(configError)
      setIsLoading(false)
      return
    }

    let isMounted = true
    let realtimeTimer = null

    refresh().then(() => {
      if (!isMounted) return
    })

    const scheduleRealtimeRefresh = () => {
      if (!isMounted) return
      if (realtimeTimer) window.clearTimeout(realtimeTimer)
      realtimeTimer = window.setTimeout(() => {
        fetchSupabaseData().then((res) => {
          if (!isMounted) return
          if (res.data) {
            setData(res.data)
            setSyncStatus('connected')
            setSyncError(null)
          }
        })
      }, 150)
    }

    const channel = supabase
      .channel('pkl-live-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journals' },
        scheduleRealtimeRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        scheduleRealtimeRefresh,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'members' },
        scheduleRealtimeRefresh,
      )
      .subscribe()

    return () => {
      isMounted = false
      if (realtimeTimer) window.clearTimeout(realtimeTimer)
      supabase.removeChannel(channel)
    }
  }, [configured, configError, refresh])

  const saveJournal = useCallback(async (entry, editingId) => {
    setIsSyncing(true)
    const res = await upsertJournal(entry)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({
      ...d,
      journals: editingId
        ? d.journals.map((j) => (j.id === editingId ? entry : j))
        : [...d.journals, entry],
    }))
    return res
  }, [])

  const saveJournals = useCallback(async (entries) => {
    if (!entries?.length) return { success: true }
    setIsSyncing(true)
    const res = await upsertJournals(entries)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => {
      const existingIds = new Set(entries.map((e) => e.id))
      const remaining = d.journals.filter((j) => !existingIds.has(j.id))
      return { ...d, journals: [...remaining, ...entries] }
    })
    return res
  }, [])

  const saveProject = useCallback(async (entry, editingId) => {
    setIsSyncing(true)
    const res = await upsertProject(entry)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({
      ...d,
      projects: editingId
        ? d.projects.map((p) => (p.id === editingId ? entry : p))
        : [...d.projects, entry],
    }))
    return res
  }, [])

  const deleteJournal = useCallback(async (id) => {
    setIsSyncing(true)
    const res = await deleteJournalById(id)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({ ...d, journals: d.journals.filter((j) => j.id !== id) }))
    return res
  }, [])

  const deleteProject = useCallback(async (id) => {
    setIsSyncing(true)
    const res = await deleteProjectById(id)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }))
    return res
  }, [])

  const saveProfile = useCallback(async (id, patch) => {
    const currentMember = dataRef.current.members.find((m) => m.id === id)
    if (!currentMember) {
      return { success: false, error: 'Anggota tidak ditemukan.' }
    }

    const nextPatch = { ...patch }
    if (patch.build && patch.build !== currentMember.build && BUILD[patch.build]) {
      nextPatch.sx = BUILD[patch.build].sx
      nextPatch.sy = BUILD[patch.build].sy
    }

    setIsSyncing(true)
    const res = await updateMemberProfile(id, nextPatch)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({
      ...d,
      members: d.members.map((m) => (m.id === id ? { ...m, ...nextPatch } : m)),
    }))
    return res
  }, [])

  const changePassword = useCallback(async (id, password) => {
    setIsSyncing(true)
    const res = await updateMemberPassword(id, password)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({
      ...d,
      members: d.members.map((m) => (m.id === id ? { ...m, password } : m)),
    }))
    return res
  }, [])

  const addMember = useCallback(async (member) => {
    const record = { ...member, password: member.password || 'magang2026' }
    setIsSyncing(true)
    const res = await insertMember(record)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({ ...d, members: [...d.members, record] }))
    return res
  }, [])

  const removeMember = useCallback(async (id) => {
    setIsSyncing(true)
    const res = await deleteMemberById(id)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({
      members: d.members.filter((m) => m.id !== id),
      journals: d.journals.filter((j) => j.memberId !== id),
      projects: d.projects.filter((p) => p.memberId !== id),
    }))
    return res
  }, [])

  const importData = useCallback(async (next) => {
    setIsSyncing(true)
    const res = await syncAllToSupabase(next)
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData(next)
    return res
  }, [])

  const clearData = useCallback(async () => {
    setIsSyncing(true)
    const res = await clearJournalsAndProjects()
    setIsSyncing(false)

    if (!res.success) {
      setSyncError(res.error)
      return res
    }

    // Bersihkan draft form sementara di tab saat ini.
    try {
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith('pkl-journal-draft'))
        .forEach((key) => sessionStorage.removeItem(key))
    } catch {
      /* sessionStorage tidak tersedia */
    }

    setSyncStatus('connected')
    setSyncError(null)
    setData((d) => ({ ...d, journals: [], projects: [] }))
    return res
  }, [])

  const api = useMemo(
    () => ({
      refresh,
      saveJournal,
      saveJournals,
      saveProject,
      deleteJournal,
      deleteProject,
      saveProfile,
      changePassword,
      addMember,
      removeMember,
      importData,
      clearData,
    }),
    [
      refresh,
      saveJournal,
      saveJournals,
      saveProject,
      deleteJournal,
      deleteProject,
      saveProfile,
      changePassword,
      addMember,
      removeMember,
      importData,
      clearData,
    ],
  )

  return {
    data,
    api,
    isLoading,
    isSyncing,
    syncStatus,
    syncError,
    isSupabaseConfigured: configured,
  }
}
