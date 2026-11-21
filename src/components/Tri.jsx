export default function Tri({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 3h16L10 18z" fill="#000" />
      <path d="M7 6h6l-3 5.5z" fill="#facc15" />
    </svg>
  )
}
