import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stage from './components/Stage'
import Logbook from './components/Logbook'
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage'
import LoadingScreen from './components/LoadingScreen'
import Tri from './components/Tri'
import { useData } from './lib/useData'
import { getAuthSession, logout, saveSession } from './lib/auth'
import { createSmoothScroller } from './lib/smoothScroll'
import { byDate } from './lib/utils'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fallbackScrollToSection = (selector) => {
  document.querySelector(selector)?.scrollIntoView({
    behavior: prefersReduced() ? 'auto' : 'smooth',
    block: 'start',
  })
}

const squadPath = (id, view = '') => {
  const enc = encodeURIComponent(id)
  if (view === 'dashboard' || view === 'admin') return `/squad/${enc}/dashboard`
  if (view === 'login') return `/squad/${enc}/login`
  return `/squad/${enc}`
}

export default function App({ defaultView = '' }) {
  const { data, api, isLoading, isSyncing, syncStatus, syncError, isSupabaseConfigured } = useData()
  const { memberId, '*': sub = '' } = useParams()
  const navigate = useNavigate()

  const [month, setMonth] = useState(0)
  const [query, setQuery] = useState('')
  const [session, setSession] = useState(getAuthSession)
  const [bootDone, setBootDone] = useState(() => !isLoading)
  const scrollerRef = useRef(null)

  const handleBootFinished = useCallback(() => {
    setBootDone(true)
  }, [])

  const members = data.members

  // Jika koneksi gagal (bukan loading & data kosong), lewati loading screen agar panel error langsung tampil
  const showBootLoader = !bootDone && (isLoading || members.length > 0)

  const normalizedSub = sub.replace(/\/$/, '')
  const dashboardRequested =
    defaultView === 'dashboard' ||
    normalizedSub === 'admin' ||
    normalizedSub === 'dashboard'

  const loginRequested =
    defaultView === 'login' ||
    normalizedSub === 'login' ||
    (dashboardRequested && !session)

  const dashboardOpen = dashboardRequested && Boolean(session)
  const modalOpen = loginRequested || dashboardOpen

  // If user is a member logged in and visited dashboard, default to their own account
  const defaultMember =
    session?.role === 'member'
      ? members.find((m) => m.id === session.memberId) ?? members[0]
      : members.find((m) => m.id === memberId) ?? members[0]

  const member = members.find((m) => m.id === memberId) ?? defaultMember
  const active = Math.max(
    0,
    members.findIndex((m) => m.id === member?.id),
  )

  const journals = useMemo(
    () => data.journals.filter((journal) => journal.memberId === member?.id).sort(byDate),
    [data.journals, member?.id],
  )
  const projects = useMemo(
    () => data.projects.filter((project) => project.memberId === member?.id),
    [data.projects, member?.id],
  )

  // Sinkronkan sesi member dengan data terbaru dari Supabase
  useEffect(() => {
    if (!session || session.role !== 'member' || !members.length) return
    const current = members.find((m) => m.id === session.memberId)
    if (!current) {
      logout()
      setSession(null)
      return
    }
    if (current.name !== session.name) {
      const updated = { ...session, name: current.name }
      saveSession(updated)
      setSession(updated)
    }
  }, [members, session])

  const goMember = useCallback(
    (id, view = '', replace = true) => {
      if (!id) return
      navigate(squadPath(id, view), { replace })
    },
    [navigate],
  )

  const select = useCallback(
    (index) => {
      const n = members.length
      if (!n) return
      const target = members[((index % n) + n) % n].id
      goMember(target, dashboardRequested ? 'dashboard' : '')
    },
    [dashboardRequested, goMember, members],
  )

  const closeOverlay = useCallback(() => {
    document.body.style.overflow = ''
    navigate(squadPath(member?.id || members[0]?.id, ''), { replace: true })
  }, [member?.id, members, navigate])

  const openLogin = useCallback(() => {
    navigate(squadPath(member?.id || members[0]?.id, 'login'), { replace: true })
  }, [member?.id, members, navigate])

  const openDashboard = useCallback(() => {
    if (!session) {
      openLogin()
      return
    }
    const targetId = session.role === 'member' ? session.memberId : member?.id
    navigate(squadPath(targetId || members[0]?.id, 'dashboard'), { replace: true })
  }, [member?.id, members, openLogin, session, navigate])

  const handleLoginSuccess = useCallback(
    (userSession) => {
      setSession(userSession)
      const targetId = userSession.role === 'member' ? userSession.memberId : member?.id
      navigate(squadPath(targetId || members[0]?.id, 'dashboard'), { replace: true })
    },
    [member?.id, members, navigate],
  )

  const handleLogout = useCallback(() => {
    logout()
    setSession(null)
    closeOverlay()
  }, [closeOverlay])

  const go = useCallback(
    (selector) => {
      if (modalOpen) {
        closeOverlay()
        scrollerRef.current?.resume()
        window.requestAnimationFrame(() => {
          if (scrollerRef.current) {
            scrollerRef.current.scrollToTarget(selector)
          } else {
            fallbackScrollToSection(selector)
          }
        })
        return
      }
      if (scrollerRef.current) {
        scrollerRef.current.scrollToTarget(selector)
      } else {
        fallbackScrollToSection(selector)
      }
    },
    [closeOverlay, modalOpen],
  )

  useEffect(() => {
    const scroller = createSmoothScroller({ damping: 9.5, wheelMultiplier: 1 })
    scrollerRef.current = scroller
    return () => {
      scroller.destroy()
      scrollerRef.current = null
    }
  }, [])

  useEffect(() => {
    const scrollLocked = modalOpen || showBootLoader
    document.body.style.overflow = scrollLocked ? 'hidden' : ''
    if (scrollLocked) {
      scrollerRef.current?.pause()
    } else {
      scrollerRef.current?.resume()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen, showBootLoader])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (event) => {
      if (event.key === 'Escape') closeOverlay()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeOverlay, modalOpen])

  useEffect(() => {
    if (modalOpen) return
    const onKey = (event) => {
      const tag = event.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.key === 'ArrowLeft') select(active - 1)
      if (event.key === 'ArrowRight') select(active + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, modalOpen, select])

  useEffect(() => {
    if (!member) return
    document.title = `${member.name} | Perkumpulan Manusia Pinter`
  }, [member])

  // URL normalization & synchronizing
  useEffect(() => {
    if (!member) return
    const validSubs = ['', 'dashboard', 'admin', 'login']
    if (!validSubs.includes(normalizedSub) && !defaultView) {
      navigate(squadPath(member.id, ''), { replace: true })
      return
    }
    if (memberId && member.id !== memberId && !defaultView) {
      const mode = dashboardRequested ? 'dashboard' : loginRequested ? 'login' : ''
      navigate(squadPath(member.id, mode), { replace: true })
    }
  }, [dashboardRequested, defaultView, loginRequested, member, memberId, navigate, normalizedSub])

  const bootOverlay = (
    <LoadingScreen
      visible={showBootLoader}
      isDataReady={!isLoading && members.length > 0}
      onFinished={handleBootFinished}
    />
  )

  return (
    <>
      {bootOverlay}

      {isLoading && !members.length ? null : !member ? (
        <main className="hero relative flex min-h-screen items-center justify-center bg-canvas px-5 py-12">
          <div className="hero-lines pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="panel relative w-full max-w-[640px] border-t-4 border-t-crimson">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-crimson [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]">
                <Tri size={24} variant="onCrimson" />
              </span>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-alert">
                  Supabase // Gangguan Koneksi
                </div>
                <h1 className="disp text-[30px] text-white">Gagal Memuat Database</h1>
              </div>
            </div>

            <div
              className="mb-4 border border-alert/40 bg-alert/10 p-3.5 font-mono text-xs leading-relaxed text-red-200"
              role="alert"
            >
              {syncError || 'Data anggota tidak ditemukan di Supabase.'}
            </div>

            <ol className="mb-5 list-inside list-decimal space-y-1.5 font-mono text-xs text-muted">
              <li>
                Pastikan <strong className="text-zinc-200">VITE_SUPABASE_URL</strong> dan{' '}
                <strong className="text-zinc-200">VITE_SUPABASE_ANON_KEY</strong> sudah benar di file{' '}
                <code className="text-brand">.env</code>.
              </li>
              <li>
                Gunakan <strong className="text-zinc-200">Publishable Key</strong> (
                <code className="text-brand">sb_publishable_...</code>) atau Legacy{' '}
                <strong className="text-zinc-200">Anon Key</strong> (
                <code className="text-brand">eyJ...</code>), bukan Secret Key (
                <code className="text-alert">sb_secret_...</code>).
              </li>
              <li>
                Pastikan skrip <code className="text-brand">supabase/schema.sql</code> sudah dijalankan
                di Supabase SQL Editor.
              </li>
            </ol>

            <button
              className="btn btn-y disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={isSyncing}
              onClick={() => api.refresh()}
            >
              {isSyncing ? 'Menghubungkan...' : 'Coba Hubungkan Ulang'}
            </button>
          </div>
        </main>
      ) : (
        <>
      <Nav
        memberCount={members.length}
        session={session}
        dashboardOpen={dashboardOpen}
        loginOpen={loginRequested}
        onGo={go}
        onOpenLogin={openLogin}
        onOpenDashboard={openDashboard}
        onLogout={handleLogout}
      />

      <main>
        <Hero
          data={data}
          active={active}
          onGo={go}
          session={session}
          onOpenLogin={openLogin}
          onOpenDashboard={openDashboard}
        />
        <Stage members={members} active={active} onActive={select} onGo={go} />
        <Logbook
          member={member}
          activeIndex={active}
          journals={journals}
          projects={projects}
          month={month}
          onMonth={setMonth}
          query={query}
          onQuery={setQuery}
          session={session}
          onOpenDashboard={openDashboard}
          onOpenLogin={openLogin}
        />
      </main>

      <footer className="border-t border-line py-7 font-mono text-xs text-muted">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5">
          <div className="max-w-[70ch]">
            Isi jurnal dan project di halaman ini dikelola secara mandiri oleh setiap
            anggota magang melalui dashboard kegiatan. Data tersimpan secara real-time di
            Supabase.
          </div>
          <div className="flex gap-3">
            {session ? (
              <button className="text-brand hover:underline" onClick={openDashboard}>
                Buka Dashboard
              </button>
            ) : (
              <button className="text-brand hover:underline" onClick={openLogin}>
                Login Anggota Magang
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Overlay: Login Page */}
      {loginRequested && (
        <LoginPage
          members={members}
          onSuccess={handleLoginSuccess}
          onCancel={closeOverlay}
        />
      )}

      {/* Overlay: Member & Admin Dashboard */}
      {dashboardOpen && (
        <Dashboard
          session={session}
          data={data}
          api={api}
          memberId={member.id}
          syncStatus={syncStatus}
          syncError={syncError}
          isSyncing={isSyncing}
          isSupabaseConfigured={isSupabaseConfigured}
          onMemberChange={(id) => goMember(id, 'dashboard')}
          onClose={closeOverlay}
          onLogout={handleLogout}
        />
      )}
        </>
      )}
    </>
  )
}
