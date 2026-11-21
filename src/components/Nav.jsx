import Tri from './Tri'

export default function Nav({
  memberCount,
  session,
  dashboardOpen,
  loginOpen,
  onGo,
  onOpenLogin,
  onOpenDashboard,
  onLogout,
}) {
  const menu = [
    ['#home', '01 // Home Briefing'],
    ['#stage', '02 // Pilih Karakter'],
    ['#logbook', '03 // Logbook & Project'],
  ]

  return (
    <header className="sticky top-0 z-[80] h-16 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1280px] items-center justify-between gap-4 px-5">
        <div className="wide flex items-center gap-2.5 whitespace-nowrap text-[19px]">
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center bg-brand">
            <Tri />
          </span>
          <span className="hidden min-[560px]:inline">THE FINALS // PKL SQUAD</span>
        </div>

        <nav className="hidden gap-1 min-[900px]:flex" aria-label="Navigasi utama">
          {menu.map(([target, label]) => (
            <button
              key={target}
              onClick={() => onGo(target)}
              className="px-3 py-2 font-mono text-xs uppercase tracking-[0.04em] text-muted transition-colors hover:text-brand"
            >
              {label}
              {target === '#stage' ? (
                <>
                  {' ('}
                  <span>{memberCount}</span>
                  {')'}
                </>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <div className="hidden items-center gap-1.5 border border-line bg-panel px-3 py-1.5 font-mono text-xs sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
                <span className="text-white">{session.name}</span>
                <span className="text-[10px] text-muted">
                  ({session.role === 'admin' ? 'Admin' : 'Magang'})
                </span>
              </div>
              <button
                className="btn btn-y px-3 py-2 text-[12px] min-[900px]:px-4 min-[900px]:py-2.5 min-[900px]:text-sm"
                onClick={onOpenDashboard}
              >
                {dashboardOpen ? 'Kembali ke Arena' : 'Dashboard Kegiatan'}
              </button>
              <button
                className="btn btn-g px-3 py-2 text-[12px] min-[900px]:px-4 min-[900px]:py-2.5 min-[900px]:text-sm"
                onClick={onLogout}
                title="Keluar dari akun"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-r px-3 py-2 text-[12px] min-[900px]:px-4 min-[900px]:py-2.5 min-[900px]:text-sm"
                onClick={() => onGo('#stage')}
              >
                Lihat Squad
              </button>
              <button
                className="btn btn-y px-3 py-2 text-[12px] min-[900px]:px-4 min-[900px]:py-2.5 min-[900px]:text-sm"
                onClick={onOpenLogin}
              >
                {loginOpen ? 'Tutup Login' : 'Login Anggota'}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
