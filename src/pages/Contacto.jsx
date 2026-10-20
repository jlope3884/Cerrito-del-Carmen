import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, faqs, redes } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import { useAjustes } from '../lib/datos.js'
import './pages.css'

function Faq() {
  const [abierta, setAbierta] = useState(0)
  return (
    <div className="faq" id="faq">
      {faqs.map((f, i) => {
        const activa = abierta === i
        return (
          <div key={f.p} className="faq__item">
            <button className="faq__q" onClick={() => setAbierta(activa ? -1 : i)} aria-expanded={activa}>
              {f.p}
              <span className="faq__signo" aria-hidden="true">
                {activa ? '–' : '+'}
              </span>
            </button>
            {activa && <p className="faq__r">{f.r}</p>}
          </div>
        )
      })}
    </div>
  )
}

/* Envío del formulario con Web3Forms (gratis, sin servidor propio).
   La clave va en la variable de entorno VITE_WEB3FORMS_KEY (ver .env.example).
   Los mensajes llegan al correo con el que se creó la clave. */
const CLAVE_FORMULARIO = import.meta.env.VITE_WEB3FORMS_KEY

const redesActivas = redes.filter((r) => r.url && r.url !== '#')

export default function Contacto() {
  const aj = useAjustes()
  const telHref = `tel:+502${aj.telefono.replace(/\s/g, '')}`
  const [estado, setEstado] = useState('listo') // listo | enviando | enviado | error

  async function enviar(e) {
    e.preventDefault()
    const form = e.currentTarget
    const datos = new FormData(form)
    if (datos.get('botcheck')) return // campo trampa: solo lo llenan los bots

    if (!CLAVE_FORMULARIO) {
      // Sin clave configurada: abrir el correo del visitante con el mensaje listo.
      const asunto = encodeURIComponent(`[Sitio web] ${datos.get('asunto') || 'Consulta'}`)
      const cuerpo = encodeURIComponent(`${datos.get('mensaje')}\n\n${datos.get('nombre')} · ${datos.get('correo')}`)
      window.location.href = `mailto:${aj.correo}?subject=${asunto}&body=${cuerpo}`
      return
    }

    setEstado('enviando')
    datos.append('access_key', CLAVE_FORMULARIO)
    datos.append('subject', `Sitio web · ${datos.get('asunto') || 'Consulta'}`)
    datos.append('from_name', 'Sitio web del Cerrito del Carmen')
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: datos })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      setEstado('enviado')
      form.reset()
    } catch {
      setEstado('error')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        titulo="Contacto"
        texto="¿Tienes una consulta sobre el santuario, una visita o una celebración? Escríbenos y te responderemos."
      />

      <section className="section">
        <div className="shell grid grid--2" style={{ gap: '64px' }}>
          <div>
            <TituloSeccion eyebrow="Escríbenos" titulo="Envíanos un mensaje" />
            {estado === 'enviado' ? (
              <div className="exito" role="status">
                Gracias por escribirnos. Recibimos tu mensaje; el {aj.parroco.toLowerCase()} o el equipo del
                santuario te responderán lo antes posible.
              </div>
            ) : (
              <form className="form" onSubmit={enviar}>
                <div className="form__row">
                  <label>
                    <span className="label">Nombre</span>
                    <input type="text" name="nombre" placeholder="Tu nombre" required maxLength={120} autoComplete="name" />
                  </label>
                  <label>
                    <span className="label">Correo</span>
                    <input type="email" name="correo" placeholder="tu@correo.com" required maxLength={160} autoComplete="email" />
                  </label>
                </div>
                <label>
                  <span className="label">Asunto</span>
                  <select name="asunto" defaultValue="">
                    <option value="" disabled>
                      ¿Sobre qué nos escribes?
                    </option>
                    <option>Visita al santuario</option>
                    <option>Sacramentos y celebraciones</option>
                    <option>Intenciones de misa</option>
                    <option>Donaciones</option>
                    <option>Otro</option>
                  </select>
                </label>
                <label>
                  <span className="label">Mensaje</span>
                  <textarea name="mensaje" placeholder="Escribe tu mensaje..." required maxLength={3000} />
                </label>
                <input type="checkbox" name="botcheck" className="form__trampa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <label className="form__consentimiento">
                  <input type="checkbox" name="consentimiento" value="Sí" required />
                  <span>
                    Acepto que el santuario use mis datos solo para responder este mensaje. Más información en la{' '}
                    <Link to="/privacidad">política de privacidad</Link>.
                  </span>
                </label>
                {estado === 'error' && (
                  <p className="form__error" role="alert">
                    No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a{' '}
                    <a href={`mailto:${aj.correo}`}>{aj.correo}</a>.
                  </p>
                )}
                <div>
                  <button type="submit" className="btn btn--dark" disabled={estado === 'enviando'}>
                    {estado === 'enviando' ? 'Enviando…' : 'Enviar mensaje →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div>
            <TituloSeccion eyebrow="Datos" titulo="Dónde encontrarnos" />
            <div className="datos__fila">
              <span className="label">Dirección</span>
              <p>{site.direccion}</p>
            </div>
            <div className="datos__fila">
              <span className="label">Teléfono</span>
              <p>
                <a href={telHref}>{aj.telefono}</a>
              </p>
            </div>
            <div className="datos__fila">
              <span className="label">Correo</span>
              <p>
                <a href={`mailto:${aj.correo}`}>{aj.correo}</a>
              </p>
            </div>
            <div className="datos__fila">
              <span className="label">Párroco</span>
              <p>{aj.parroco}</p>
            </div>
            {redesActivas.length > 0 && (
            <div className="datos__fila">
              <span className="label">Redes sociales</span>
              <p>
                {redesActivas.map((r, i) => (
                  <span key={r.nombre}>
                    {i > 0 && ' · '}
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-deep)' }}>
                      {r.nombre}
                    </a>
                  </span>
                ))}
              </p>
            </div>
            )}
            <p className="note" style={{ marginTop: '20px' }}>
              El santuario está al cuidado de los frailes franciscanos desde 1959.
            </p>
            <div style={{ marginTop: '28px' }}>
              <Foto src="/img/despacho-parroquial.jpg" alt="El despacho parroquial del santuario" tam="foto--md" pie="Despacho parroquial" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion eyebrow="Preguntas frecuentes" titulo="Lo que más nos preguntan" />
          <Faq />
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>Apoya al santuario</h2>
          <div>
            <Link to="/donar" className="btn btn--dark">
              Ir a donar →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
