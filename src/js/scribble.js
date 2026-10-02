import { reducedMotion } from './animations.js'

// Animazione "schizzo / scarabocchio": l'elemento è coperto da un canvas del colore
// dello sfondo, che viene "grattato via" da un tratto a zig-zag come uno scarabocchio a matita.
// Funziona su qualsiasi elemento (immagini, sfondi, il riquadro del modulo).

const DURATION = 1300
const SCALE = 0.5 // il canvas di copertura lavora a metà risoluzione

function zigzag(w, h) {
  const step = Math.min(90, Math.max(24, h * 0.22))
  const slant = h * 0.3
  const lw = step * 1.35
  const jitter = () => (Math.random() - 0.5) * step * 0.35
  const pts = []
  for (let x = -step; x - slant < w + step; x += step) {
    pts.push([x + jitter(), -lw / 2], [x + step / 2 - slant + jitter(), h + lw / 2])
  }
  const lengths = [0]
  for (let i = 1; i < pts.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  }
  return { pts, lengths, lw, total: lengths[lengths.length - 1] }
}

function run(el, canvas, fill) {
  fill()
  const ctx = canvas.getContext('2d')
  const { pts, lengths, lw, total } = zigzag(canvas.width, canvas.height)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.lineWidth = lw
  ctx.lineCap = ctx.lineJoin = 'round'

  const pointAt = (len) => {
    let i = 1
    while (i < lengths.length - 1 && lengths[i] < len) i++
    const t = (len - lengths[i - 1]) / (lengths[i] - lengths[i - 1] || 1)
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t, i]
  }

  let start = null
  let drawn = 0
  const frame = (now) => {
    start ??= now
    const t = Math.min(1, (now - start) / DURATION)
    const len = total * t
    const [x0, y0, i0] = pointAt(drawn)
    const [x1, y1, i1] = pointAt(len)
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    for (let i = i0; i < i1; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.lineTo(x1, y1)
    ctx.stroke()
    drawn = len
    if (t < 1) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}

export function initScribble() {
  document.querySelectorAll('[data-anim="scribble"]').forEach((el) => {
    if (reducedMotion) {
      el.classList.add('is-ready')
      return
    }
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
    const color = el.dataset.cover || getComputedStyle(el).getPropertyValue('--bg').trim() || '#fff'
    const canvas = document.createElement('canvas')
    canvas.className = 'scribble-cover'
    const fill = () => {
      canvas.width = Math.max(1, Math.ceil(el.clientWidth * SCALE))
      canvas.height = Math.max(1, Math.ceil(el.clientHeight * SCALE))
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = color
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    fill()
    el.append(canvas)
    el.classList.add('is-ready')
    el.addEventListener('anim:in', () => run(el, canvas, fill), { once: true })
  })
}
