import { Link } from 'react-router-dom'
import { site, horarios, sacramentos, agenda } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

export default function Celebraciones() {
  return (
    <>
      <PageHero
        eyebrow="Celebraciones"
        titulo="Planifica tu celebración religiosa"
        texto="Bautizos, primeras comuniones, confirmaciones y matrimonios en el santuario mariano más antiguo de la ciudad, además de la fiesta patronal de la Virgen del Carmen."
      />

      <section className="section" id="sacramentos">
        <div className="shell">
          <TituloSeccion
            eyebrow="Sacramentos"
            titulo="Celebrar en el Cerrito"
            texto="Para cualquiera de los sacramentos, acércate a la sacristía o escríbenos: la parroquia confirma la fecha y te indica los requisitos."
          />
          <div className="grid grid--3">
            {sacramentos.map((s) => (
              <div key={s.nombre} className="card">
                <h3>{s.nombre}</h3>
                <p>{s.requisitos}</p>
              </div>
            ))}
          </div>
          <div className="grid grid--3" style={{ marginTop: '32px' }}>
            <Foto src="/img/nave-boda.jpg" alt="La nave con alfombra roja y bancas decoradas para una boda" tam="foto--lg" pie="Matrimonio" />
            <Foto src="/img/boda-novia.jpg" alt="Ramo de novia junto al muro blanco del templo" tam="foto--lg" pie="Una boda en el Cerrito" />
            <Foto src="/img/puerta-arco-flores.jpg" alt="Arco de flores en la puerta del templo" tam="foto--lg" pos="center 12%" pie="La puerta del santuario" />
          </div>
          <div className="hero__ctas" style={{ marginTop: '32px' }}>
            <Link to="/contacto" className="btn btn--dark">
              Solicitar una celebración
            </Link>
            <a href={`tel:${site.telefono.replace(/\s/g, '')}`} className="btn btn--ghost-dark">
              Llamar al {site.telefono}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="misas">
        <div className="shell">
          <TituloSeccion eyebrow="Horarios de misa" titulo="Misas en el santuario" />
          <div className="grid grid--3">
            {horarios.misas.map((m) => (
              <div key={m.dias} className="card horario">
                <span className="label">{m.dias}</span>
                <span className="horario__hora">{m.hora}</span>
                <p>{m.detalle}</p>
              </div>
            ))}
          </div>
          <p className="note" style={{ marginTop: '22px' }}>
            {horarios.aviso}
          </p>
          <div className="grid grid--2" style={{ marginTop: '32px' }}>
            <Foto src="/img/misa-fieles.jpg" alt="Fieles en misa con el altar de fiesta al fondo" tam="foto--lg" pos="center 35%" pie="Misa de fiesta" />
            <Foto src="/img/cuaresma-nazareno.jpg" alt="El Nazareno frente al templo iluminado en morado" tam="foto--lg" pie="Cuaresma en el Cerrito" />
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell grid grid--2" style={{ alignItems: 'center' }}>
          <div className="stack stack--md">
            <p className="eyebrow eyebrow--light">La fiesta patronal</p>
            <h2>16 de julio</h2>
            <p className="lead">
              La celebración principal del santuario. El 16 de julio se celebran las misas solemnes en honor
              a la Virgen del Carmen y el sábado siguiente la imagen sale en procesión por el Centro
              Histórico, acompañada por bandas escolares. Alrededor de la fiesta, la feria del Cerrito llena
              la avenida Juan Chapín durante dos semanas.
            </p>
          </div>
          <Foto src="/img/procesion-anda.jpg" alt="El anda de la Virgen del Carmen en procesión con flores" tam="foto--lg" pie="Procesión de la Virgen del Carmen" />
        </div>
      </section>

      <section className="section" id="agenda">
        <div className="shell">
          <TituloSeccion
            eyebrow="Agenda"
            titulo="Calendario de celebraciones"
            texto="Fechas de referencia de la celebración anual. El programa detallado de cada año lo publica el santuario."
          />
          {agenda.map((a) => (
            <div key={a.tipo} className="agenda__fila">
              <div>
                <span className="agenda__dia">{a.dia}</span>
                <span className="agenda__cuando">{a.cuando}</span>
              </div>
              <div>
                <span className="agenda__tipo">{a.tipo}</span>
                <span className="agenda__titulo">{a.titulo}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>Cómo llegar al santuario</h2>
          <div>
            <Link to="/ubicacion" className="btn btn--dark">
              Ir a ubicación →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
