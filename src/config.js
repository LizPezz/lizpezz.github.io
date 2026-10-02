// Impostazioni del sito da completare quando arrivano i dati reali.

export const site = {
  // Modulo contatti. GitHub Pages è statico: serve un servizio esterno (es. Formspree, Web3Forms).
  // Incolla qui l'URL dell'endpoint; se resta vuoto si usa `email` (apre il client di posta).
  formEndpoint: '',
  email: '',

  // Opzioni del menu a tendina "OGGETTO"
  subjects: [
    'Racconti di carbone — una storia illustrata',
    'Libri di carbone — informazioni sui libri',
    'Il mio racconto — sostenere il progetto',
    'Altro',
  ],

  // Canali social: `icon` è il nome dell'icona (vedi src/js/contact.js), `color` lo sfondo del cerchio.
  socials: [
    { name: 'ArtStation', icon: 'artstation', color: '#111', href: '#' },
    { name: 'LinkedIn', icon: 'linkedin', color: '#0a66c2', href: '#' },
    { name: 'Kickstarter', icon: 'kickstarter', color: '#05ce78', href: '#' },
    { name: 'TikTok', icon: 'tiktok', color: '#111', href: '#' },
    {
      name: 'Instagram',
      icon: 'instagram',
      color: 'linear-gradient(45deg, #f9ce34, #ee2a7b 50%, #6228d7)',
      href: '#',
    },
  ],
}
