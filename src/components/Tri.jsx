// Logo Cyber Brain (Otak 1000 IQ) untuk Perkumpulan Manusia Pinter
// Varian:
// - 'onBrand' (default): siluet hitam pekat + sirkuit kuning + inti kilat merah (untuk badge & tombol kuning #facc15)
// - 'onDark': siluet kuning emas + sirkuit gelap + inti kilat merah/putih (untuk permukaan gelap)
// - 'onCrimson': siluet putih + sirkuit merah + inti kilat emas (untuk permukaan merah)
export default function Tri({ size = 20, variant = 'onBrand', className = '' }) {
  const palette =
    variant === 'onDark'
      ? { body: '#facc15', circuit: '#090b10', bolt: '#ef4444', boltStroke: '#090b10' }
      : variant === 'onCrimson'
        ? { body: '#ffffff', circuit: '#dc2626', bolt: '#facc15', boltStroke: '#dc2626' }
        : { body: '#090b10', circuit: '#facc15', bolt: '#dc2626', boltStroke: '#facc15' }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
    >
      {/* Belahan otak kiri (geometris cyber-armor) */}
      <path
        d="M14.2 3.2 H9.4 L5.8 6.8 V10.2 L3.2 12.8 V19.0 L5.8 21.6 V25.0 L9.4 28.6 H14.2 V22.4 L11.4 19.6 V15.4 L14.2 12.6 Z"
        fill={palette.body}
      />
      {/* Belahan otak kanan (simetris) */}
      <path
        d="M17.8 3.2 H22.6 L26.2 6.8 V10.2 L28.8 12.8 V19.0 L26.2 21.6 V25.0 L22.6 28.6 H17.8 V22.4 L20.6 19.6 V15.4 L17.8 12.6 Z"
        fill={palette.body}
      />

      {/* Jalur sirkuit saraf kiri */}
      <path
        d="M8.4 8.2 H11.4 V11.2 M6.4 15.8 H9.4 L10.8 17.2 M8.4 23.6 H11.2"
        stroke={palette.circuit}
        strokeWidth="1.9"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <rect x="7.3" y="7.1" width="2.2" height="2.2" fill={palette.circuit} />
      <rect x="5.3" y="14.7" width="2.2" height="2.2" fill={palette.circuit} />
      <rect x="7.3" y="22.5" width="2.2" height="2.2" fill={palette.circuit} />

      {/* Jalur sirkuit saraf kanan */}
      <path
        d="M23.6 8.2 H20.6 V11.2 M25.6 15.8 H22.6 L21.2 17.2 M23.6 23.6 H20.8"
        stroke={palette.circuit}
        strokeWidth="1.9"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <rect x="22.5" y="7.1" width="2.2" height="2.2" fill={palette.circuit} />
      <rect x="24.5" y="14.7" width="2.2" height="2.2" fill={palette.circuit} />
      <rect x="22.5" y="22.5" width="2.2" height="2.2" fill={palette.circuit} />

      {/* Inti kilat energi 1000 IQ di tengah belahan */}
      <polygon
        points="17.8,4.6 12.2,16.4 15.8,16.4 14.2,27.4 19.8,15.0 16.2,15.0"
        fill={palette.bolt}
        stroke={palette.boltStroke}
        strokeWidth="1.35"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
