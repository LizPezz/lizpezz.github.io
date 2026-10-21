import { PageFlip } from 'page-flip'
import 'page-flip/src/Style/stPageFlip.css'

// Libri sfogliabili della sezione "Libri di carbone" (libreria StPageFlip, modalità HTML:
// le pagine sono <img>, nitide anche su schermi ad alta densità).
// Un clic sulla pagina di destra sfoglia avanti, sulla sinistra torna indietro;
// si può anche trascinare l'angolo. Le pagine sono in public/images/libri/<slug>/00.webp …
// (00 = copertina, l'ultima = retro).

const base = import.meta.env.BASE_URL
const PAGE_W = 1100 // misure delle immagini: servono solo per le proporzioni
const PAGE_H = 1556

const pageUrl = (slug, i) => `${base}images/libri/${slug}/${String(i).padStart(2, '0')}.webp`

export function createFlipbook(stage) {
  let book = null
  let holder = null

  // Da chiuso il libro mostra una pagina sola: lo spostiamo di un quarto per tenerlo al centro.
  const center = () => {
    if (!book) return
    const i = book.getCurrentPageIndex()
    const last = book.getPageCount() - 1
    const state = book.getOrientation() === 'portrait' ? 'open' : i === 0 ? 'cover' : i >= last ? 'back' : 'open'
    holder.dataset.state = state
  }

  return {
    show({ slug, pages, title }) {
      book?.destroy()
      holder?.remove()
      holder = document.createElement('div')
      holder.className = 'flipbook'
      holder.dataset.state = 'cover'
      const el = document.createElement('div')
      holder.append(el)
      stage.append(holder)

      const items = Array.from({ length: pages }, (_, i) => {
        const page = document.createElement('div')
        page.className = 'flipbook__page'
        // copertina e retro sono rigidi, le pagine interne si piegano
        if (i === 0 || i === pages - 1) page.dataset.density = 'hard'
        const img = document.createElement('img')
        img.src = pageUrl(slug, i)
        img.alt = i === 0 ? `${title}: copertina` : i === pages - 1 ? `${title}: retro` : `${title}: pagina ${i}`
        img.decoding = 'async'
        img.draggable = false
        page.append(img)
        return page
      })

      book = new PageFlip(el, {
        width: PAGE_W,
        height: PAGE_H,
        size: 'stretch',
        minWidth: 200, // sotto i 400px di spazio il libro mostra una pagina alla volta
        maxWidth: 1100,
        minHeight: 283,
        maxHeight: 1556,
        showCover: true,
        maxShadowOpacity: 0.45,
        flippingTime: 900,
        mobileScrollSupport: true,
      })
      book.loadFromHTML(items)
      book.on('flip', center)
      book.on('changeOrientation', center)
      center()
    },
  }
}
