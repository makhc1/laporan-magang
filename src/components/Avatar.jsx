import { useId, useState } from 'react'

// Kalibrasi tinggi badan relatif di panggung:
// - Abimanyu, Rafly, Fero, Alfi: tinggi sejajar -> 1.00
// - Ahmad: sedikit lebih tinggi (~2cm) -> 1.02
export const MEMBER_STATURE = {
  ahmad: 1.02,
  abimanyu: 1.0,
  rafly: 1.0,
  fero: 1.0,
  alfi: 1.0,
}

// Peta aset render 3D yang sudah tersedia di public/characters/
export const CHARACTER_3D_ASSETS = {
  ahmad: { src: '/characters/ahmad.webp', width: 364, height: 1100 },
  abimanyu: { src: '/characters/abimanyu.webp', width: 396, height: 1100 },
  rafly: { src: '/characters/rafly.webp', width: 352, height: 1100 },
  fero: { src: '/characters/fero.webp', width: 388, height: 1100 },
  alfi: { src: '/characters/alfi.webp', width: 354, height: 1100 },
}

export function getMemberStature(member) {
  const id = String(member?.id || '').toLowerCase()
  if (MEMBER_STATURE[id]) return MEMBER_STATURE[id]
  return Math.min(1.12, Math.max(0.86, Number(member?.sy) || 1))
}

const HAIR = {
  buzz: (hc) => (
    <path
      d="M76 76 Q75 50 100 50 Q125 50 124 76 Q116 63 100 63 Q84 63 76 76Z"
      fill={hc}
    />
  ),
  spike: (hc) => (
    <path
      d="M76 76 L73 56 L83 61 L88 43 L96 57 L104 39 L110 57 L120 45 L122 61 L127 56 L124 76 Q112 62 100 62 Q88 62 76 76Z"
      fill={hc}
    />
  ),
  side: (hc) => (
    <>
      <path
        d="M75 79 Q71 47 102 48 Q129 49 125 79 Q121 63 104 61 Q86 63 75 79Z"
        fill={hc}
      />
      <path d="M78 63 Q98 49 124 63" stroke="#2c2420" strokeWidth="2.5" fill="none" opacity="0.5" />
      <g fill="none" stroke="#111319" strokeWidth="2">
        <rect x="83" y="76" width="14" height="10" rx="3" />
        <rect x="103" y="76" width="14" height="10" rx="3" />
        <path d="M97 81 L103 81" />
      </g>
    </>
  ),
  curly: (hc) => (
    <g fill={hc}>
      <circle cx="77" cy="64" r="11" />
      <circle cx="84" cy="52" r="12" />
      <circle cx="96" cy="47" r="13" />
      <circle cx="109" cy="48" r="12" />
      <circle cx="119" cy="56" r="11" />
      <circle cx="123" cy="66" r="10" />
      <circle cx="92" cy="56" r="11" />
      <circle cx="106" cy="56" r="11" />
      <circle cx="75" cy="74" r="7" />
      <circle cx="125" cy="74" r="7" />
    </g>
  ),
  crop: (hc) => (
    <path
      d="M75 77 Q74 49 100 47 Q126 49 125 77 Q117 61 100 60 Q83 61 75 77Z"
      fill={hc}
    />
  ),
  beard: (hc) => (
    <>
      <path
        d="M75 77 Q74 48 100 47 Q126 48 125 77 Q117 62 100 61 Q83 62 75 77Z"
        fill={hc}
      />
      {/* Kumis */}
      <path
        d="M90 95 Q100 91 110 95 Q105 98 100 97 Q95 98 90 95Z"
        fill={hc}
      />
      {/* Jenggot */}
      <path
        d="M78 88 Q79 111 100 113 Q121 111 122 88 Q116 102 100 103 Q84 102 78 88Z"
        fill={hc}
      />
    </>
  ),
  cap: (hc) => (
    <>
      <path d="M74 72 Q74 40 100 40 Q126 40 126 72 Z" fill="#232738" />
      <rect x="73" y="64" width="54" height="9" rx="3" fill="#facc15" />
      <path
        d="M76 74 Q78 80 78 86 L76 86 Z M124 74 Q122 80 122 86 L124 86 Z"
        fill={hc}
      />
    </>
  ),
}

