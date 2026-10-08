import { Link } from 'react-router-dom'
import { site, comoLlegar, referencias } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

export default function Ubicacion() {
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
            <iframe
              title="Mapa del Cerrito del Carmen"
              src="https://www.google.com/maps?q=Iglesia+Cerrito+del+Carmen,+Ciudad+de+Guatemala&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
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
            <a
              className="btn btn--dark"
              href="https://maps.google.com/?q=Cerrito+del+Carmen+Guatemala"
              target="_blank"
              rel="noreferrer"
            >
              Abrir en Google Maps
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
            Teléfono {site.telefono} · {site.correo}
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>Contacto</h2>
          <div>
            <Link to="/contacto" className="btn btn--dark">
              Ir a contacto →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
