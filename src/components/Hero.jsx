import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { pad } from '../lib/utils'

export default function Hero({ data, active, onGo, session, onOpenLogin, onOpenDashboard }) {
  const reduce = useReducedMotion()
  const stats = [
    [data.members.length, 'Total anggota'],
    [data.journals.length, 'Jurnal tercatat'],
    [data.projects.length, 'Featured project'],
    ['2 BLN', 'Periode PKL'],
  ]

  const fade = (delay = 0) =>
    reduce
      ? { initial: false }
      : {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 0.5, delay, ease: [0.33, 1, 0.68, 1] },
        }

  return (
    <section
      id="home"
      className="hero relative flex min-h-[calc(100vh-4rem)] items-center border-b-4 border-crimson py-12"
    >
      <div className="hero-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-[1280px] gap-8 px-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div {...fade(0)}>
            <div className="mb-[22px] inline-block border border-brand/40 bg-brand/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.04em] text-brand">
              Season 2026 // Laporan Praktik Kerja Lapangan
            </div>
          </motion.div>

          <h1 className="disp text-[clamp(44px,7vw,90px)]">
            {[
              ['Satu arena web,', ''],
              ['Lima contestant', 'text-brand'],
              ['Logbook & project berbeda!', 'text-alert'],
            ].map(([line, tone], i) => (
              <motion.span
                key={line}
                className={`block ${tone}`}
                initial={reduce ? false : { y: 80, skewY: 5, opacity: 0 }}
                animate={{ y: 0, skewY: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            {...fade(0.5)}
            className="my-6 mb-7 max-w-[62ch] text-[17px] text-zinc-300"
          >
            Lima anggota, lima divisi kerja. Satu orang membangun website layanan,
            satu menata jaringan LAN, satu mendigitalkan arsip, satu merancang
            dashboard monitoring, dan satu menyusun antarmuka serta dokumentasi.
            Pilih karakter untuk membuka jurnal harian dan hasil kerjanya.
          </motion.p>

          <motion.div {...fade(0.6)} className="mb-8 flex flex-wrap gap-3">
            <button
              className="btn btn-y btn-lg"
              onClick={() => onGo('#stage')}
            >
              Pilih karakter squad // mulai presentasi
            </button>
            <button className="btn btn-g btn-lg" onClick={() => onGo('#logbook')}>
              Langsung lihat jurnal
            </button>
            <button
              className="btn btn-r btn-lg"
              onClick={session ? onOpenDashboard : onOpenLogin}
            >
              {session ? 'Buka Dashboard Saya' : 'Login Anggota Magang'}
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 min-[700px]:grid-cols-4">
            {stats.map(([value, label], i) => (
              <motion.div
                key={label}
                className="border border-line border-t-[3px] border-t-crimson bg-panel/90 px-4 py-3.5"
                initial={reduce ? false : { scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.45,
                  delay: 0.65 + i * 0.08,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <b className="disp block text-[44px] leading-none text-white">
                  {value}
                </b>
                <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="lg:col-span-5"
          initial={reduce ? false : { x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="border border-line bg-panel/90 p-5">
            <h2 className="disp mb-1 flex items-center gap-2.5 text-[26px]">
              <span className="dot" aria-hidden="true" />
              Active roster
            </h2>
            <p className="mb-3.5 font-mono text-xs text-muted">
              Klik anggota untuk membuka panggung karakternya.
            </p>

            {data.members.map((m, i) => {
              const count = data.journals.filter((j) => j.memberId === m.id).length
              return (
                <Link
                  key={m.id}
                  to={`/squad/${encodeURIComponent(m.id)}`}
                  onClick={() => onGo('#stage')}
                  className="mt-2 grid w-full grid-cols-[auto_1fr_auto] items-center gap-3.5 border border-line border-l-4 bg-sub p-3 text-left transition-[background,transform] duration-150 hover:translate-x-1 hover:bg-[#15151a]"
                  style={{ borderLeftColor: m.aura }}
                  aria-current={i === active}
                >
                  <span className="font-mono text-[13px] text-muted">{pad(i + 1)}</span>
                  <span>
                    <span className="disp flex flex-wrap items-center gap-2 text-[22px]">
                      {m.name}
                      <span className="bd font-mono text-[10px] font-normal not-italic tracking-[0.04em]">
                        {m.build} BUILD
                      </span>
                    </span>
                    <span className="block text-[13px] text-muted">{m.division}</span>
                  </span>
                  <span className="whitespace-nowrap text-right font-mono text-xs text-brand">
                    {count} jurnal
                  </span>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