function ProceduralAvatar({ member, active = false, className }) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')
  const armId = `arm-${uid}`
  const hoodieGrad = `hoodie-${uid}`
  const skinGrad = `skin-${uid}`
  const pantsGrad = `pants-${uid}`
  const hairGrad = `hair-${uid}`

  const sx = member.sx ?? 1
  const sy = member.sy ?? 1
  const skin = member.skin || '#e0ac86'
  const hc = member.hairColor || '#1a1410'
  const accent = member.aura || '#facc15'
  const hair = (HAIR[member.hair] || HAIR.crop)(`url(#${hairGrad})`)

  return (
    <div
      className={`relative flex items-end justify-center select-none ${className}`}
      style={{ '--aura': accent }}
    >
      <span
        className="pointer-events-none absolute -bottom-2 left-1/2 h-6 w-[74%] -translate-x-1/2 rounded-full bg-black/75 blur-[6px]"
        aria-hidden="true"
      />
      <svg
        viewBox="24 38 152 388"
        width="152"
        height="388"
        role="img"
        aria-label={`Karakter ${member.name}`}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-full w-auto max-w-none"
        style={{
          filter: active
            ? 'drop-shadow(0 18px 20px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 20px color-mix(in srgb, var(--aura) 35%, transparent))'
            : 'drop-shadow(0 14px 16px rgba(0, 0, 0, 0.55))',
        }}
      >
        <defs>
          <linearGradient id={hoodieGrad} x1="0.1" y1="0" x2="0.95" y2="0.35">
            <stop offset="0%" stopColor="#353a47" />
            <stop offset="40%" stopColor="#20232d" />
            <stop offset="100%" stopColor="#0f1117" />
          </linearGradient>
          <linearGradient id={pantsGrad} x1="0.1" y1="0" x2="0.95" y2="0.15">
            <stop offset="0%" stopColor="#2b303d" />
            <stop offset="50%" stopColor="#181b24" />
            <stop offset="100%" stopColor="#0b0d12" />
          </linearGradient>
          <radialGradient id={skinGrad} cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor={skin} />
            <stop offset="72%" stopColor={skin} stopOpacity="0.92" />
            <stop offset="100%" stopColor="#6f432a" />
          </radialGradient>
          <linearGradient id={hairGrad} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#362c26" />
            <stop offset="45%" stopColor={hc} />
            <stop offset="100%" stopColor="#090706" />
          </linearGradient>
          <g id={armId}>
            {/* Lengan hoodie agak digulung (lean athletic forearm) */}
            <path d="M62 135 L40 144 L33 206 L53 210 Z" fill={`url(#${hoodieGrad})`} />
            <path d="M44 142 L40 144 L33 206 L39 207 Z" fill={accent} opacity="0.92" />
            <rect x="32" y="202" width="22" height="9" rx="3" fill="#13161f" />
            <path d="M35 211 L52 211 L48 286 L36 286 Z" fill={`url(#${skinGrad})`} />
            <ellipse cx="42" cy="294" rx="8" ry="9.5" fill={`url(#${skinGrad})`} />
          </g>
        </defs>

        <g transform={`translate(100 426) scale(${sx} ${sy}) translate(-100 -426)`}>
          {/* Celana streetwear tapered */}
          <path d="M72 252 L98 252 L95 402 L75 402 Z" fill={`url(#${pantsGrad})`} />
          <path d="M102 252 L128 252 L125 402 L105 402 Z" fill={`url(#${pantsGrad})`} />
          <path d="M99 264 L100 402" stroke="#08090d" strokeWidth="2" />

          {/* Sneakers */}
          <path d="M64 424 L64 409 Q64 399 76 399 L97 399 L97 424 Z" fill="#0d0f14" />
          <rect x="64" y="419" width="33" height="5" rx="2" fill={accent} />
          <path d="M136 424 L136 409 Q136 399 124 399 L103 399 L103 424 Z" fill="#0d0f14" />
          <rect x="103" y="419" width="33" height="5" rx="2" fill={accent} />

          {/* Hoodie streetwear athletic fit */}
          <path d="M60 133 Q100 119 140 133 L145 258 Q100 270 55 258 Z" fill={`url(#${hoodieGrad})`} />
          {/* Kantong hoodie */}
          <path d="M74 205 L126 205 L131 244 Q100 251 69 244 Z" fill="rgba(0,0,0,.24)" />
          {/* Tali hoodie */}
          <path d="M91 136 L89 178" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M109 136 L111 178" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
          {/* Emblem segitiga dada */}
          <path d="M112 162 L120 149 L128 162 Z" fill={accent} />
          <path d="M116 162 L120 155 L124 162 Z" fill="#181b24" />

          <use href={`#${armId}`} />
          <use href={`#${armId}`} transform="translate(200 0) scale(-1 1)" />

          {/* Leher & kerah hood */}
          <rect x="91" y="104" width="18" height="30" fill={`url(#${skinGrad})`} />
          <rect x="91" y="104" width="18" height="10" fill="rgba(0,0,0,.22)" />
          <path
            d="M72 132 Q80 112 100 134 Q120 112 128 132 Q115 144 100 144 Q85 144 72 132 Z"
            fill="#1f2432"
            stroke={accent}
            strokeWidth="1.2"
            strokeOpacity="0.65"
          />

          {/* Kepala */}
          <ellipse cx="77" cy="84" rx="4" ry="7" fill={skin} />
          <ellipse cx="123" cy="84" rx="4" ry="7" fill={skin} />
          <ellipse cx="100" cy="80" rx="23" ry="27" fill={`url(#${skinGrad})`} />
          {hair}

          <ellipse cx="91" cy="82" rx="2.5" ry="3" fill="#111" />
          <ellipse cx="109" cy="82" rx="2.5" ry="3" fill="#111" />
          <circle cx="90.3" cy="81" r="0.8" fill="#fff" opacity="0.7" />
          <circle cx="108.3" cy="81" r="0.8" fill="#fff" opacity="0.7" />
          <path
            d="M85 75 L96 74 M104 74 L115 75"
            stroke={hc}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M100 84 L98 92 L102 92"
            stroke="rgba(0,0,0,.25)"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M93 97 Q100 101 107 97"
            stroke="#6b2f24"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

export default function Avatar({ member, active = false, className = '' }) {
  const id = String(member?.id || '').toLowerCase()
  const asset = CHARACTER_3D_ASSETS[id]
  const [imgFailed, setImgFailed] = useState(false)

  if (!asset || imgFailed) {
    return <ProceduralAvatar member={member} active={active} className={className} />
  }

  return (
    <div
      className={`relative flex items-end justify-center select-none ${className}`}
      style={{ '--aura': member.aura || '#facc15' }}
    >
      {/* Bayangan kontak lantai di bawah sepatu agar karakter menyatu dengan panggung */}
      <span
        className="pointer-events-none absolute -bottom-2 left-1/2 h-6 w-[74%] -translate-x-1/2 rounded-full bg-black/75 blur-[6px]"
        aria-hidden="true"
      />
      <img
        src={asset.src}
        alt={`Karakter 3D ${member.name} (${member.role})`}
        width={asset.width}
        height={asset.height}
        loading={active ? 'eager' : 'lazy'}
        fetchPriority={active ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onError={() => setImgFailed(true)}
        className="relative z-10 h-full w-auto max-w-none object-contain object-bottom"
        style={{
          filter: active
            ? 'drop-shadow(0 18px 20px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 20px color-mix(in srgb, var(--aura) 35%, transparent))'
            : 'drop-shadow(0 14px 16px rgba(0, 0, 0, 0.55))',
        }}
      />
    </div>
  )
}
