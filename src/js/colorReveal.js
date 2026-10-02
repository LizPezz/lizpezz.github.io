import { imageUrl } from '../images.js'

// "sfondo: colore" — sopra la bozza c'è la versione a colori, nascosta da una maschera.
// Al primo passaggio del mouse se ne colora una piccola parte; tenendo premuto e muovendo
// il puntatore si "dipinge" il resto del disegno.
//
// Uso: <div class="color-reveal" data-color="chiave-colore"><img data-img="chiave-bozza"></div>

const MASK_W = 256 // la maschera è a bassa risoluzione: bordi morbidi e resize indolore
const FIRST_DAB = 0.07 // raggi in frazione della larghezza
const BRUSH = 0.085

function setup(el) {
  const canvas = document.createElement('canvas')
  canvas.className = 'color-reveal__canvas'
  const hint = document.createElement('span')
  hint.className = 'color-reveal__hint'
  hint.textContent = 'Tieni premuto e muovi per colorare'
  el.append(canvas, hint)

  const ctx = canvas.getContext('2d')
  const mask = document.createElement('canvas')
  const mctx = mask.getContext('2d')
  const img = new Image()
  let dirty = false
  let down = false
  let started = false
  let last = null

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5)
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    if (!mask.width) {
      mask.width = MASK_W
      mask.height = Math.max(1, Math.round((MASK_W * h) / w))
    }
    schedule()
  }

  const render = () => {
    dirty = false
    const W = canvas.width
    const H = canvas.height
    ctx.globalCompositeOperation = 'source-over'
    ctx.clearRect(0, 0, W, H)
    if (!img.naturalWidth) return
    ctx.drawImage(mask, 0, 0, W, H)
    ctx.globalCompositeOperation = 'source-in'
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) // come object-fit: cover
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
  }

  const schedule = () => {
    if (dirty) return
    dirty = true
    requestAnimationFrame(render)
  }

  const dab = ([x, y], r) => {
    const px = x * mask.width
    const py = y * mask.height
    const pr = r * mask.width
    const g = mctx.createRadialGradient(px, py, pr * 0.35, px, py, pr)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    mctx.fillStyle = g
    mctx.beginPath()
    mctx.arc(px, py, pr, 0, Math.PI * 2)
    mctx.fill()
    schedule()
  }

  const stroke = (from, to) => {
    const n = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / (BRUSH * 0.35)))
    for (let i = 1; i <= n; i++) {
      dab([from[0] + ((to[0] - from[0]) * i) / n, from[1] + ((to[1] - from[1]) * i) / n], BRUSH)
    }
  }

  const pos = (e) => {
    const r = el.getBoundingClientRect()
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]
  }

  el.addEventListener('pointerenter', (e) => {
    if (started || e.pointerType !== 'mouse') return
    started = true
    dab(pos(e), FIRST_DAB)
    el.classList.add('is-hinting')
  })
  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') e.preventDefault()
    down = true
    started = true
    last = pos(e)
    dab(last, BRUSH)
  })
  el.addEventListener('pointermove', (e) => {
    if (!down) return
    const p = pos(e)
    stroke(last, p)
    last = p
    el.classList.remove('is-hinting')
  })
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
    el.addEventListener(type, () => {
      down = false
    })
  }

  img.onload = schedule
  img.src = imageUrl(el.dataset.color)
  new ResizeObserver(resize).observe(el)
}

export function initColorReveal() {
  document.querySelectorAll('.color-reveal[data-color]').forEach(setup)
}
