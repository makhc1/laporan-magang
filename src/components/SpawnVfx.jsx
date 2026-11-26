import { AnimatePresence, motion } from 'motion/react'

// Partikel geometris deterministik (pecahan segitiga, diamond, dan garis energi ala THE FINALS)
const SPAWN_SHARDS = [
  { id: 0, x0: -102, dx: -195, dy: -290, size: 11, h: 11, shape: 'tri', tone: 'brand', delay: 0.02, dur: 1.05, rot: 210 },
  { id: 1, x0: -76, dx: -132, dy: -420, size: 4, h: 54, shape: 'streak', tone: 'white', delay: 0.0, dur: 0.78, rot: 0 },
  { id: 2, x0: -56, dx: -104, dy: -465, size: 10, h: 10, shape: 'diamond', tone: 'aura', delay: 0.05, dur: 1.12, rot: -220 },
  { id: 3, x0: -32, dx: -60, dy: -365, size: 9, h: 9, shape: 'tri', tone: 'white', delay: 0.08, dur: 1.02, rot: 260 },
  { id: 4, x0: -16, dx: -30, dy: -495, size: 4, h: 64, shape: 'streak', tone: 'brand', delay: 0.01, dur: 0.74, rot: 0 },
  { id: 5, x0: 16, dx: 34, dy: -480, size: 4, h: 60, shape: 'streak', tone: 'white', delay: 0.03, dur: 0.76, rot: 0 },
  { id: 6, x0: 36, dx: 70, dy: -390, size: 12, h: 12, shape: 'tri', tone: 'brand', delay: 0.06, dur: 1.1, rot: -195 },
  { id: 7, x0: 58, dx: 112, dy: -445, size: 9, h: 9, shape: 'diamond', tone: 'aura', delay: 0.04, dur: 1.04, rot: 240 },
  { id: 8, x0: 82, dx: 150, dy: -335, size: 4, h: 48, shape: 'streak', tone: 'aura', delay: 0.02, dur: 0.82, rot: 0 },
  { id: 9, x0: 106, dx: 198, dy: -275, size: 11, h: 11, shape: 'tri', tone: 'brand', delay: 0.07, dur: 1.08, rot: 230 },
  { id: 10, x0: -120, dx: -215, dy: -210, size: 8, h: 8, shape: 'square', tone: 'white', delay: 0.1, dur: 0.96, rot: 170 },
  { id: 11, x0: -44, dx: -86, dy: -260, size: 12, h: 12, shape: 'diamond', tone: 'brand', delay: 0.12, dur: 1.16, rot: -260 },
  { id: 12, x0: 4, dx: -12, dy: -425, size: 8, h: 8, shape: 'square', tone: 'white', delay: 0.09, dur: 1.08, rot: 215 },
  { id: 13, x0: 48, dx: 92, dy: -250, size: 12, h: 12, shape: 'diamond', tone: 'aura', delay: 0.11, dur: 1.14, rot: 235 },
  { id: 14, x0: 122, dx: 218, dy: -205, size: 8, h: 8, shape: 'square', tone: 'brand', delay: 0.09, dur: 0.98, rot: -185 },
  { id: 15, x0: -88, dx: -150, dy: -475, size: 9, h: 9, shape: 'tri', tone: 'white', delay: 0.08, dur: 1.18, rot: 290 },
  { id: 16, x0: 74, dx: 142, dy: -468, size: 9, h: 9, shape: 'tri', tone: 'brand', delay: 0.05, dur: 1.15, rot: -275 },
  { id: 17, x0: -4, dx: 22, dy: -325, size: 4, h: 44, shape: 'streak', tone: 'aura', delay: 0.07, dur: 0.84, rot: 0 },
  { id: 18, x0: -64, dx: -116, dy: -165, size: 7, h: 7, shape: 'diamond', tone: 'white', delay: 0.14, dur: 0.94, rot: 180 },
  { id: 19, x0: 68, dx: 124, dy: -170, size: 7, h: 7, shape: 'diamond', tone: 'brand', delay: 0.14, dur: 0.96, rot: -180 },
  { id: 20, x0: -22, dx: -52, dy: -515, size: 7, h: 7, shape: 'tri', tone: 'aura', delay: 0.11, dur: 1.22, rot: 310 },
  { id: 21, x0: 26, dx: 58, dy: -505, size: 7, h: 7, shape: 'tri', tone: 'white', delay: 0.13, dur: 1.2, rot: -300 },
]

