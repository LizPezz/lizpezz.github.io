// Scroll a sezioni: una tacca di rotella porta alla sezione successiva/precedente e lì si ferma.
// Touch e tastiera usano lo scroll-snap del CSS; questo serve alla rotella del mouse, che con
// il solo CSS tornerebbe indietro se non si supera metà sezione.
// Una sezione più alta dello schermo si scorre normalmente fino al suo bordo, poi scatta.

const LOCK = 900 // ms in cui si ignorano altre tacche (anche l'inerzia del trackpad)
const EDGE = 2 // px di tolleranza sui bordi
const SLACK = 40 // se a una sezione mancano meno px di così, si salta direttamente alla successiva

export function initSnap(selector = 'main > .section') {
  const sections = [...document.querySelectorAll(selector)]
  if (!sections.length) return
  const desktop = matchMedia('(min-width: 761px)')
  let lockedUntil = 0

  // posizioni di scroll in cui la sezione riempie lo schermo: dal suo inizio alla sua fine
  const range = (s) => [s.offsetTop, Math.max(s.offsetTop, s.offsetTop + s.offsetHeight - innerHeight)]

  const jump = (top) => {
    lockedUntil = performance.now() + LOCK
    scrollTo({ top, behavior: 'smooth' })
  }

  addEventListener(
    'wheel',
    (e) => {
      if (!desktop.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const dir = Math.sign(e.deltaY)
      // sezione corrente: quella che contiene il centro dello schermo
      const middle = scrollY + innerHeight / 2
      const i = sections.findIndex((s) => s.offsetTop <= middle && s.offsetTop + s.offsetHeight > middle)
      if (i < 0 || !dir) return
      const [start, end] = range(sections[i])
      const y = scrollY
      const delta = Math.min(innerHeight, Math.abs(e.deltaY) * (e.deltaMode === 1 ? 40 : 1))

      // oltre l'ultima sezione (es. il piè di pagina): in giù scorre normalmente
      if (dir > 0 && y >= end - SLACK && !sections[i + 1]) return

      e.preventDefault()
      if (performance.now() < lockedUntil) return

      if (dir > 0) {
        if (y < end - SLACK) scrollTo({ top: Math.min(end, y + delta), behavior: 'instant' })
        else jump(sections[i + 1].offsetTop)
      } else if (y > end + EDGE) {
        jump(end)
      } else if (y > start + SLACK) {
        scrollTo({ top: Math.max(start, y - delta), behavior: 'instant' })
      } else if (sections[i - 1]) {
        jump(range(sections[i - 1])[1])
      }
    },
    { passive: false },
  )
}
