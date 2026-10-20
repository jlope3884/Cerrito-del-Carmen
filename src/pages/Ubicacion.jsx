import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site, comoLlegar, referencias } from '../data/site.js'
import { PageHero, TituloSeccion, Foto, Siguiente } from '../components/Bits.jsx'
import { useAjustes } from '../lib/datos.js'
import { telHref } from '../lib/texto.js'
import './pages.css'

const MAPA_EMBED =
  'https://www.google.com/maps?q=Iglesia+Cerrito+del+Carmen,+Ciudad+de+Guatemala&output=embed&hl=es&z=16'
const MAPA_ENLACE = 'https://maps.google.com/?q=Cerrito+del+Carmen+Guatemala'

export default function Ubicacion() {
  const aj = useAjustes()
  // El mapa de Google pesa más de 1 MB y pone cookies: se carga solo si el visitante lo pide.
  const [verMapa, setVerMapa] = useState(false)
  const iframe = useRef(null)
  // El botón desaparece al abrir el mapa: el foco pasa al mapa para no perderse.
  useEffect(() => {
    if (verMapa) iframe.current?.focus()
  }, [verMapa])
  return (
    <>
      <PageHero
        eyebrow="Ubicación"
        titulo="Cómo llegar"
        texto="El santuario se encuentra en la cima del cerro del Carmen, en el Centro Histórico de la Ciudad de Guatemala."
      />

      <section className="section section--tight" id="mapa">
        <div className="shell">
          <div className="mapa">
            {verMapa ? (
              <iframe
                ref={iframe}
                title="Mapa del Cerrito del Carmen"
                src={MAPA_EMBED}
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="mapa__fachada">
                <p className="eyebrow">Mapa</p>
                <p className="mapa__dir">{site.direccion}</p>
                <p className="mapa__nota">En la cima del cerro del Carmen, Centro Histórico.</p>
                <div className="mapa__acciones">
                  <button type="button" className="btn btn--dark" onClick={() => setVerMapa(true)}>
                    Ver mapa interactivo
                  </button>
                  <a className="btn btn--ghost-dark" href={MAPA_ENLACE} target="_blank" rel="noreferrer">
                    Abrir en Google Maps
                    <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
                  </a>
                </div>
                <p className="mapa__aviso">El mapa interactivo lo sirve Google y puede guardar cookies.</p>
              </div>
            )}
          </div>
          <div className="grid grid--3" style={{ marginTop: '24px' }}>
            <Foto src="/img/fachada-torreon-empedrado.jpg" alt="La fachada y el torreón desde el empedrado" tam="foto--md" pie="Al llegar: el atrio" />
            <Foto src="/img/torreon-poste.jpg" alt="El torreón al atardecer" tam="foto--md" pie="El torreón, punto de referencia" />
            <Foto src="/img/fuente-parque.jpg" alt="La fuente del parque del cerro" tam="foto--md" pie="La fuente del parque" />
          </div>
        </div>
      </section>

      <section className="section" id="como-llegar">
        <div className="shell">
          <TituloSeccion eyebrow="Datos prácticos" titulo="Dónde está y cómo llegar" />
          <div className="grid grid--4">
            {comoLlegar.map((c) => (
              <div key={c.titulo} className="card">
                <span className="label">{c.label}</span>
                <h3>{c.titulo}</h3>
                <p>{c.texto}</p>
              </div>
            ))}
          </div>
          <div className="hero__ctas" style={{ marginTop: '32px' }}>
            <a className="btn btn--dark" href={MAPA_ENLACE} target="_blank" rel="noreferrer">
              Abrir en Google Maps
              <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
            </a>
            <Link to="/visita" className="btn btn--ghost-dark">
              Horarios y recomendaciones
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Puntos de referencia"
            titulo="Qué hay alrededor"
            texto="El cerro está rodeado por el parque y el barrio del Cerrito, en pleno casco antiguo."
          />
          <div className="grid grid--3">
            {referencias.map((r) => (
              <div key={r.titulo} className="card">
                <h3>{r.titulo}</h3>
                <p>{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell stack stack--md">
          <p className="eyebrow eyebrow--light">Dirección</p>
          <p className="quote">{site.direccion}</p>
          <p className="lead">
            Teléfono <a href={telHref(aj.telefono)}>{aj.telefono}</a> ·{' '}
            <a href={`mailto:${aj.correo}`}>{aj.correo}</a>
          </p>
        </div>
      </section>

      <Siguiente titulo="Contacto" to="/contacto">
        Ir a contacto
      </Siguiente>
    </>
  )
}
