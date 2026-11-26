import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Tri from './Tri'

const ROSTER_SLOTS = [
  { id: 'ahmad', num: '01', name: 'Ahmad', role: 'Web Dev', aura: '#facc15', threshold: 18 },
  { id: 'abimanyu', num: '02', name: 'Abimanyu', role: 'Network', aura: '#ef4444', threshold: 36 },
  { id: 'rafly', num: '03', name: 'Rafly', role: 'Database', aura: '#38bdf8', threshold: 54 },
  { id: 'fero', num: '04', name: 'Fero', role: 'Analyst', aura: '#10b981', threshold: 72 },
  { id: 'alfi', num: '05', name: 'Alfi', role: 'UI / UX', aura: '#a855f7', threshold: 88 },
]

const ARENA_TIPS = [
  'Gunakan tombol panah kiri/kanan di keyboard untuk berpindah karakter di panggung.',
  'Klik karakter yang sedang aktif atau tombol Respawn FX untuk memutar ulang efek spawn.',
  'Setiap anggota bisa login lewat Dashboard Kegiatan untuk mengisi jurnal dan project harian.',
]

function getStageLabel(progress, isDataReady) {
  if (progress >= 100 && isDataReady) return 'Arena siap // memasuki panggung'
  if (progress >= 78) return 'Menyiapkan logbook & project squad...'
  if (progress >= 45) return 'Memuat profil 5 contestant...'
  return 'Menghubungkan ke database Supabase...'
}

