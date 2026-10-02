import { initCommon } from '../js/common.js'

// Ogni capitolo ha l'illustrazione di sfondo opaca e una striscia "al 100%".
// La freccia allarga la striscia fino a mostrare l'illustrazione intera (e viceversa).
document.querySelectorAll('.chapter').forEach((chapter) => {
  const bright = document.createElement('div')
  bright.className = 'chapter__bright'
  bright.append(chapter.querySelector('.chapter__bg img').cloneNode())
  chapter.querySelector('.chapter__bg').after(bright)

  const arrow = chapter.querySelector('.chapter__arrow')
  arrow.addEventListener('click', () => {
    chapter.classList.add('was-opened')
    const open = chapter.classList.toggle('is-open')
    arrow.setAttribute('aria-pressed', String(open))
  })
})

initCommon()
