const tones = {
  sketch: { bg: ['#efede8', '#d6d2c9'], ink: '#6f6a64' },
  color: { bg: ['#e2a15c', '#3f6f78'], ink: '#ffffff' },
  dark: { bg: ['#4a3018', '#0e1422'], ink: '#ecd9b4' },
  line: { bg: null, ink: '#6d7f9c' },
}

// Segnaposto SVG (data URI) con etichetta e dimensioni consigliate.
export function placeholder({ label, w = 1200, h = 1200, tone = 'sketch' }) {
  const t = tones[tone] ?? tones.sketch
  const fs = Math.round(Math.min(w, h) / 13)
  const sw = Math.max(3, Math.round(Math.min(w, h) / 220))
  const p = (x, y) => `${Math.round(x * w)} ${Math.round(y * h)}`
  const bg = t.bg
    ? `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg[0]}"/><stop offset="1" stop-color="${t.bg[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>`
    : `<rect x="${sw}" y="${sw}" width="${w - sw * 2}" height="${h - sw * 2}" fill="none" stroke="${t.ink}" stroke-width="${sw}" stroke-dasharray="${sw * 5} ${sw * 4}" opacity=".5"/>`
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg}` +
    `<g fill="none" stroke="${t.ink}" stroke-width="${sw}" stroke-linecap="round" opacity=".45">` +
    `<path d="M${p(0.08, 0.82)} C${p(0.3, 0.15)} ${p(0.45, 0.95)} ${p(0.92, 0.12)}"/>` +
    `<path d="M${p(0.1, 0.2)} C${p(0.35, 0.4)} ${p(0.6, 0.05)} ${p(0.9, 0.75)}"/>` +
    `<circle cx="${Math.round(w * 0.5)}" cy="${Math.round(h * 0.3)}" r="${Math.round(Math.min(w, h) * 0.14)}"/></g>` +
    `<g fill="${t.ink}" font-family="Helvetica, Arial, sans-serif" text-anchor="middle">` +
    `<text x="${w / 2}" y="${h * 0.56}" font-size="${fs}" font-weight="700">${label}</text>` +
    `<text x="${w / 2}" y="${h * 0.56 + fs * 1.3}" font-size="${Math.round(fs * 0.55)}" opacity=".8">segnaposto ${w}x${h}</text>` +
    `</g></svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}
