// SVG flags for each supported language
export default function LangFlag({ code, size = 24 }) {
  const h = Math.round(size * 0.67)
  const r = Math.round(size * 0.08)

  const flags = {
    // Spain — red-yellow-red horizontal
    es: (
      <svg width={size} height={h} viewBox="0 0 30 20" style={{ borderRadius: r, display: 'block' }}>
        <rect width="30" height="20" fill="#c60b1e"/>
        <rect y="5" width="30" height="10" fill="#ffc400"/>
      </svg>
    ),
    // Catalonia — Senyera (4 red stripes on gold)
    ca: (
      <svg width={size} height={h} viewBox="0 0 30 20" style={{ borderRadius: r, display: 'block' }}>
        <rect width="30" height="20" fill="#fcdd09"/>
        <rect y="2.22" width="30" height="2.22" fill="#da121a"/>
        <rect y="6.67" width="30" height="2.22" fill="#da121a"/>
        <rect y="11.11" width="30" height="2.22" fill="#da121a"/>
        <rect y="15.56" width="30" height="2.22" fill="#da121a"/>
      </svg>
    ),
    // Basque Country — Ikurriña
    eu: (
      <svg width={size} height={h} viewBox="0 0 30 20" style={{ borderRadius: r, display: 'block' }}>
        <rect width="30" height="20" fill="#d52b1e"/>
        {/* Green diagonal cross (saltire) */}
        <line x1="0" y1="0" x2="30" y2="20" stroke="#009b48" strokeWidth="2.8"/>
        <line x1="30" y1="0" x2="0" y2="20" stroke="#009b48" strokeWidth="2.8"/>
        {/* White vertical + horizontal cross */}
        <line x1="15" y1="0" x2="15" y2="20" stroke="#fff" strokeWidth="1.8"/>
        <line x1="0" y1="10" x2="30" y2="10" stroke="#fff" strokeWidth="1.8"/>
      </svg>
    ),
    // Galicia — white with blue diagonal band
    gl: (
      <svg width={size} height={h} viewBox="0 0 30 20" style={{ borderRadius: r, display: 'block' }}>
        <rect width="30" height="20" fill="#fff"/>
        <line x1="0" y1="20" x2="30" y2="0" stroke="#0039a6" strokeWidth="5.5"/>
      </svg>
    )
  }

  return flags[code] || null
}
