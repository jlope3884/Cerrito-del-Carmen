import { Link } from 'react-router-dom'
import { capitulos, laVirgen, actualidad } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

function Capitulo({ c, conFoto }) {
  return (
    <article className="capitulo">
      <span className="capitulo__num">{c.num}</span>
      <div>
        <span className="capitulo__epoca">{c.epoca}</span>
        <h3 style={{ fontSize: '1.6rem' }}>{c.titulo}</h3>
        <p>{c.texto}</p>
      </div>
      {conFoto ? (
        <Foto>Imagen · {c.titulo.toLowerCase()} (foto real pendiente)</Foto>
      ) : (
        <div />
      )}
    </article>
  )
}

export default function Historia() {
  return (
    <>
      <PageHero
        eyebrow="Historia"
        titulo="La historia del Cerrito"
        texto="Del valle de las Vacas al santuario que vio nacer la Ciudad de Guatemala: más de cuatro siglos de fe, incendios, terremotos y reconstrucción."
      />

      <section className="section section--tight">
        <div className="shell">
          <Foto alto="ph--wide">
            Fotografía histórica a todo el ancho · ruinas del Cerrito tras los terremotos de
            1917-18 (imagen real pendiente)
          </Foto>
        </div>
      </section>

      {/* ---------- I · El pasado ---------- */}
      <section className="section parte" id="el-pasado">
        <div className="shell">
          <TituloSeccion
            eyebrow="Primera parte · El pasado"
            titulo="El pasado"
            texto="Del valle de las Vacas a la ermita que vio nacer la Nueva Guatemala de la Asunción."
          />
          {capitulos.map((c, i) => (
            <Capitulo key={c.num} c={c} conFoto={i % 2 === 1} />
          ))}
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell stack stack--md">
          <p className="eyebrow eyebrow--light">Importancia histórica</p>
          <p className="quote">
            En 1875, Eadweard Muybridge fotografió la Ciudad de Guatemala en panorámicas
            tomadas desde el Cerrito del Carmen.
          </p>
        </div>
      </section>

      {/* ---------- II · La Virgen ---------- */}
      <section className="section parte" id="la-virgen">
        <div className="shell">
          <TituloSeccion
            eyebrow="Segunda parte · La Virgen"
            titulo="La Virgen del Carmen"
            texto="La pequeña imagen que Juan Corz trajo desde Ávila y alrededor de la cual creció la Ciudad de Guatemala."
          />
          <p className="lead" style={{ maxWidth: '78ch', marginBottom: '40px' }}>
            Es una talla pequeña de madera de cedro vestida con el hábito carmelita. Llegó al
            valle de las Vacas en manos de un ermitaño y, cuatro siglos después, sigue siendo
            el centro de la devoción mariana más antigua de la ciudad.
          </p>

          <div className="grid grid--3" style={{ marginBottom: '32px' }}>
            {laVirgen.map((d) => (
              <div key={d.titulo} className="card">
                <h3>{d.titulo}</h3>
                <p>{d.texto}</p>
              </div>
            ))}
          </div>

          <div className="grid grid--3">
            <Foto>Imagen · la Virgen del Carmen en su camarín (foto real pendiente)</Foto>
            <Foto>Imagen · la imagen vestida para la fiesta patronal (foto real pendiente)</Foto>
            <Foto>Imagen · detalle de la talla y el escapulario (foto real pendiente)</Foto>
          </div>
        </div>
      </section>

      {/* ---------- III · Actualidad ---------- */}
      <section className="section parte" id="actualidad">
        <div className="shell">
          <TituloSeccion
            eyebrow="Tercera parte · Actualidad"
            titulo="El Cerrito hoy"
            texto="La fiesta patronal, la feria y las leyendas que mantienen vivo el cerro en la memoria de la ciudad."
          />
          <div className="grid grid--2">
            {actualidad.map((b) => (
              <div key={b.titulo} className="card" style={{ padding: '32px' }}>
                <p className="eyebrow" style={{ marginBottom: '12px' }}>
                  {b.eyebrow}
                </p>
                <h3 style={{ fontSize: '1.7rem', marginBottom: '14px' }}>{b.titulo}</h3>
                {b.parrafos.map((p, i) => (
                  <p key={i} style={{ marginTop: i ? '14px' : 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid grid--2" style={{ marginTop: '24px' }}>
            <Foto>Imagen · la feria del Cerrito en la avenida Juan Chapín (foto real pendiente)</Foto>
            <Foto>Imagen · la procesión del 16 de julio (foto real pendiente)</Foto>
          </div>

          <p className="quote" style={{ color: 'var(--muted)', marginTop: '36px', fontSize: '1.3rem' }}>
            El santuario está al cuidado de los frailes franciscanos desde 1959 y hoy lo
            atiende el padre Edwin Muñoz.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>Planea tu visita</h2>
          <div>
            <Link to="/visita" className="btn btn--dark">
              Ir a visita →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
