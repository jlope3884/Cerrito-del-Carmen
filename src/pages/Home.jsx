import { Link } from 'react-router-dom'
import { site, horarios, lineaDeTiempo } from '../data/site.js'
import { TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

const explorar = [
  {
    num: '01',
    titulo: 'Historia',
    texto: 'Del valle de las Vacas al santuario que vio nacer la capital de Guatemala.',
    to: '/historia',
  },
  {
    num: '02',
    titulo: 'La Virgen del Carmen',
    texto: 'La imagen que Juan Corz trajo desde Ávila y la promesa de santa Teresa.',
    to: '/historia#la-virgen',
  },
  {
    num: '03',
    titulo: 'Visita',
    texto: 'Horarios, misas, cómo llegar y qué ver en el cerro, su atrio y el parque.',
    to: '/visita',
  },
  {
    num: '04',
    titulo: 'Donar',
    texto: 'Apoya la conservación del santuario por transferencia o depósito.',
    to: '/donar',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__ph">
          Imagen a página completa · fachada de la ermita y torreón (foto real pendiente)
        </div>
        <div className="shell hero__inner">
          <p className="eyebrow eyebrow--light">{site.tagline}</p>
          <h1>El Cerrito del Carmen</h1>
          <p className="hero__sub">
            En la cima del cerro, el origen de la Ciudad de Guatemala.
          </p>
          <div className="hero__ctas">
            <Link to="/historia" className="btn btn--primary">
              Descubrir la historia
            </Link>
            <Link to="/visita" className="btn btn--ghost">
              Planea tu visita
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="El santuario"
            titulo="Una ermita anterior a la ciudad"
            texto="Levantada al menos cien años antes que la capital que ayudó a nacer. Consagrada a la Virgen del Carmen y declarada Patrimonio Cultural de la Nación, desde el Cerrito se trazó la Nueva Guatemala de la Asunción tras el traslado aprobado en 1775. Ha sido reconstruida después de los terremotos de 1917 y 1976."
          />
          <div className="timeline">
            {lineaDeTiempo.map((t) => (
              <div key={t.año}>
                <span className="timeline__año">{t.año}</span>
                <p className="timeline__hito">{t.hito}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Recorre el Cerrito"
            titulo="Cuatro maneras de conocerlo"
          />
          <div className="grid grid--4">
            {explorar.map((e) => (
              <Link key={e.num} to={e.to} className="explorar__card">
                <span className="explorar__num">{e.num}</span>
                <h3>{e.titulo}</h3>
                <p>{e.texto}</p>
                <span className="explorar__más">Explorar →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cita">
        <div className="shell">
          <span className="cita__marca">“</span>
          <p className="quote">
            Donde fuera venerada la imagen surgiría una gran ciudad.
          </p>
          <span className="cita__fuente">
            Según la tradición, palabras de santa Teresa de Jesús
          </span>
        </div>
      </section>

      <section className="section">
        <div className="shell grid grid--2" style={{ alignItems: 'center' }}>
          <div className="stack stack--md">
            <TituloSeccion
              eyebrow="Antes de subir al Cerrito"
              titulo="Planea tu visita"
              texto={`El santuario se encuentra en la cima del cerro del Carmen, en el Centro Histórico. Se sube por el atrio empedrado, junto al torreón y las cuatro capillas de la plazuela.`}
            />
            <p className="note">
              {horarios.visita} · Entrada gratuita · Parqueo gratuito
            </p>
            <div className="hero__ctas">
              <Link to="/visita" className="btn btn--dark">
                Cómo llegar
              </Link>
              <Link to="/visita#misas" className="btn btn--ghost" style={{ color: 'var(--gold-deep)', borderColor: 'var(--gold-deep)' }}>
                Horarios de misa
              </Link>
            </div>
          </div>
          <Foto alto="ph--wide">
            Mapa del cerro del Carmen, Centro Histórico (se enlaza con Google Maps)
          </Foto>
        </div>
      </section>
    </>
  )
}
