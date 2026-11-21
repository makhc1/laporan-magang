import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Mockup from './Mockup'
import Photo from './Photo'
import { STATUS_COLORS, fmtDate, pad } from '../lib/utils'

function JournalItem({ journal, index }) {
  const [open, setOpen] = useState(index === 0)
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="jr"
      initial={reduce ? false : { y: 36, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.05, ease: [0.33, 1, 0.68, 1] }}
    >
      <button
        className="flex w-full items-start justify-between gap-3.5 px-4 py-3.5 text-left"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>
          <span className="block font-mono text-xs text-brand">
            {fmtDate(journal.date)}
          </span>
          <span className="wide mt-1 block text-[22px] normal-case leading-[1.1] tracking-normal text-white">
            {journal.title}
          </span>
          <span className="mt-2 flex flex-wrap gap-1.5">
            <span className="tag tag-m">
              {journal.month ? `BULAN ${journal.month}` : 'LUAR PERIODE'}
            </span>
            <span className="tag">{journal.category}</span>
          </span>
        </span>
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center font-mono text-brand transition-transform duration-200 ${
            open ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        >
          &gt;
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 leading-relaxed text-zinc-300">
              <p>{journal.desc}</p>
              {journal.photo && journal.photo !== 'none' ? (
                <div className="mt-3.5 max-w-[420px] border border-line">
                  <Photo kind={journal.photo} />
                </div>
              ) : null}
              <span
                className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs"
                style={{ color: STATUS_COLORS[journal.status] || '#a1a1aa' }}
              >
                <span
                  className="h-2 w-2"
                  style={{ background: 'currentColor' }}
                  aria-hidden="true"
                />
                Status: {journal.status}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

function ProjectCard({ project, index }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="mb-[18px] overflow-hidden border border-line bg-panel/90"
      initial={reduce ? false : { y: 36, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.05, ease: [0.33, 1, 0.68, 1] }}
    >
      <div className="border-b border-line bg-[#0c0e14]">
        <Mockup kind={project.mock} />
      </div>
      <div className="p-4">
        <span className="inline-block bg-brand px-2 py-[3px] font-mono text-xs font-semibold text-black">
          {project.metric}
        </span>
        <h3 className="disp mb-2 mt-0.5 text-[26px] text-white">{project.title}</h3>
        <p className="text-[15px] leading-relaxed text-zinc-300">{project.desc}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export default function Logbook({
  member,
  activeIndex,
  journals,
  projects,
  month,
  onMonth,
  query,
  onQuery,
  session,
  onOpenDashboard,
  onOpenLogin,
}) {
  const q = query.trim().toLowerCase()
  const list = journals.filter((journal) => {
    if (month && journal.month !== month) return false
    if (!q) return true
    return `${journal.title} ${journal.desc} ${journal.category}`
      .toLowerCase()
      .includes(q)
  })

  const periods = ['Semua bulan', 'Bulan 1', 'Bulan 2', 'Bulan 3']

  return (
    <section id="logbook" className="bg-canvas py-14 pb-20">
      <div className="mx-auto w-full max-w-[1280px] px-5">
        <div
          className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b-4 border-crimson pb-5"
          style={{ '--c': member.aura }}
        >
          <div>
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.05em] text-muted">
              Contestant {pad(activeIndex + 1)} // {member.role} // {member.division}
            </div>
            <h2 className="disp text-[clamp(34px,6vw,68px)] text-white">
              Logbook &amp; project:{' '}
              <em className="italic" style={{ color: 'var(--c)' }}>
                {member.name}
              </em>
            </h2>
          </div>

          <div
            className="grid grid-cols-2 gap-2 min-[700px]:flex min-[700px]:flex-wrap"
            role="group"
            aria-label="Filter periode"
          >
            {periods.map((label, value) => (
              <button
                key={label}
                className={`chip ${month === value ? 'chip-on' : ''}`}
                onClick={() => onMonth(value)}
                aria-pressed={month === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Quick Action ke Dashboard */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-line bg-panel p-3.5 font-mono text-xs">
          {session?.memberId === member.id ? (
            <>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span>Kamu sedang melihat logbook publik milikmu ({member.name}).</span>
              </div>
              <button className="btn btn-y text-xs py-1.5 px-3" onClick={onOpenDashboard}>
                + Tambah / Ganti Isi Kegiatan di Dashboard →
              </button>
            </>
          ) : session?.role === 'admin' ? (
            <>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-crimson" />
                <span>Super Admin: Kelola kegiatan dan project milik {member.name}.</span>
              </div>
              <button className="btn btn-y text-xs py-1.5 px-3" onClick={onOpenDashboard}>
                Buka Dashboard Admin →
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-muted">
                <span>Anggota magang? Masuk ke dashboard untuk menambah dan mengganti isi kegiatanmu.</span>
              </div>
              <button className="btn btn-y text-xs py-1.5 px-3" onClick={onOpenLogin}>
                Login Anggota Magang →
              </button>
            </>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="sub disp">Logbook harian</h3>
            <input
              className="mb-5 w-full border border-line bg-sub px-3.5 py-3 font-mono text-sm text-ink focus:border-brand focus:outline-none"
              type="search"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Cari kegiatan..."
              aria-label="Cari kegiatan"
            />
            <div className="tl">
              {list.length ? (
                list.map((journal, index) => (
                  <JournalItem key={journal.id} journal={journal} index={index} />
                ))
              ) : (
                <div className="border border-dashed border-line p-7 text-center font-mono text-[13px] text-muted">
                  Belum ada jurnal untuk filter ini.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="sub disp">Featured project</h3>
            {projects.length ? (
              projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            ) : (
              <div className="border border-dashed border-line p-7 text-center font-mono text-[13px] text-muted">
                Belum ada project untuk contestant ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
