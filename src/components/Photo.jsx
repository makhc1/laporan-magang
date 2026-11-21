import { useId } from 'react'

const LABELS = {
  coding: 'Sesi pengembangan',
  server: 'Ruang server',
  meeting: 'Rapat bersama pembimbing',
  survey: 'Survei lapangan',
}

export default function Photo({ kind }) {
  const rawId = useId()
  const gradientId = `photo-${kind}-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const label = LABELS[kind] || kind

  let art = null
  if (kind === 'coding') {
    art = (
      <>
        <rect
          x="70"
          y="26"
          width="180"
          height="94"
          fill="#0c0e14"
          stroke="#facc15"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="82"
            y={38 + i * 14}
            width={40 + ((i * 37) % 90)}
            height="5"
            fill={i % 2 ? '#ef4444' : '#facc15'}
          />
        ))}
      </>
    )
  } else if (kind === 'server') {
    art = (
      <>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x="100"
              y={20 + i * 28}
              width="120"
              height="22"
              fill="#2a2e3d"
              stroke="#52525b"
            />
            <circle
              cx="112"
              cy={31 + i * 28}
              r="3"
              fill={i === 2 ? '#ef4444' : '#10b981'}
            />
            <rect
              x="170"
              y={28 + i * 28}
              width="40"
              height="6"
              fill="#52525b"
            />
          </g>
        ))}
      </>
    )
  } else if (kind === 'meeting') {
    art = (
      <>
        <ellipse cx="160" cy="92" rx="90" ry="26" fill="#2a2e3d" />
        {[70, 115, 160, 205, 250].map((x, i) => {
          const cy = i % 2 ? 50 : 62
          return (
            <g key={x}>
              <circle cx={x} cy={cy} r="11" fill="#d4d4d8" />
              <rect
                x={x - 14}
                y={cy + 12}
                width="28"
                height="16"
                fill="#facc15"
                opacity=".85"
              />
            </g>
          )
        })}
      </>
    )
  } else {
    art = (
      <>
        <path
          d="M20 120 Q80 40 160 90 T300 40"
          stroke="#facc15"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="20" cy="120" r="6" fill="#ef4444" />
        <circle cx="160" cy="90" r="6" fill="#ef4444" />
        <circle cx="300" cy="40" r="6" fill="#ef4444" />
      </>
    )
  }

  return (
    <svg
      viewBox="0 0 320 150"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Foto dokumentasi: ${label}`}
      className="block h-auto w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b0d12" />
          <stop offset="1" stopColor="#0c0e14" />
        </linearGradient>
      </defs>
      <rect width="320" height="150" fill={`url(#${gradientId})`} />
      {art}
      <text x="12" y="140" fontFamily="monospace" fontSize="10" fill="#e4e4e7">
        {label}
      </text>
    </svg>
  )
}
