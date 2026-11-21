const A = '#facc15'
const R = '#ef4444'
const G = '#2a2e3d'
const BG = '#0c0e14'
const T = '#52525b'

function Lan() {
  return (
    <>
      <g stroke={T} strokeWidth="1.5">
        <path d="M160 60 L50 120 M160 60 L105 125 M160 60 L160 128 M160 60 L215 125 M160 60 L270 120 M160 60 L160 22" />
      </g>
      <rect x="132" y="46" width="56" height="26" fill={A} />
      <text
        x="160"
        y="63"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="11"
        fontWeight="700"
        fill="#000"
      >
        SWITCH
      </text>
      <rect x="143" y="8" width="34" height="16" fill={R} />
      <text
        x="160"
        y="20"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="9"
        fill="#fff"
      >
        ROUTER
      </text>
      {[50, 105, 160, 215, 270].map((x, i) => {
        const y = i === 0 || i === 4 ? 120 : 125
        return (
          <g key={x}>
            <rect
              x={x - 18}
              y={y}
              width="36"
              height="24"
              fill={G}
              stroke={A}
              strokeWidth="1"
            />
            <text
              x={x}
              y={y + 16}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="9"
              fill="#d4d4d8"
            >
              VLAN{10 * (i + 1)}
            </text>
          </g>
        )
      })}
    </>
  )
}

function Archive() {
  return (
    <>
      <ellipse cx="62" cy="40" rx="34" ry="10" fill={A} />
      <path d="M28 40 V100 A34 10 0 0 0 96 100 V40" fill="#c9a40f" />
      <ellipse cx="62" cy="40" rx="34" ry="10" fill={A} />
      <path
        d="M28 70 A34 10 0 0 0 96 70"
        stroke="#000"
        strokeOpacity=".35"
        fill="none"
      />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <rect x="124" y={22 + i * 28} width="176" height="22" fill={G} />
          <rect
            x="132"
            y={29 + i * 28}
            width="14"
            height="8"
            fill={i === 1 ? R : A}
          />
          <rect
            x="154"
            y={30 + i * 28}
            width={90 - i * 9}
            height="6"
            fill={T}
          />
        </g>
      ))}
    </>
  )
}

function Dashboard() {
  return (
    <>
      <rect x="12" y="12" width="92" height="40" fill={G} />
      <rect x="114" y="12" width="92" height="40" fill={G} />
      <rect x="216" y="12" width="92" height="40" fill={G} />
      <text
        x="22"
        y="40"
        fontFamily="monospace"
        fontSize="20"
        fontWeight="700"
        fill={A}
      >
        1.284
      </text>
      <text
        x="124"
        y="40"
        fontFamily="monospace"
        fontSize="20"
        fontWeight="700"
        fill="#fff"
      >
        96%
      </text>
      <text
        x="226"
        y="40"
        fontFamily="monospace"
        fontSize="20"
        fontWeight="700"
        fill={R}
      >
        12
      </text>
      <rect x="12" y="62" width="190" height="98" fill={G} />
      {[30, 52, 38, 70, 58, 84, 66].map((v, i) => (
        <rect
          key={i}
          x={24 + i * 25}
          y={150 - v}
          width="16"
          height={v}
          fill={i === 5 ? A : T}
        />
      ))}
      <rect x="212" y="62" width="96" height="98" fill={G} />
      <polyline
        points="220,140 240,120 258,130 278,92 300,100"
        stroke={R}
        strokeWidth="3"
        fill="none"
      />
    </>
  )
}

function Web() {
  return (
    <>
      <rect x="8" y="8" width="304" height="154" fill="#13151d" stroke={G} />
      <rect x="8" y="8" width="304" height="20" fill={G} />
      <circle cx="20" cy="18" r="3.5" fill={R} />
      <circle cx="32" cy="18" r="3.5" fill={A} />
      <circle cx="44" cy="18" r="3.5" fill="#10b981" />
      <rect x="60" y="12" width="150" height="12" fill="#0c0e14" />
      <rect x="22" y="40" width="160" height="14" fill={A} />
      <rect x="22" y="62" width="200" height="6" fill={T} />
      <rect x="22" y="74" width="170" height="6" fill={T} />
      <rect x="22" y="92" width="86" height="56" fill={G} />
      <rect x="116" y="92" width="86" height="56" fill={G} />
      <rect x="210" y="92" width="86" height="56" fill={G} />
      <rect x="22" y="136" width="86" height="12" fill={R} />
      <rect x="236" y="38" width="60" height="34" fill={G} />
    </>
  )
}

export default function Mockup({ kind = 'web' }) {
  const body = {
    lan: <Lan />,
    archive: <Archive />,
    dashboard: <Dashboard />,
    web: <Web />,
  }[kind] ?? <Web />

  return (
    <svg
      viewBox="0 0 320 170"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Pratinjau ${kind}`}
      className="block h-auto w-full"
    >
      <rect width="320" height="170" fill={BG} />
      {body}
    </svg>
  )
}
