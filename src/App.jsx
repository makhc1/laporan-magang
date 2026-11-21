import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stage from './components/Stage'
import Logbook from './components/Logbook'
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage'
import { useData } from './lib/useData'
import { getAuthSession, logout } from './lib/auth'
import { byDate } from './lib/utils'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scrollToSection = (selector) => {
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
  const { data, api, syncStatus, isSupabaseConfigured } = useData()
  const { memberId, '*': sub = '' } = useParams()
  const navigate = useNavigate()

  const [month, setMonth] = useState(0)
  const [query, setQuery] = useState('')
  const [session, setSession] = useState(getAuthSession)

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

  const members = data.members
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
      if (modalOpen) closeOverlay()
      scrollToSection(selector)
    },
    [closeOverlay, modalOpen],
  )

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalOpen])

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
    document.title = `${member.name} — PKL Squad Arena`
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

  if (!member) return null

  return (
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
            anggota magang melalui dashboard kegiatan. Data tersimpan di browser ini.
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
          isSupabaseConfigured={isSupabaseConfigured}
          onMemberChange={(id) => goMember(id, 'dashboard')}
          onClose={closeOverlay}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
