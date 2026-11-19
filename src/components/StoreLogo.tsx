interface LogoProps {
  store: string
  fallback?: string
}

/** Brand marks rendered inside the white circle of a best-price row. */
export function StoreLogo({ store, fallback }: LogoProps) {
  const key = store.toLowerCase().replace(/[^a-z]/g, '')

  if (key === 'nykaa')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <defs>
          <linearGradient id="zl-nykaa" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff5fa2" />
            <stop offset="55%" stopColor="#f0266f" />
            <stop offset="100%" stopColor="#d6146b" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#zl-nykaa)" />
        <text
          x="20"
          y="27.5"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="21"
          fontStyle="italic"
          fontWeight="700"
        >
          N
        </text>
      </svg>
    )

  if (key === 'myntra')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <defs>
          <linearGradient id="zl-myntra" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff9933" />
            <stop offset="45%" stopColor="#f13ab1" />
            <stop offset="100%" stopColor="#e72744" />
          </linearGradient>
        </defs>
        <path
          d="M9.5 29.5c-.5-6.2 1.3-11.4 4.6-13.6 2.6-1.7 5.2-.4 5.9 2.7.7-3.1 3.3-4.4 5.9-2.7 3.3 2.2 5.1 7.4 4.6 13.6-2.3.2-3.9-1-4.4-3.3-.5-2.3-.2-5-1.6-6-1.2-.8-2.3.3-2.5 2.3-.1 1.3-.1 3.1-.1 4.6h-3.8c0-1.5 0-3.3-.1-4.6-.2-2-1.3-3.1-2.5-2.3-1.4 1-1.1 3.7-1.6 6-.5 2.3-2.1 3.5-4.4 3.3Z"
          fill="url(#zl-myntra)"
        />
        <path d="M14.6 11.4h10.8" stroke="url(#zl-myntra)" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )

  if (key === 'tirabeauty')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <defs>
          <radialGradient id="zl-tira" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="38%" stopColor="#b9c4f2" />
            <stop offset="72%" stopColor="#4a5fd0" />
            <stop offset="100%" stopColor="#2b2f8f" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="12.5" fill="url(#zl-tira)" />
        <ellipse cx="15.5" cy="15" rx="5" ry="3.4" fill="#fff" opacity=".55" transform="rotate(-28 15.5 15)" />
      </svg>
    )

  if (key === 'amazon')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#ff9900" />
        <path
          d="M10.5 23.8c5.3 3.6 12.4 3.7 18.1.4"
          fill="none"
          stroke="#fff"
          strokeWidth="3.1"
          strokeLinecap="round"
        />
        <path d="M27.2 22.6l3.4-1.1-.6 3.6z" fill="#fff" />
      </svg>
    )

  if (key === 'instamart')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#fc8019" />
        <path d="M13 15h14l-1.6 11.2a2 2 0 0 1-2 1.8h-6.8a2 2 0 0 1-2-1.8z" fill="#fff" />
        <path d="M16.5 15v-1.5a3.5 3.5 0 0 1 7 0V15" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )

  if (key === 'zepto')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#5a1aa8" />
        <path d="M13.5 13.5h13l-12 13h13" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )

  if (key === 'brandwebsite')
    return (
      <svg viewBox="0 0 40 40" className="pr-mark" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#2c2c30" />
        <g fill="none" stroke="#fff" strokeWidth="1.8">
          <circle cx="20" cy="20" r="9" />
          <ellipse cx="20" cy="20" rx="4" ry="9" />
          <path d="M11 20h18" />
        </g>
      </svg>
    )

  return <span className="pr-mark pr-mark-text">{fallback ?? store.charAt(0)}</span>
}
