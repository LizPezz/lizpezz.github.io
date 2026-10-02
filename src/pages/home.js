import { initCommon } from '../js/common.js'
import { initCarousel } from '../js/carousel.js'
import { initContact } from '../js/contact.js'
import { imageUrl } from '../images.js'
import { stories, books } from '../data/stories.js'

initCarousel(document.querySelector('.carousel'), stories)
initContact()

// Libri di carbone: pulsanti + modello 3D (three.js viene scaricato solo quando serve)
const stage = document.querySelector('.libri__stage')
const picker = document.querySelector('.libri__picker')
picker.innerHTML = books
  .map((b, i) => `<button class="btn btn--sm" type="button" data-anim="wipe" aria-pressed="${i === 0}"><span>${b.title}</span></button>`)
  .join('')
const buttons = [...picker.children]

let viewer = null
const select = (i) => {
  buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)))
  viewer?.setBook(i)
}
buttons.forEach((b, i) => b.addEventListener('click', () => select(i)))

new IntersectionObserver(
  async ([entry], io) => {
    if (!entry.isIntersecting) return
    io.disconnect()
    const { createBookViewer } = await import('../three/book.js')
    viewer = createBookViewer(stage, books.map((b) => imageUrl(b.cover)))
    viewer.setBook(buttons.findIndex((b) => b.getAttribute('aria-pressed') === 'true'))
  },
  { rootMargin: '600px' },
).observe(stage)

initCommon()
