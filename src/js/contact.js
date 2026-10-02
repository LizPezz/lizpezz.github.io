import { faArtstation, faInstagram, faKickstarterK, faLinkedinIn, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { site } from '../config.js'

const icons = {
  artstation: faArtstation,
  linkedin: faLinkedinIn,
  kickstarter: faKickstarterK,
  tiktok: faTiktok,
  instagram: faInstagram,
}

function iconSvg(name) {
  const [w, h, , , path] = icons[name].icon
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${path}"/></svg>`
}

export function initContact() {
  const form = document.getElementById('contact-form')
  if (!form) return
  const status = form.querySelector('.form__status')

  form.querySelector('select[name="oggetto"]').append(
    ...site.subjects.map((s) => Object.assign(document.createElement('option'), { textContent: s })),
  )

  document.querySelector('.socials').innerHTML = site.socials
    .map((s) => `<a href="${s.href}" aria-label="${s.name}" title="${s.name}" style="--c:${s.color}">${iconSvg(s.icon)}</a>`)
    .join('')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = new FormData(form)

    if (site.formEndpoint) {
      status.textContent = 'Invio in corso…'
      try {
        const res = await fetch(site.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(res.statusText)
        form.reset()
        status.textContent = 'Grazie! Ti risponderò entro una settimana.'
      } catch {
        status.textContent = 'Invio non riuscito, riprova più tardi.'
      }
    } else if (site.email) {
      const body = `${data.get('richiesta')}\n\n${data.get('nome')} — ${data.get('email')}`
      location.href = `mailto:${site.email}?subject=${encodeURIComponent(data.get('oggetto'))}&body=${encodeURIComponent(body)}`
    } else {
      status.textContent = 'Modulo non ancora collegato: imposta formEndpoint o email in src/config.js.'
    }
  })
}
