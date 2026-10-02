import { imageUrl } from '../images.js'

// Carosello "Racconti di carbone": le immagini scorrono da sinistra a destra.
// Quella che arriva nel terzo quadrante (a destra del centro) si ingrandisce, lascia
// comparire titolo, descrizione e pulsante, e resta ferma HOLD secondi prima di ripartire.

const HOLD = 1.5 // secondi di sosta su ogni racconto
const MOVE = 1.6 // secondi per passare al racconto successivo
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mod = (v, m) => ((v % m) + m) % m
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export function initCarousel(root, stories) {
  let items = []
  let m = null // misure correnti
  let step = 0 // quanti racconti sono già passati
  let phase = 'hold'
  let t = 0
  let paused = false
  let last = null

  const build = () => {
    const vw = root.clientWidth
    const base = clamp(vw * 0.167, 140, 240)
    const bigW = base * 1.9
    const bigH = base * 2.4
    const slot = base * 1.08
    const extra = bigW - base
    const needed = Math.ceil((vw + extra) / slot) + 3
    const count = Math.ceil(needed / stories.length) * stories.length
    const focus = (vw >= 760 ? vw * 0.635 : vw * 0.5) - extra / 2
    // `align` è lo scostamento con cui un'immagine cade esattamente nel punto di fuoco
    m = { base, bigH, slot, extra, count, cycle: count * slot, focus, align: mod(focus - base / 2, slot) }
    root.style.height = `${bigH}px`
    root.style.setProperty('--big-w', `${bigW}px`)
    root.style.setProperty('--big-h', `${bigH}px`)

    if (items.length === count) return
    root.innerHTML = ''
    items = Array.from({ length: count }, (_, i) => {
      const s = stories[i % stories.length]
      const el = document.createElement('article')
      el.className = 'carousel__item'
      el.innerHTML =
        `<img src="${imageUrl(s.image)}" alt="" draggable="false">` +
        `<div class="carousel__info"><h3>${s.title}</h3><p>${s.subtitle}</p>` +
        (s.href ? `<a class="btn" href="${s.href}" tabindex="-1">Scopri la storia</a>` : '') +
        `</div>`
      root.append(el)
      return el
    })
  }

  const frame = (now) => {
    const dt = Math.min(0.05, (now - (last ?? now)) / 1000)
    last = now

    // sosta → spostamento → sosta… Con il mouse sopra la sosta non scade.
    if (phase === 'move' || !paused) t += dt
    if (phase === 'hold' && t >= HOLD) {
      phase = 'move'
      t = 0
    } else if (phase === 'move' && t >= MOVE) {
      phase = 'hold'
      t = 0
      step = (step + 1) % m.count
    }
    const pos = step + (phase === 'move' ? ease(t / MOVE) : 0)
    const offset = m.align + pos * m.slot

    const laid = items
      .map((el, i) => {
        const v = mod(offset + i * m.slot, m.cycle) - 2 * m.slot
        const w = Math.max(0, 1 - Math.abs(v + m.base / 2 - m.focus) / m.slot)
        return { el, v, w }
      })
      .sort((a, b) => a.v - b.v)

    // ogni elemento è spinto a destra dall'ingrandimento di quelli che lo precedono
    let before = 0
    for (const { el, v, w } of laid) {
      el.style.transform = `translate3d(${v + m.extra * before}px,0,0)`
      el.style.width = `${m.base + m.extra * w}px`
      el.style.height = `${m.base + (m.bigH - m.base) * w}px`
      el.style.setProperty('--w', w.toFixed(3))
      const focused = w > 0.75
      if (focused !== el.classList.contains('is-focus')) {
        el.classList.toggle('is-focus', focused)
        el.querySelector('a')?.setAttribute('tabindex', focused ? '0' : '-1')
      }
      before += w
    }
    requestAnimationFrame(frame)
  }

  root.addEventListener('pointerenter', () => (paused = true))
  root.addEventListener('pointerleave', () => (paused = false))
  root.addEventListener('focusin', () => (paused = true))
  root.addEventListener('focusout', () => (paused = false))

  build()
  new ResizeObserver(build).observe(root)
  requestAnimationFrame(frame)
}
