import { imageUrl } from '../images.js'

// Carosello "Racconti di carbone": le immagini scorrono da sinistra a destra.
// Quella che arriva nel terzo quadrante (a destra del centro) si ingrandisce, lascia
// comparire titolo, descrizione e pulsante, e resta ferma HOLD secondi prima di ripartire.
// Si può anche muovere a mano: frecce sotto il carosello oppure trascinamento / swipe.

const HOLD = 1.5 // secondi di sosta su ogni racconto
const MOVE = 1.6 // secondi per passare al racconto successivo
const MOVE_MANUAL = 0.6 // …quando lo si muove a mano
const SWIPE = 40 // px di trascinamento per cambiare racconto
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mod = (v, m) => ((v % m) + m) % m
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

export function initCarousel(root, stories) {
  let items = []
  let m = null // misure correnti
  let from = 0 // posizione (in racconti) da cui parte lo spostamento in corso
  let to = 0 // posizione di arrivo; da fermo coincide con `from`
  let duration = MOVE
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

  const position = () => (phase === 'move' ? from + (to - from) * ease(Math.min(1, t / duration)) : from)

  // sposta di un racconto: +1 verso destra (come lo scorrimento automatico), -1 verso sinistra
  const move = (dir, seconds) => {
    const target = (phase === 'move' ? to : from) + dir
    from = position()
    to = target
    duration = seconds
    phase = 'move'
    t = 0
  }

  const frame = (now) => {
    const dt = Math.min(0.05, (now - (last ?? now)) / 1000)
    last = now

    // sosta → spostamento → sosta… Con il mouse sopra la sosta non scade.
    if (phase === 'move' || !paused) t += dt
    if (phase === 'hold' && t >= HOLD) {
      move(1, MOVE)
    } else if (phase === 'move' && t >= duration) {
      phase = 'hold'
      t = 0
      from = to = mod(to, m.count)
    }
    const offset = m.align + position() * m.slot

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

  // frecce
  const controls = document.createElement('div')
  controls.className = 'carousel__controls'
  for (const [dir, arrow, label] of [
    [-1, '←', 'Racconto precedente'],
    [1, '→', 'Racconto successivo'],
  ]) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = arrow
    button.setAttribute('aria-label', label)
    button.addEventListener('click', () => move(dir, MOVE_MANUAL))
    controls.append(button)
  }
  root.after(controls)

  // trascinamento / swipe: il carosello segue la direzione del gesto
  let dragX = null
  let dragged = false
  root.addEventListener('pointerdown', (e) => {
    dragX = e.clientX
    dragged = false
  })
  root.addEventListener('pointerup', (e) => {
    if (dragX === null) return
    const dx = e.clientX - dragX
    dragX = null
    if (Math.abs(dx) < SWIPE) return
    dragged = true
    move(Math.sign(dx), MOVE_MANUAL)
  })
  root.addEventListener('pointercancel', () => (dragX = null))
  // un trascinamento partito sul pulsante non deve aprire il racconto
  root.addEventListener(
    'click',
    (e) => {
      if (dragged) e.preventDefault()
      dragged = false
    },
    true,
  )

  for (const el of [root, controls]) {
    el.addEventListener('pointerenter', () => (paused = true))
    el.addEventListener('pointerleave', () => (paused = false))
    el.addEventListener('focusin', () => (paused = true))
    el.addEventListener('focusout', () => (paused = false))
  }

  build()
  new ResizeObserver(build).observe(root)
  requestAnimationFrame(frame)
}
