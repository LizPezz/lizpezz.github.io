import { PageFlip } from 'page-flip'
import 'page-flip/src/Style/stPageFlip.css'

// Libri sfogliabili della sezione "Libri di carbone" (libreria StPageFlip, modalità HTML:
// le pagine sono <img>, nitide anche su schermi ad alta densità).
// Un clic sulla pagina di destra sfoglia avanti, sulla sinistra torna indietro;
// si può anche trascinare l'angolo. Le pagine sono in public/images/libri/<slug>/00.webp …
// (00 = copertina, l'ultima = retro).
// "Ingrandisci" apre lo stesso libro a tutto schermo (<dialog>), alla pagina a cui si era arrivati.

const base = import.meta.env.BASE_URL
const PAGE_W = 1100 // misure delle immagini: servono solo per le proporzioni
const PAGE_H = 1556

const pageUrl = (slug, i) => `${base}images/libri/${slug}/${String(i).padStart(2, '0')}.webp`

// Crea un libro dentro `parent`, aperto alla pagina `startPage`.
function mount(parent, { slug, pages, title }, startPage = 0) {
  const holder = document.createElement('div')
  holder.className = 'flipbook'
  const el = document.createElement('div')
  holder.append(el)
  parent.append(holder)

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

  const pf = new PageFlip(el, {
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
    startPage,
  })
  pf.loadFromHTML(items)

  // Da chiuso il libro mostra una pagina sola: lo spostiamo di un quarto per tenerlo al centro.
  const center = () => {
    const i = pf.getCurrentPageIndex()
    const last = pf.getPageCount() - 1
    holder.dataset.state = pf.getOrientation() === 'portrait' ? 'open' : i === 0 ? 'cover' : i >= last ? 'back' : 'open'
  }
  pf.on('flip', center)
  pf.on('changeOrientation', center)
  center()

  return {
    pf,
    holder,
    goTo(i) {
      pf.turnToPage(i)
      center()
    },
    destroy() {
      pf.destroy()
      holder.remove()
    },
  }
}

// Finestra a tutto schermo con il libro grande
function createViewer() {
  const dialog = document.createElement('dialog')
  dialog.className = 'book-view'
  dialog.innerHTML = `
    <button class="book-view__close" type="button" aria-label="Chiudi">×</button>
    <div class="book-view__stage"></div>
    <p class="book-view__hint">
      <span class="for-mouse">Clicca sulle pagine o usa le frecce ← → della tastiera</span>
      <span class="for-touch">Tocca le pagine per sfogliarle</span>
    </p>`
  document.body.append(dialog)
  const stage = dialog.querySelector('.book-view__stage')
  dialog.querySelector('.book-view__close').addEventListener('click', () => dialog.close())
  // clic sullo sfondo scuro (fuori dal libro) = chiudi
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target === stage) dialog.close()
  })
  let big = null
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') big?.pf.flipNext()
    if (e.key === 'ArrowLeft') big?.pf.flipPrev()
  })

  return {
    open(book, page, onClose) {
      dialog.setAttribute('aria-label', book.title)
      dialog.showModal()
      big = mount(stage, book, page) // dopo showModal: il libro misura lo spazio che ha
      dialog.addEventListener(
        'close',
        () => {
          const i = big.pf.getCurrentPageIndex()
          big.destroy()
          big = null
          onClose(i)
        },
        { once: true },
      )
    },
  }
}

export function createFlipbook(stage) {
  let small = null
  let current = null
  let viewer = null

  return {
    show(book) {
      // Se la sezione è già sullo schermo (cambio di libro, o arrivo diretto dal menu) il libro
      // entra con l'animazione; altrimenti l'entrata la fa il CSS quando la sezione arriva.
      const visible = stage.classList.contains('is-in')
      small?.destroy()
      current = book
      small = mount(stage, book)
      if (visible) small.holder.classList.add('is-swapping')
    },
    enlarge() {
      if (!small) return
      viewer ??= createViewer()
      viewer.open(current, small.pf.getCurrentPageIndex(), (i) => small.goTo(i))
    },
  }
}
