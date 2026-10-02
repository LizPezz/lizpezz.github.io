// Scroll a sezioni: una tacca di rotella porta alla sezione successiva/precedente e lì si ferma.
// Touch e tastiera usano lo scroll-snap del CSS; questo serve alla rotella del mouse, che con
// il solo CSS tornerebbe indietro se non si supera metà sezione.

const LOCK = 900 // ms in cui si ignorano altre tacche (anche l'inerzia del trackpad)

export function initSnap() {
  const sections = [...document.querySelectorAll('main > .section')]
  if (!sections.length) return
  const desktop = matchMedia('(min-width: 761px)')
  let lockedUntil = 0

  addEventListener(
    'wheel',
    (e) => {
      if (!desktop.matches || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const dir = Math.sign(e.deltaY)
      const vh = innerHeight
      // sezione corrente: quella che contiene il centro dello schermo
      const i = sections.findIndex((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= vh / 2 && r.bottom > vh / 2
      })
      if (i < 0 || !dir) return
      const rect = sections[i].getBoundingClientRect()
      // sezione più alta dello schermo: prima si scorre normalmente fino al suo bordo
      if (dir > 0 ? rect.bottom > vh + 2 : rect.top < -2) return
      const target = sections[i + dir]
      if (!target) return

      e.preventDefault()
      if (performance.now() < lockedUntil) return
      lockedUntil = performance.now() + LOCK
      const top = dir > 0 ? target.offsetTop : target.offsetTop + target.offsetHeight - vh
      scrollTo({ top, behavior: 'smooth' })
    },
    { passive: false },
  )
}