// Bara data ambien halus yang naik pelan dari pad lantai karakter aktif
const AMBIENT_MOTES = [
  { id: 'a1', left: '-102px', size: 6, delay: 0, dur: 2.7, tone: 'brand' },
  { id: 'a2', left: '-52px', size: 5, delay: 0.8, dur: 3.1, tone: 'white' },
  { id: 'a3', left: '8px', size: 5, delay: 1.5, dur: 2.5, tone: 'aura' },
  { id: 'a4', left: '58px', size: 6, delay: 0.4, dur: 2.9, tone: 'brand' },
  { id: 'a5', left: '108px', size: 5, delay: 1.2, dur: 2.8, tone: 'white' },
  { id: 'a6', left: '-18px', size: 4, delay: 2.0, dur: 2.6, tone: 'aura' },
]

function toneColor(tone, aura) {
  if (tone === 'brand') return '#facc15'
  if (tone === 'white') return '#ffffff'
  return aura || '#facc15'
}

function shapeClip(shape) {
  if (shape === 'diamond') return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
  if (shape === 'tri') return 'polygon(50% 0%, 100% 100%, 0% 100%)'
  return undefined
}

/**
 * Efek pad teleport lantai 3D, pilar cahaya spawn, shockwave ring, dan pecahan partikel
 * yang muncul di tengah panggung setiap karakter masuk / ganti contestant.
 */
