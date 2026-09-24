import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site, horarios, queVer, recomendaciones, faqs } from '../data/site.js'
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
            <button
              className="faq__q"
              onClick={() => setAbierta(activa ? -1 : i)}
              aria-expanded={activa}
            >
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

export default function Visita() {
  return (
    <>
      <PageHero
        eyebrow="Visita"
        titulo="Planea tu visita"
        texto="El santuario se alza en la cima del cerro del Carmen, en el Centro Histórico. Sube por el atrio empedrado, entre el torreón «la Redonda» y las cuatro capillas de la plazuela."
      />

      <section className="section">
        <div className="shell">
          <div className="grid grid--4">
            <div className="card">
              <span className="label">Horario</span>
              <h3>Horario de visita</h3>
              <p>{horarios.visita}</p>
            </div>
            <div className="card">
              <span className="label">Entrada</span>
              <h3>Tarifa de ingreso</h3>
              <p>Entrada gratuita.</p>
            </div>
            <div className="card">
              <span className="label">Cómo llegar</span>
              <h3>Ubicación</h3>
              <p>{site.direccion}. Parqueo gratuito para visitantes.</p>
            </div>
            <div className="card">
              <span className="label">Accesibilidad</span>
              <h3>Acceso</h3>
              <p>
                Se llega por el atrio empedrado y algunas gradas. Si necesitas apoyo para el
                acceso, escríbenos antes de tu visita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Misas ---------- */}
      <section className="section" id="misas">
        <div className="shell">
          <TituloSeccion
            eyebrow="Horarios de misa"
            titulo="Misas en el santuario"
            texto="El Cerrito es un santuario activo: además de visitarlo, puedes participar en sus celebraciones."
          />
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
        </div>
      </section>

      {/* ---------- Qué ver ---------- */}
      <section className="section" id="que-ver">
        <div className="shell">
          <TituloSeccion
            eyebrow="Qué ver"
            titulo="Qué ver en el Cerrito"
            texto="El conjunto declarado patrimonio incluye el templo, el torreón, las capillas de la plazuela y el parque que corona el cerro."
          />
          <div className="grid grid--3">
            {queVer.map((q) => (
              <div key={q.titulo} className="card">
                <h3>{q.titulo}</h3>
                <p>{q.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell grid grid--2" style={{ alignItems: 'center' }}>
          <div className="stack stack--md">
            <p className="eyebrow eyebrow--light">Naturaleza y vistas</p>
            <h2>El parque y la Plaza México</h2>
            <p className="lead">
              El santuario corona un cerro arbolado en el corazón de la ciudad. Abajo, el
              parque y la Plaza México son punto de encuentro del barrio, y desde la cima se
              abren las panorámicas sobre la Ciudad de Guatemala que Muybridge fotografió en
              1875. En el área del parque están también los servicios sanitarios.
            </p>
          </div>
          <Foto alto="ph--wide">
            Imagen · el parque, la Plaza México y la ladera del cerro (foto real pendiente)
          </Foto>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion eyebrow="Recomendaciones" titulo="Antes de subir" />
          <div className="grid grid--4">
            {recomendaciones.map((r, i) => (
              <div key={r} className="stack stack--sm">
                <span className="explorar__num">0{i + 1}</span>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Preguntas frecuentes"
            titulo="Lo que más nos preguntan"
          />
          <Faq />
          <p className="note" style={{ marginTop: '26px' }}>
            ¿Te quedó alguna duda? Escríbenos a {site.correo} o llama al {site.telefono}.
          </p>
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
