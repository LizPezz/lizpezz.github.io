const base = import.meta.env.BASE_URL

// Racconti del carosello "Racconti di carbone".
// `href: null` = racconto non ancora pubblicato (il pulsante non viene mostrato).
export const stories = [
  {
    image: 'racconto-wyder',
    title: 'Wyder,<br>il guardiano<br>del faro',
    subtitle: 'Concept art e storyboard',
    href: base + 'racconti/wyder.html',
  },
  { image: 'racconto-2', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
  { image: 'racconto-3', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
  { image: 'racconto-4', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
  { image: 'racconto-5', title: 'Titolo<br>del racconto', subtitle: 'Descrizione del racconto', href: null },
]

// Libri della sezione "Libri di carbone" (copertina mostrata sul modello 3D).
export const books = [
  { title: 'Assaporando il viaggio', cover: 'libro-assaporando' },
  { title: 'Il mio elefante e’ leggero', cover: 'libro-elefante' },
  { title: 'Storia di un formicaio', cover: 'libro-formicaio' },
]
