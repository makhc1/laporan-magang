import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from 'motion/react'
import Avatar, { getMemberStature } from './Avatar'
import { CharacterScanOverlay, StageFloorVfx } from './SpawnVfx'
import Tri from './Tri'
import { pad } from '../lib/utils'

export default function Stage({ members, active, onActive, onGo }) {
  const boxRef = useRef(null)
  const [width, setWidth] = useState(1200)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [spawnTick, setSpawnTick] = useState(0)
  const [memberSpawns, setMemberSpawns] = useState({})
  const reduce = useReducedMotion()
  const spot = useAnimationControls()
  const stageInView = useInView(boxRef, { once: true, amount: 0.18 })
  const prevActive = useRef(active)
  const spawnedInitial = useRef(false)

  const activeMemberId = (members[active] ?? members[0])?.id

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Jalankan spotlight slam + spawn burst saat stage masuk layar pertama kali
  useEffect(() => {
    if (!stageInView) return
    if (!spawnedInitial.current) {
      spawnedInitial.current = true
      setSpawnTick((t) => t + 1)
    }
  }, [stageInView])

  // Jalankan spawn burst khusus karakter baru setiap kali ganti contestant aktif
  useEffect(() => {
    if (prevActive.current === active) return
    prevActive.current = active
    setSpawnTick((t) => t + 1)
    if (activeMemberId) {
      setMemberSpawns((prev) => ({
        ...prev,
        [activeMemberId]: (prev[activeMemberId] || 0) + 1,
      }))
    }
  }, [active, activeMemberId])

  // Animasi spotlight slam sinkron dengan spawnTick
  useEffect(() => {
    if (!spawnTick || reduce) return
    spot.start({
      opacity: [0.06, 0.82, 0.3, 0.38],
      scaleX: [0.25, 1.24, 0.95, 1],
      transition: { duration: 0.82, times: [0, 0.22, 0.64, 1], ease: [0.16, 1, 0.3, 1] },
    })
  }, [spawnTick, reduce, spot])

  const triggerRespawn = () => {
    if (reduce) return
    setSpawnTick((t) => t + 1)
    if (activeMemberId) {
      setMemberSpawns((prev) => ({
        ...prev,
        [activeMemberId]: (prev[activeMemberId] || 0) + 1,
      }))
    }
  }

  const handlePointerMove = (event) => {
    if (reduce || width < 700) return
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({
      ry: Math.max(-10, Math.min(10, nx * 18)),
      rx: Math.max(-4, Math.min(4, -ny * 8)),
    })
  }

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 })
  }

  const member = members[active] ?? members[0]
  const n = members.length
  const half = Math.floor(n / 2)
  const small = width < 700
  const step = small ? 0.28 : 0.21
  const baseHeight = small ? 296 : 435
  const ready = reduce || stageInView

  return (
    <section
      id="stage"
      className="border-b-4 border-brand bg-canvas"
      aria-label="Pilih karakter"
    >
      <div
        ref={boxRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="stage relative min-h-[850px] overflow-hidden max-[700px]:min-h-[770px]"
        style={{ '--aura': member.aura }}
      >
        <div className="stripes pointer-events-none absolute inset-0" aria-hidden="true" />
        <motion.div
          className="spot pointer-events-none absolute left-1/2 top-0 z-[5] h-full w-[min(640px,100%)] -translate-x-1/2 origin-top"
          style={{ opacity: 0.36 }}
          animate={spot}
          aria-hidden="true"
        />
        <div
          className="floor pointer-events-none absolute bottom-[140px] left-1/2 z-[6] h-[120px] w-[min(680px,90%)] -translate-x-1/2 opacity-65 max-[700px]:bottom-[215px]"
          aria-hidden="true"
        />

        {/* Pad teleport 3D, pilar cahaya spawn, shockwave, dan pecahan energi */}
        {ready && (
          <StageFloorVfx
            spawnKey={`${member.id}-${spawnTick}`}
            aura={member.aura}
            small={small}
            reduce={reduce}
          />
        )}

        <div className="relative z-[60] flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent px-5 py-4">
          <h2 className="disp flex items-center gap-3 text-[clamp(24px,4vw,36px)] text-white">
            <span className="grid h-[32px] w-[32px] place-items-center bg-brand [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]">
              <Tri size={22} />
            </span>
            Select contestant
          </h2>
          <div className="font-mono text-xs uppercase tracking-[0.05em] text-brand">
            {`CONTESTANT ${pad(active + 1)} // ${member.name.toUpperCase()}`}
          </div>
          <div className="flex items-center gap-2">
            {!reduce && (
              <button
                className="btn btn-g whitespace-nowrap max-[700px]:px-3 max-[700px]:py-2 max-[700px]:text-xs"
                type="button"
                onClick={triggerRespawn}
                title="Putar ulang efek spawn karakter"
              >
                ↻ Respawn FX
              </button>
            )}
            <button
              className="btn btn-g whitespace-nowrap max-[700px]:px-3 max-[700px]:py-2 max-[700px]:text-xs"
              type="button"
              onClick={() => onGo('#home')}
            >
              ↑ Kembali ke atas
            </button>
          </div>
        </div>

        <div className="absolute inset-0 z-10 [perspective:1100px]">
          {members.map((m, i) => {
            const offset = ((i - active + n + half) % n) - half
            const distance = Math.abs(offset)
            const isActive = i === active
            const scale = small
              ? [1, 0.78, 0.62, 0.5, 0.45, 0.4][Math.min(distance, 5)]
              : [1.08, 0.85, 0.7, 0.61, 0.55, 0.5][Math.min(distance, 5)]
            const x = offset * width * step
            const y = distance ? -22 : 0
            const stature = getMemberStature(m)
            const avatarHeight = Math.round(baseHeight * stature)
            const entranceDelay = distance * 0.1
            const memberSpawnCount = memberSpawns[m.id] || 0
            const animDelay = memberSpawnCount > 0 ? 0.02 : entranceDelay

            return (
              <div
                key={m.id}
                className="absolute bottom-[198px] left-1/2 -translate-x-1/2 max-[700px]:bottom-[272px]"
                style={{ zIndex: 40 - distance * 8 }}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-label={isActive ? `${m.name} (klik untuk putar efek spawn)` : `Pilih ${m.name}`}
                  aria-pressed={isActive}
                  onClick={() => (isActive ? triggerRespawn() : onActive(i))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      if (isActive) {
                        triggerRespawn()
                      } else {
                        onActive(i)
                      }
                    }
                  }}
                  className="origin-bottom cursor-pointer [transform-style:preserve-3d]"
                  animate={{
                    x,
                    y,
                    scale,
                    rotateY: isActive ? tilt.ry : offset * -8,
                    rotateX: isActive ? tilt.rx : 0,
                    filter: distance ? 'brightness(.62) saturate(.88)' : 'brightness(1) saturate(1.04)',
                  }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  {/* Nameplate kuning dengan glitch-snap setiap karakter aktif lock-in */}
                  <motion.div
                    key={isActive ? `badge-${m.id}-${spawnTick}` : `badge-${m.id}`}
                    className={`badge wide absolute left-1/2 top-[-12px] z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap bg-brand px-4 pb-4 pt-[7px] text-[22px] text-black max-[700px]:px-3 max-[700px]:pb-[13px] max-[700px]:pt-[5px] max-[700px]:text-base ${
                      isActive ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                    initial={
                      reduce || !isActive
                        ? false
                        : { opacity: 0, y: -16, scale: 0.84, skewX: -16 }
                    }
                    animate={
                      isActive
                        ? { opacity: ready ? 1 : 0, y: 0, scale: 1, skewX: 0 }
                        : { opacity: 0, y: -6, scale: 0.92, skewX: 0 }
                    }
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            duration: 0.36,
                            delay: isActive ? 0.14 : 0,
                            ease: [0.16, 1, 0.3, 1],
                          }
                    }
                    aria-hidden={!isActive}
                  >
                    {m.name}
                  </motion.div>

                  {/* Wrapper materialisasi & landing punch (hanya re-key pada karakter yang sedang spawn) */}
                  <div className="relative">
                    {/* Garis scan holografik bebas clip agar bloom laser menyapu tepat di garis materialisasi */}
                    {ready && (
                      <CharacterScanOverlay
                        scanKey={`scan-${m.id}-${memberSpawnCount}`}
                        aura={m.aura}
                        delay={animDelay}
                        reduce={reduce}
                      />
                    )}

                    <motion.div
                      key={`spawn-${m.id}-${memberSpawnCount}`}
                      className="relative origin-bottom"
                      initial={
                        reduce
                          ? false
                          : {
                              opacity: 0,
                              y: isActive ? -52 : -58,
                              scaleY: 1.09,
                              scaleX: 0.92,
                              clipPath: 'inset(100% -25% -8% -25%)',
                              filter: 'brightness(2.5) contrast(1.25)',
                            }
                      }
                      animate={
                        ready
                          ? {
                              opacity: 1,
                              y: 0,
                              scaleY: [1.08, 0.955, 1.015, 1],
                              scaleX: [0.93, 1.04, 0.99, 1],
                              clipPath: 'inset(-8% -25% -8% -25%)',
                              filter: 'brightness(1) contrast(1)',
                            }
                          : {
                              opacity: 0,
                              y: -58,
                              clipPath: 'inset(100% -25% -8% -25%)',
                            }
                      }
                      transition={
                        reduce
                          ? { duration: 0 }
                          : {
                              duration: 0.64,
                              delay: animDelay,
                              ease: [0.16, 1, 0.3, 1],
                              scaleY: {
                                duration: 0.72,
                                delay: animDelay,
                                times: [0, 0.5, 0.78, 1],
                              },
                              scaleX: {
                                duration: 0.72,
                                delay: animDelay,
                                times: [0, 0.5, 0.78, 1],
                              },
                            }
                      }
                    >
                      <div
                        style={{ height: `${avatarHeight}px` }}
                        className={`flex items-end justify-center ${isActive ? 'breathe' : ''}`}
                      >
                        <Avatar
                          member={m}
                          active={isActive}
                          className="h-full w-auto overflow-visible"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-1/2 z-50 flex w-[min(680px,94%)] -translate-x-1/2 flex-col gap-2.5 pb-[18px]">
          <div className="relative grid grid-cols-2 items-center gap-3 overflow-hidden border border-line bg-[rgba(26,13,18,.85)] p-3.5 backdrop-blur-md min-[700px]:grid-cols-[auto_1fr_auto]">
            {/* Garis aksen HUD menyapu di tepi atas kartu info saat karakter lock-in */}
            {!reduce && (
              <motion.span
                key={`hud-bar-${member.id}-${spawnTick}`}
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left"
                style={{
                  background: `linear-gradient(90deg, ${member.aura}, #facc15 65%, transparent)`,
                  boxShadow: `0 0 12px ${member.aura}`,
                }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: [1, 0.9, 0.55] }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              />
            )}

            <div
              className="order-1 col-span-2 min-[700px]:order-2 min-[700px]:col-span-1"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={member.id}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -12 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="disp text-2xl text-white">
                    <small className="mr-2 font-mono text-[11px] font-normal not-italic tracking-[0.05em] text-brand">
                      {member.build} BUILD //
                    </small>
                    {member.name}
                  </div>
                  <div className="my-0.5 mb-1 font-mono text-xs text-brand">
                    {member.role} · {member.division}
                  </div>
                  <div className="text-sm leading-snug text-zinc-300">{member.bio}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              className="arr order-2 min-[700px]:order-1"
              type="button"
              onClick={() => onActive(active - 1)}
              aria-label="Karakter sebelumnya"
            >
              &lt;
            </button>
            <button
              className="arr order-3"
              type="button"
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

          <button className="btn btn-y btn-lg" type="button" onClick={() => onGo('#logbook')}>
            <Tri size={22} />
            {`Select // buka logbook ${member.name}`}
          </button>
        </div>
      </div>
    </section>
  )
}