export function StageFloorVfx({ spawnKey, aura, small, reduce }) {
  const spread = small ? 0.62 : 1
  const padSize = small ? 240 : 350

  return (
    <>
      {/* Pad hologram lantai permanen tepat di bawah sepatu karakter aktif */}
      <div
        className="pointer-events-none absolute bottom-[198px] left-1/2 z-[7] -translate-x-1/2 translate-y-1/2 max-[700px]:bottom-[272px]"
        style={{ width: padSize, height: padSize }}
        aria-hidden="true"
      >
        <div
          className="spawn-pad-plane relative h-full w-full"
          style={{ '--aura': aura }}
        >
          {/* Ring luar bersegmen yang berputar halus */}
          <svg
            viewBox="0 0 240 240"
            className={`h-full w-full ${reduce ? '' : 'spawn-reticle-spin'}`}
            fill="none"
          >
            <circle
              cx="120"
              cy="120"
              r="110"
              stroke={aura}
              strokeOpacity="0.62"
              strokeWidth="3"
              strokeDasharray="44 16 12 16"
            />
            <circle
              cx="120"
              cy="120"
              r="94"
              stroke="#ffffff"
              strokeOpacity="0.34"
              strokeWidth="1.5"
              strokeDasharray="6 10"
            />
            <circle
              cx="120"
              cy="120"
              r="74"
              stroke="#facc15"
              strokeOpacity="0.52"
              strokeWidth="2"
              strokeDasharray="24 28"
            />
          </svg>
        </div>
      </div>

      {/* Partikel ambien naik pelan dari lantai (nonaktif saat reduced motion) */}
      {!reduce && (
        <div
          className="pointer-events-none absolute bottom-[204px] left-1/2 z-[18] -translate-x-1/2 max-[700px]:bottom-[276px]"
          aria-hidden="true"
        >
          {AMBIENT_MOTES.map((m) => (
            <span
              key={m.id}
              className="spawn-ambient-mote absolute bottom-0 block"
              style={{
                left: `calc(${m.left} * ${spread})`,
                width: m.size,
                height: m.size,
                backgroundColor: toneColor(m.tone, aura),
                boxShadow: `0 0 10px ${toneColor(m.tone, aura)}`,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.dur}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Burst VFX setiap kali spawn / ganti karakter */}
      {!reduce && (
        <AnimatePresence>
          <motion.div
            key={spawnKey}
            className="pointer-events-none absolute inset-0 z-[26] overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            aria-hidden="true"
          >
            {/* Pilar cahaya teleport vertikal turun dari langit-langit ke pad lantai */}
            <motion.div
              className="spawn-beam absolute bottom-[198px] left-1/2 top-0 w-[290px] -translate-x-1/2 origin-bottom max-[700px]:bottom-[272px] max-[700px]:w-[190px]"
              style={{ '--aura': aura }}
              initial={{ scaleX: 0.14, opacity: 0 }}
              animate={{
                scaleX: [0.14, 1.38, 0.72, 0.06],
                opacity: [0, 1, 0.72, 0],
              }}
              transition={{ duration: 0.95, times: [0, 0.18, 0.58, 1], ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Inti laser putih-emas tajam di tengah pilar */}
            <motion.div
              className="absolute bottom-[198px] left-1/2 top-0 w-[26px] -translate-x-1/2 origin-bottom mix-blend-screen max-[700px]:bottom-[272px]"
              style={{
                background: `linear-gradient(180deg, transparent 0%, #ffffff 32%, #facc15 74%, #ffffff 100%)`,
                filter: 'blur(3px)',
              }}
              initial={{ scaleX: 2.4, opacity: 1 }}
              animate={{ scaleX: [2.4, 1.05, 0.05], opacity: [1, 0.75, 0] }}
              transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Dua garis batas hologram vertikal di kiri-kanan siluet karakter */}
            {[-1, 1].map((side) => (
              <motion.div
                key={side}
                className="absolute bottom-[198px] left-1/2 top-[110px] w-[2px] origin-bottom max-[700px]:bottom-[272px]"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, #facc15 35%, ${aura} 75%, transparent 100%)`,
                  boxShadow: `0 0 12px #facc15`,
                }}
                initial={{ x: side * 24 * spread, opacity: 0, scaleY: 0.25 }}
                animate={{
                  x: [side * 24 * spread, side * 124 * spread, side * 150 * spread],
                  opacity: [0, 0.95, 0],
                  scaleY: [0.25, 1, 0.65],
                }}
                transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}

            {/* Shockwave rings & ground flash di pad lantai (perspektif 3D) */}
            <div
              className="absolute bottom-[198px] left-1/2 -translate-x-1/2 translate-y-1/2 max-[700px]:bottom-[272px]"
              style={{ width: padSize, height: padSize }}
            >
              <div className="spawn-pad-plane relative h-full w-full">
                {/* Kilatan dampak lantai putih-emas-aura */}
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{
                    background: `radial-gradient(circle, #ffffff 0%, #facc15 28%, ${aura} 55%, transparent 76%)`,
                  }}
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: [0.2, 1.48, 1.15], opacity: [1, 0.75, 0] }}
                  transition={{ duration: 0.76, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Gelombang kejut ring pertama (putih + glow aura) */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '5px solid #ffffff',
                    boxShadow: `0 0 32px ${aura}, 0 0 14px #ffffff, inset 0 0 22px ${aura}`,
                  }}
                  initial={{ scale: 0.22, opacity: 1 }}
                  animate={{ scale: 2.05, opacity: [1, 0.78, 0] }}
                  transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Gelombang kejut ring kedua (kuning brand arena) */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '3.5px solid #facc15',
                    boxShadow: '0 0 24px rgba(250, 204, 21, 0.9), inset 0 0 16px rgba(250, 204, 21, 0.5)',
                  }}
                  initial={{ scale: 0.18, opacity: 0 }}
                  animate={{ scale: [0.18, 2.45], opacity: [0.95, 0.65, 0] }}
                  transition={{ duration: 1.02, delay: 0.09, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Gelombang kejut ring ketiga (warna aura karakter) */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2.5px solid ${aura}`,
                    boxShadow: `0 0 24px ${aura}`,
                  }}
                  initial={{ scale: 0.24, opacity: 0 }}
                  animate={{ scale: [0.24, 2.75], opacity: [0.85, 0.45, 0] }}
                  transition={{ duration: 1.12, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Pecahan segitiga/diamond/streak meledak naik dari lantai */}
            <div className="absolute bottom-[198px] left-1/2 -translate-x-1/2 max-[700px]:bottom-[272px]">
              {SPAWN_SHARDS.map((s) => {
                const color = toneColor(s.tone, aura)
                const isStreak = s.shape === 'streak'
                return (
                  <motion.span
                    key={s.id}
                    className="absolute bottom-0 left-0 block"
                    style={{
                      width: s.size,
                      height: s.h,
                      background: isStreak
                        ? `linear-gradient(180deg, #ffffff 0%, ${color} 55%, transparent 100%)`
                        : color,
                      boxShadow: `0 0 14px ${color}, 0 0 4px #ffffff`,
                      clipPath: shapeClip(s.shape),
                    }}
                    initial={{
                      x: s.x0 * spread,
                      y: 0,
                      scale: isStreak ? 0.85 : 0.45,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: s.dx * spread,
                      y: s.dy * (small ? 0.68 : 1),
                      scale: isStreak ? [0.85, 1.25, 0.2] : [0.45, 1.35, 0.9, 0],
                      rotate: s.rot,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: s.dur,
                      delay: s.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}

/**
 * Garis scan holografik + pita glitch energi yang menyapu tubuh karakter
 * dari sepatu ke kepala saat karakter materialize / lock-in.
 */
export function CharacterScanOverlay({ scanKey, aura, delay = 0, reduce }) {
  if (reduce) return null

  return (
    <motion.div
      key={scanKey}
      className="pointer-events-none absolute inset-x-[-24%] inset-y-0 z-30 overflow-visible"
      aria-hidden="true"
    >
      {/* Garis laser scan utama naik dari sepatu ke kepala */}
      <motion.div
        className="absolute inset-x-0 h-[6px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, #facc15 16%, #ffffff 50%, #facc15 84%, transparent 100%)`,
          boxShadow: `0 0 22px #facc15, 0 0 40px ${aura}, 0 0 8px #ffffff`,
        }}
        initial={{ bottom: '0%', opacity: 0, scaleX: 0.7 }}
        animate={{
          bottom: ['0%', '104%'],
          opacity: [0, 1, 1, 0],
          scaleX: [0.75, 1.18, 0.85],
        }}
        transition={{
          duration: 0.64,
          delay,
          times: [0, 0.12, 0.86, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      {/* Garis scan kedua menyusul tipis warna aura */}
      <motion.div
        className="absolute inset-x-[6%] h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${aura} 22%, #ffffff 50%, ${aura} 78%, transparent 100%)`,
          boxShadow: `0 0 18px ${aura}`,
        }}
        initial={{ bottom: '0%', opacity: 0 }}
        animate={{
          bottom: ['0%', '98%'],
          opacity: [0, 0.9, 0.75, 0],
        }}
        transition={{
          duration: 0.66,
          delay: delay + 0.08,
          times: [0, 0.18, 0.82, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Kilatan energi aura menyelimuti siluet sesaat */}
      <motion.div
        className="absolute inset-x-[4%] inset-y-[2%] mix-blend-screen"
        style={{
          background: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, #facc15 45%, ${aura}) 48%, transparent 100%)`,
          filter: 'blur(14px)',
        }}
        initial={{ opacity: 0, scaleY: 0.3 }}
        animate={{ opacity: [0, 0.85, 0], scaleY: [0.3, 1.08, 1] }}
        transition={{ duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  )
}