export default function LoadingScreen({ visible, isDataReady, onFinished }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [tipIndex] = useState(() => Math.floor(Date.now() / 5000) % ARENA_TIPS.length)
  const mountTimeRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!visible) return

    if (reduce) {
      if (isDataReady) {
        progressRef.current = 100
        setProgress(100)
        onFinished?.()
      } else {
        progressRef.current = 68
        setProgress(68)
      }
      return
    }

    if (mountTimeRef.current === null) {
      mountTimeRef.current = performance.now()
    }

    const MIN_DURATION = 3200
    const phaseStart = performance.now()
    const startValue = progressRef.current
    const remainingTotal = Math.max(650, MIN_DURATION - (phaseStart - mountTimeRef.current))
    let rafId = 0
    let finishTimer = 0
    let completed = false

    const tick = (now) => {
      if (!isDataReady) {
        // Naik halus bertahap mendekati 88% selama data Supabase masih diambil
        const elapsed = now - mountTimeRef.current
        const target = 88 * (1 - Math.exp(-elapsed / 1500))
        const next = Math.max(progressRef.current, Math.min(88, target))
        progressRef.current = next
        setProgress(next)
        rafId = window.requestAnimationFrame(tick)
        return
      }

      // Data sudah siap: laju bar bertahap ala loading game (ada ritme naik tiap fase) hingga 100%
      const t = Math.min(1, (now - phaseStart) / remainingTotal)
      const smooth = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      const gameRhythm = Math.min(1, Math.max(0, smooth + 0.045 * Math.sin(t * Math.PI * 3) * (1 - t)))
      const next = Math.max(
        progressRef.current,
        Math.min(100, startValue + (100 - startValue) * gameRhythm),
      )
      progressRef.current = next
      setProgress(next)

      if (t >= 1) {
        progressRef.current = 100
        setProgress(100)
        if (!completed) {
          completed = true
          finishTimer = window.setTimeout(() => {
            onFinished?.()
          }, 450)
        }
        return
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      if (finishTimer) window.clearTimeout(finishTimer)
    }
  }, [isDataReady, onFinished, reduce, visible])

  const pct = Math.min(100, Math.round(progress))
  const statusText = getStageLabel(pct, isDataReady)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="game-loading-screen"
          className="fixed inset-0 z-[120] flex flex-col justify-between overflow-hidden bg-canvas text-ink"
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
          transition={reduce ? { duration: 0.1 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-busy={pct < 100}
        >
          {/* Full-bleed 3D Arena Key Art + gerak kamera lambat ala game AAA */}
          <motion.img
            src="/bg/loading-arena.webp"
            alt=""
            width={1376}
            height={768}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
            initial={reduce ? false : { scale: 1.09, opacity: 0.85 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />

          {/* Scrim sinematik terarah: bagian tengah stadion tetap terang & jelas, atas-bawah gelap untuk kontras HUD */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(9, 11, 16, 0.78) 0%, rgba(9, 11, 16, 0.14) 24%, rgba(9, 11, 16, 0.12) 52%, rgba(9, 11, 16, 0.76) 76%, rgba(9, 11, 16, 0.96) 100%), radial-gradient(ellipse at center, transparent 48%, rgba(9, 11, 16, 0.55) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Sudut bingkai kamera broadcast */}
          <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-brand/80" aria-hidden="true" />
          <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r-2 border-t-2 border-brand/80" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-crimson/85" aria-hidden="true" />
          <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-crimson/85" aria-hidden="true" />

          {/* Header HUD atas */}
          <header className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-7">
            <div className="wide flex items-center gap-2.5 text-xs sm:text-[19px]">
              <span className="grid h-8 w-8 shrink-0 place-items-center bg-brand shadow-[0_0_20px_rgba(250,204,21,0.35)] [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)] sm:h-[34px] sm:w-[34px]">
                <Tri size={22} />
              </span>
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                PERKUMPULAN MANUSIA PINTER
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2 border border-white/15 bg-black/55 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-zinc-100 backdrop-blur-sm">
              <span className="dot" aria-hidden="true" />
              <span className="hidden sm:inline">SUPABASE</span>
              <span className="text-brand">SYNC</span>
            </div>
          </header>

          {/* Area tengah dibiarkan lega agar key-art stadion 3D terlihat penuh; HUD judul & slot squad menempel rapi di bawah */}
          <div className="relative z-10 mt-auto w-full">
            <div className="mx-auto w-full max-w-[1280px] px-5 pb-4 sm:px-8 sm:pb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                {/* Judul Map / Arena di kiri bawah (ala loading screen game FPS) */}
                <div>
                  <motion.div
                    initial={reduce ? false : { opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-1.5 inline-flex items-center gap-2 border-l-[3px] border-brand bg-black/55 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-brand backdrop-blur-sm"
                  >
                    Season 2026 // Memasuki Arena
                  </motion.div>

                  <motion.h1
                    initial={reduce ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="disp text-[clamp(36px,5.4vw,72px)] leading-[0.88] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)]"
                  >
                    PERKUMPULAN
                    <span className="block text-brand">MANUSIA PINTER</span>
                  </motion.h1>
                </div>

                {/* Strip kesiapan 5 contestant di kanan bawah */}
                <div className="flex w-full flex-wrap gap-2 sm:grid sm:grid-cols-5 lg:w-auto lg:min-w-[540px]">
                  {ROSTER_SLOTS.map((slot) => {
                    const loaded = pct >= slot.threshold
                    return (
                      <div
                        key={slot.id}
                        className={`min-w-[96px] flex-[1_1_28%] border px-2.5 py-2 text-left backdrop-blur-sm transition-all duration-300 sm:min-w-0 sm:flex-none ${
                          loaded
                            ? 'border-white/25 bg-black/75'
                            : 'border-white/10 bg-black/45 opacity-60'
                        }`}
                        style={{
                          borderTopWidth: '3px',
                          borderTopColor: loaded ? slot.aura : 'rgba(255,255,255,0.16)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-1 font-mono text-[10px] text-zinc-400">
                          <span>{slot.num}</span>
                          <span
                            className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: loaded ? slot.aura : '#52525b',
                              boxShadow: loaded ? `0 0 8px ${slot.aura}` : 'none',
                            }}
                          />
                        </div>
                        <div className="disp mt-0.5 text-base text-white">
                          {slot.name}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          {loaded ? 'READY' : slot.role}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Dock Loading Bar panjang penuh di paling bawah layar */}
            <div className="w-full border-t border-white/15 bg-black/75 backdrop-blur-md">
              <div className="mx-auto w-full max-w-[1280px] px-5 py-4 sm:px-8 sm:py-5">
                <div className="mb-2 flex items-end justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-brand sm:text-xs">
                      {statusText}
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-zinc-300">
                      TIP // {ARENA_TIPS[tipIndex]}
                    </p>
                  </div>

                  <div className="disp shrink-0 text-3xl leading-none text-brand sm:text-4xl">
                    {String(pct).padStart(2, '0')}
                    <span className="ml-0.5 font-mono text-sm font-normal not-italic text-zinc-300">
                      %
                    </span>
                  </div>
                </div>

                {/* Track bar panjang penuh */}
                <div
                  role="progressbar"
                  aria-label="Memuat data arena dari Supabase"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  className="loader-track relative h-3.5 w-full overflow-hidden border border-white/20 bg-zinc-950/90 sm:h-4"
                >
                  <div className="loader-ticks pointer-events-none absolute inset-0" aria-hidden="true" />
                  <div
                    className="loader-fill relative h-full transition-[width] duration-150 ease-out"
                    style={{ width: `${pct}%` }}
                  >
                    {!reduce && (
                      <span
                        className="loader-sheen pointer-events-none absolute inset-0"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="pointer-events-none absolute right-0 top-0 h-full w-2 bg-white shadow-[0_0_16px_#ffffff,0_0_24px_#facc15]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
