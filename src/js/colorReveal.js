import { imageUrl } from '../images.js'

// "sfondo: colore" — sopra la bozza c'è la versione a colori, nascosta da una maschera.
// Al primo passaggio del mouse se ne colora una piccola parte; tenendo premuto e muovendo
// il puntatore si "dipinge" il resto del disegno.
//
// Uso: <div class="color-reveal" data-color="chiave-colore"><img data-img="chiave-bozza"></div>
// Il colore segue object-fit / object-position dell'<img> della bozza, così le due versioni combaciano.
// Con data-paint-text="selettore" gli elementi indicati ricevono --painted (0…1): quanto è colorata
// la parte di disegno che sta sotto di loro (es. scritte scure che si schiariscono col colore).
//
// Il pennello è public/images/brush.png (ricavato da res/brush.png: ritagliato, sfondo
// trasparente): ogni pennellata è una serie di "timbri" di quell'immagine, ruotati nel
// verso del movimento e semitrasparenti, così il colore si accumula come pittura vera.

const MASK_W = 768 // abbastanza fine da conservare la grana del pennello
const FIRST_DAB = 0.2 // larghezza del timbro in frazione della larghezza del disegno
const BRUSH = 0.24
const SPACING = 0.18 // distanza fra due timbri, in frazione della larghezza del timbro
const FLOW = 0.45 // opacità di ogni timbro
const FULL = 0.6 // copertura oltre la quale una scritta con data-paint-text è del tutto schiarita

const brush = new Image()
brush.src = import.meta.env.BASE_URL + 'images/brush.png'

function setup(el) {
  const canvas = document.createElement('canvas')
  canvas.className = 'color-reveal__canvas'
  const hint = document.createElement('span')
  hint.className = 'color-reveal__hint'
  hint.textContent = 'Tieni premuto e muovi per colorare'
  el.append(canvas, hint)

  const ctx = canvas.getContext('2d')
  const mask = document.createElement('canvas')
  const paintText = el.dataset.paintText ? [...document.querySelectorAll(el.dataset.paintText)] : []
  const mctx = mask.getContext('2d', { willReadFrequently: paintText.length > 0 })
  const sketch = el.querySelector('img')
  const img = new Image()
  let fit = { cover: true, x: 0.5, y: 0.5 }
  let dirty = false
  let down = false
  let started = false
  let last = null
  let sized = false

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2) // come l'<img>: il colore non deve perdere definizione
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    if (!sized) {
      // (un canvas nuovo è già 300x150: serve un flag, non basta controllare mask.width)
      sized = true
      mask.width = MASK_W
      mask.height = Math.max(1, Math.round((MASK_W * h) / w))
    }
    if (sketch) {
      const cs = getComputedStyle(sketch)
      const [x, y] = cs.objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
      fit = { cover: cs.objectFit !== 'contain', x, y }
    }
    schedule()
    measure()
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
    const s = (fit.cover ? Math.max : Math.min)(W / img.naturalWidth, H / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    ctx.drawImage(img, (W - dw) * fit.x, (H - dh) * fit.y, dw, dh)
  }

  // quanta parte del rettangolo (coordinate dello schermo) è già colorata, da 0 a 1
  const coverage = (r, box) => {
    const x0 = Math.max(0, Math.floor(((r.left - box.left) / box.width) * mask.width))
    const y0 = Math.max(0, Math.floor(((r.top - box.top) / box.height) * mask.height))
    const x1 = Math.min(mask.width, Math.ceil(((r.right - box.left) / box.width) * mask.width))
    const y1 = Math.min(mask.height, Math.ceil(((r.bottom - box.top) / box.height) * mask.height))
    if (x1 <= x0 || y1 <= y0) return 0
    const data = mctx.getImageData(x0, y0, x1 - x0, y1 - y0).data
    let sum = 0
    for (let i = 3; i < data.length; i += 16) sum += data[i] // un pixel ogni 4 basta
    return sum / 255 / (data.length / 16)
  }

  let measuring = 0
  const measure = () => {
    if (!paintText.length || measuring || !sized) return
    measuring = setTimeout(() => {
      measuring = 0
      const box = el.getBoundingClientRect()
      for (const t of paintText) {
        const v = Math.min(1, coverage(t.getBoundingClientRect(), box) / FULL)
        t.style.setProperty('--painted', v.toFixed(3))
      }
    }, 120)
  }

  const schedule = () => {
    if (dirty) return
    dirty = true
    requestAnimationFrame(render)
  }

  // un timbro del pennello; angle = verso della pennellata (il pennello è orizzontale)
  const dab = ([x, y], size, angle = (Math.random() - 0.5) * 0.6) => {
    const px = x * mask.width
    const py = y * mask.height
    const w = size * mask.width
    if (!brush.naturalWidth) {
      // pennello non ancora caricato: macchia morbida
      const g = mctx.createRadialGradient(px, py, w * 0.15, px, py, w * 0.4)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      mctx.fillStyle = g
      mctx.fillRect(px - w / 2, py - w / 2, w, w)
    } else {
      const s = w * (0.9 + Math.random() * 0.2)
      const h = (s * brush.naturalHeight) / brush.naturalWidth
      mctx.save()
      mctx.globalAlpha = FLOW
      mctx.translate(px, py)
      mctx.rotate(angle + (Math.random() - 0.5) * 0.25)
      if (Math.random() < 0.5) mctx.scale(1, -1) // varia la grana fra un timbro e l'altro
      mctx.drawImage(brush, -s / 2, -h / 2, s, h)
      mctx.restore()
    }
    schedule()
    measure()
  }

  const stroke = (from, to) => {
    const dx = (to[0] - from[0]) * mask.width
    const dy = (to[1] - from[1]) * mask.height
    const dist = Math.hypot(dx, dy)
    const step = BRUSH * mask.width * SPACING
    if (dist < step) return false // troppo vicino: aspetta che il puntatore si allontani
    const angle = Math.atan2(dy, dx)
    const n = Math.floor(dist / step)
    for (let i = 1; i <= n; i++) {
      const t = (i * step) / dist
      dab([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t], BRUSH, angle)
    }
    return [from[0] + ((to[0] - from[0]) * n * step) / dist, from[1] + ((to[1] - from[1]) * n * step) / dist]
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
    const next = stroke(last, pos(e))
    if (next) last = next
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
