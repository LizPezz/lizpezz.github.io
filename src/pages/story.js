import { initCommon } from '../js/common.js'
import { initSnap } from '../js/snap.js'

// Ogni capitolo ha l'illustrazione di sfondo opaca e una parte "al 100%".
// Il layout si adatta al formato dell'immagine, per tagliarla il meno possibile:
//
//   schermo largo  · immagine orizzontale → striscia sul lato indicato da data-side
//                    (la freccia la apre a tutto schermo), oppure fascia in alto se data-side="top"
//                  · immagine verticale   → colonna laterale con l'immagine intera
//   schermo stretto· immagine orizzontale → fascia in alto con le proporzioni dell'immagine
//                  · immagine verticale   → striscia laterale, la freccia la apre a tutto schermo

const mobile = matchMedia('(max-width: 760px)')
const ARROWS = { left: '→', right: '←', top: '↓' }
const MAX_CROP = 0.15 // oltre questa parte tagliata, l'immagine aperta viene mostrata intera

document.querySelectorAll('.chapter').forEach((chapter) => {
  const img = chapter.querySelector('.chapter__bg img')
  const arrow = chapter.querySelector('.chapter__arrow')
  const side = chapter.dataset.side

  const bright = document.createElement('div')
  bright.className = 'chapter__bright'
  bright.append(img.cloneNode())
  chapter.querySelector('.chapter__bg').after(bright)

  const ratio = () => (img.naturalWidth ? img.naturalWidth / img.naturalHeight : 1.5)

  const layout = () => {
    const portrait = ratio() < 1
    const lateral = side === 'top' ? 'left' : side
    const next = mobile.matches ? (portrait ? lateral : 'top') : portrait ? lateral : side
    const column = portrait && !mobile.matches
    chapter.style.setProperty('--ratio', ratio())
    chapter.dataset.layout = next
    chapter.classList.toggle('is-column', column)
    if (next === 'top' || column) chapter.classList.remove('is-open')
    arrow.textContent = ARROWS[next]
  }
  img.addEventListener('load', layout)
  mobile.addEventListener('change', layout)
  layout()

  arrow.addEventListener('click', () => {
    if (chapter.dataset.layout === 'top') {
      chapter.querySelector('.chapter__text h2').scrollIntoView({ behavior: 'smooth' })
      return
    }
    const screen = innerWidth / innerHeight
    const cropped = 1 - Math.min(screen / ratio(), ratio() / screen)
    chapter.classList.toggle('fit-contain', cropped > MAX_CROP)
    chapter.classList.add('was-opened')
    const open = chapter.classList.toggle('is-open')
    arrow.setAttribute('aria-pressed', String(open))
  })
})

initSnap('.chapter')
initCommon()
