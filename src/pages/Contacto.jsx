import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, faqs, redes } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
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

export default function Contacto() {
  const [enviado, setEnviado] = useState(false)

  function enviar(e) {
    e.preventDefault()
    // Demo: aquí se conectaría el envío real (correo de la parroquia o backend).
    setEnviado(true)
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
            {enviado ? (
              <div className="exito">
                Gracias por escribirnos. Recibimos tu mensaje; el padre Edwin Muñoz o el equipo del
                santuario te responderán lo antes posible.
              </div>
            ) : (
              <form className="form" onSubmit={enviar}>
                <div className="form__row">
                  <label>
                    <span className="label">Nombre</span>
                    <input type="text" name="nombre" placeholder="Tu nombre" required />
                  </label>
                  <label>
                    <span className="label">Correo</span>
                    <input type="email" name="correo" placeholder="tu@correo.com" required />
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
                  <textarea name="mensaje" placeholder="Escribe tu mensaje..." required />
                </label>
                <div>
                  <button type="submit" className="btn btn--dark">
                    Enviar mensaje →
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
              <p>{site.telefono}</p>
            </div>
            <div className="datos__fila">
              <span className="label">Correo</span>
              <p>{site.correo}</p>
            </div>
            <div className="datos__fila">
              <span className="label">Párroco</span>
              <p>{site.parroco}</p>
            </div>
            <div className="datos__fila">
              <span className="label">Redes sociales</span>
              <p>
                {redes.map((r, i) => (
                  <span key={r.nombre}>
                    {i > 0 && ' · '}
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--gold-deep)' }}>
                      {r.nombre}
                    </a>
                  </span>
                ))}
              </p>
            </div>
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
