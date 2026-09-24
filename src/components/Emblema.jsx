/** Emblema del santuario: círculo con cruz, como en el diseño. */
export default function Emblema({ size = 30, color = 'var(--gold)' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="15" cy="15" r="14" stroke={color} strokeWidth="1" />
      <rect x="14.2" y="7" width="1.6" height="16" fill={color} />
      <rect x="9" y="12.2" width="12" height="1.6" fill={color} />
    </svg>
  )
}
