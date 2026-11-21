import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import Avatar from './Avatar'
import Tri from './Tri'
import { pad } from '../lib/utils'

export default function Stage({ members, active, onActive, onGo }) {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(1200)
  const reduce = useReducedMotion()
  const spot = useAnimationControls()
  const first = useRef(true)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduce) return
    spot.start({
      opacity: [0.12, 0.4, 0.2, 0.34],
      transition: { duration: 0.5, times: [0, 0.25, 0.55, 1] },
    })
  }, [active, reduce, spot])

  const member = members[active] ?? members[0]
  const n = members.length
  const half = Math.floor(n / 2)
  const small = width < 700
  const step = small ? 0.26 : 0.21

  return (
    <section
      id="stage"
      className="border-b-4 border-brand bg-canvas"
      aria-label="Pilih karakter"
    >
      <div
        ref={boxRef}
        className="stage relative min-h-[740px] overflow-hidden max-[700px]:min-h-[660px]"
        style={{ '--aura': member.aura }}
      >
        <div className="stripes pointer-events-none absolute inset-0" aria-hidden="true" />
        <motion.div
          className="spot pointer-events-none absolute left-1/2 top-0 z-[5] h-full w-[min(620px,100%)] -translate-x-1/2"
          style={{ opacity: 0.34 }}
          animate={spot}
          aria-hidden="true"
        />
        <div
          className="floor pointer-events-none absolute bottom-1.5 left-1/2 z-[6] h-[140px] w-[min(680px,90%)] -translate-x-1/2 opacity-55"
          aria-hidden="true"
        />

        <div className="relative z-[60] flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent px-5 py-4">
          <h2 className="disp flex items-center gap-3 text-[clamp(24px,4vw,36px)] text-white">
            <span className="grid h-[30px] w-[30px] place-items-center bg-brand">
              <Tri size={16} />
            </span>
            Select contestant
          </h2>
          <div className="font-mono text-xs uppercase tracking-[0.05em] text-brand">
            {`CONTESTANT ${pad(active + 1)} // ${member.name.toUpperCase()}`}
          </div>
          <button className="btn btn-g" onClick={() => onGo('#home')}>
            ↑ Kembali ke atas
          </button>
        </div>

        <div className="absolute inset-0 z-10">
          {members.map((m, i) => {
            const offset = ((i - active + n + half) % n) - half
            const distance = Math.abs(offset)
            const scale = small
              ? [1, 0.78, 0.62, 0.5, 0.45, 0.4][distance]
              : [1.15, 0.88, 0.72, 0.62, 0.56, 0.5][Math.min(distance, 5)]
            const x = offset * width * step
            const y = distance ? -24 : 0

            return (
              <div
                key={m.id}
                className="absolute bottom-[22px] left-1/2 -translate-x-1/2 max-[700px]:bottom-[104px]"
                style={{ zIndex: 40 - distance * 8 }}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-label={`Pilih ${m.name}`}
                  aria-pressed={i === active}
                  onClick={() => i !== active && onActive(i)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onActive(i)
                    }
                  }}
                  className="origin-bottom cursor-pointer"
                  animate={{
                    x,
                    y,
                    scale,
                    filter: distance ? 'brightness(.7)' : 'brightness(1)',
                  }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.85, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <div
                    className={`badge wide absolute left-1/2 top-[-14px] -translate-x-1/2 -translate-y-full whitespace-nowrap bg-brand px-4 pb-4 pt-[7px] text-[22px] text-black transition-opacity duration-300 max-[700px]:px-3 max-[700px]:pb-[13px] max-[700px]:pt-[5px] max-[700px]:text-base ${
                      i === active ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden={i !== active}
                  >
                    {m.name}
                  </div>
                  <Avatar
                    member={m}
                    className={`block h-[500px] w-auto overflow-visible drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)] max-[700px]:h-[330px] ${
                      i === active ? 'breathe' : ''
                    }`}
                  />
                </motion.div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-1/2 z-50 flex w-[min(680px,94%)] -translate-x-1/2 flex-col gap-2.5 pb-[18px]">
          <div className="grid grid-cols-2 items-center gap-3 border border-line bg-[rgba(26,13,18,.85)] p-3.5 backdrop-blur-md min-[700px]:grid-cols-[auto_1fr_auto]">
            <div
              className="order-1 col-span-2 min-[700px]:order-2 min-[700px]:col-span-1"
              aria-live="polite"
            >
              <div className="disp text-2xl text-white">
                <small className="mr-2 font-mono text-[11px] font-normal not-italic tracking-[0.05em] text-brand">
                  {member.build} BUILD //
                </small>
                {member.name}
              </div>
              <div className="my-0.5 mb-1 font-mono text-xs text-brand">
                {member.role} — {member.division}
              </div>
              <div className="text-sm leading-snug text-zinc-300">{member.bio}</div>
            </div>
            <button
              className="arr order-2 min-[700px]:order-1"
              onClick={() => onActive(active - 1)}
              aria-label="Karakter sebelumnya"
            >
              &lt;
            </button>
            <button
              className="arr order-3"
              onClick={() => onActive(active + 1)}
              aria-label="Karakter berikutnya"
            >
              &gt;
            </button>
          </div>

          <div id="pager" className="flex justify-center gap-1.5">
            {members.map((m, i) => (
              <span
                key={m.id}
                className={`h-1 w-[26px] transition-colors duration-300 ${
                  i === active ? 'bg-brand' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <button className="btn btn-y btn-lg" onClick={() => onGo('#logbook')}>
            <Tri size={18} />
            {`Select // buka logbook ${member.name}`}
          </button>
        </div>
      </div>
    </section>
  )
}
