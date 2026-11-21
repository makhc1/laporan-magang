import { useId } from 'react'

const Y = '#facc15'
const J = '#171922'

const HAIR = {
  buzz: (hc) => (
    <>
      <path
        d="M76 78 Q74 52 100 52 Q126 52 124 78 Q116 64 100 64 Q84 64 76 78Z"
        fill={hc}
      />
      <path
        d="M77 88 Q78 110 100 111 Q122 110 123 88 Q115 102 100 102 Q85 102 77 88Z"
        fill={hc}
      />
    </>
  ),
  spike: (hc) => (
    <path
      d="M76 76 L74 56 L84 62 L88 44 L96 58 L104 40 L110 58 L120 46 L122 62 L126 56 L124 76 Q112 62 100 62 Q88 62 76 76Z"
      fill={hc}
    />
  ),
  side: (hc) => (
    <>
      <path
        d="M75 80 Q70 48 102 49 Q130 50 125 80 Q122 64 104 62 Q86 64 75 80Z"
        fill={hc}
      />
      <path d="M78 64 Q98 50 124 64" stroke={hc} strokeWidth="4" fill="none" />
      <g fill="none" stroke="#0b0b0f" strokeWidth="1.8">
        <circle cx="91" cy="82" r="7" />
        <circle cx="109" cy="82" r="7" />
        <path d="M98 82 L102 82" />
      </g>
    </>
  ),
  curly: (hc) => (
    <g fill={hc}>
      <circle cx="80" cy="60" r="12" />
      <circle cx="92" cy="52" r="12" />
      <circle cx="108" cy="52" r="12" />
      <circle cx="120" cy="60" r="12" />
      <circle cx="100" cy="56" r="12" />
      <circle cx="76" cy="74" r="8" />
      <circle cx="124" cy="74" r="8" />
    </g>
  ),
  cap: (hc) => (
    <>
      <path d="M74 72 Q74 40 100 40 Q126 40 126 72 Z" fill="#232738" />
      <rect x="73" y="64" width="54" height="9" rx="3" fill={Y} />
      <path
        d="M76 74 Q78 80 78 86 L76 86 Z M124 74 Q122 80 122 86 L124 86 Z"
        fill={hc}
      />
    </>
  ),
}

export default function Avatar({ member, className = '' }) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '')
  const armId = `arm-${uid}`

  const sx = member.sx ?? 1
  const sy = member.sy ?? 1
  const skin = member.skin || '#e0ac86'
  const hc = member.hairColor || '#1a1410'
  const hair = (HAIR[member.hair] || HAIR.side)(hc)

  return (
    <svg
      viewBox="0 0 200 440"
      role="img"
      aria-label={`Karakter ${member.name}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <g id={armId}>
          <path d="M60 136 L38 144 L30 218 L52 222 Z" fill={J} />
          <path d="M42 142 L38 144 L30 218 L37 219.5 Z" fill={Y} />
          <path d="M58 137 L52 222" stroke="#232738" strokeWidth="2" />
          <rect
            x="29"
            y="216"
            width="25"
            height="10"
            rx="2"
            fill="#232738"
            stroke={Y}
            strokeWidth="1.4"
          />
          <path d="M31 226 L53 226 L50 290 L34 290 Z" fill={skin} />
          <ellipse cx="42" cy="297" rx="9" ry="10" fill={skin} />
        </g>
      </defs>

      <g transform={`translate(100 424) scale(${sx} ${sy}) translate(-100 -424)`}>
        <ellipse cx="100" cy="430" rx="62" ry="8" fill="rgba(0,0,0,.5)" />
        <ellipse cx="100" cy="434" rx="48" ry="5" fill="rgba(255,255,255,.08)" />

        <path d="M70 252 L98 252 L96 402 L72 402 Z" fill={J} />
        <path d="M102 252 L130 252 L128 402 L104 402 Z" fill={J} />
        <path d="M70 252 L75 252 L76 402 L72 402 Z" fill={Y} />
        <path d="M130 252 L125 252 L124 402 L128 402 Z" fill={Y} />
        <path d="M99 262 L100 402" stroke="#0d0e14" strokeWidth="2" />

        <path
          d="M64 424 L64 408 Q64 398 76 398 L97 398 L97 424 Z"
          fill="#0b0b0f"
        />
        <rect x="64" y="419" width="33" height="5" rx="2" fill="#3f3f46" />
        <path
          d="M136 424 L136 408 Q136 398 124 398 L103 398 L103 424 Z"
          fill="#0b0b0f"
        />
        <rect x="103" y="419" width="33" height="5" rx="2" fill="#3f3f46" />

        <path d="M58 134 Q100 118 142 134 L150 260 Q100 274 50 260 Z" fill={J} />
        <path d="M100 130 L100 268" stroke="#2c3142" strokeWidth="2" />
        <path
          d="M52 248 Q100 262 148 248"
          stroke="#232738"
          strokeWidth="6"
          fill="none"
        />
        <path d="M72 160 L90 160 L81 176 Z" fill={Y} />
        <path d="M77 163 L85 163 L81 170Z" fill={J} />

        <use href={`#${armId}`} />
        <use href={`#${armId}`} transform="translate(200 0) scale(-1 1)" />

        <rect x="91" y="104" width="18" height="30" fill={skin} />
        <rect x="91" y="104" width="18" height="10" fill="rgba(0,0,0,.18)" />

        <path
          d="M74 132 L83 102 L100 136 Z"
          fill="#1f2330"
          stroke={Y}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M126 132 L117 102 L100 136 Z"
          fill="#1f2330"
          stroke={Y}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <ellipse cx="76" cy="84" rx="4" ry="7" fill={skin} />
        <ellipse cx="124" cy="84" rx="4" ry="7" fill={skin} />
        <ellipse cx="100" cy="80" rx="24" ry="28" fill={skin} />
        {hair}

        <ellipse cx="91" cy="82" rx="2.4" ry="3" fill="#111" />
        <ellipse cx="109" cy="82" rx="2.4" ry="3" fill="#111" />
        <path
          d="M85 75 L96 74 M104 74 L115 75"
          stroke={hc}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M100 84 L98 92 L102 92"
          stroke="rgba(0,0,0,.25)"
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M93 97 Q100 102 107 97"
          stroke="#6b2f24"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
