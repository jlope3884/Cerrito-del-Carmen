import { Link } from 'react-router-dom'
import { capitulos, laVirgen, actualidad, fotosVirgen, documentosReconstruccion } from '../data/site.js'
import Documentos from '../components/Documentos.jsx'
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
      {conFoto ? <Foto src={c.img} alt={c.alt} tam="foto--md" /> : <div />}
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
          <div className="grid grid--3">
            <Foto src="/img/torreon-puerta-noche.jpg" alt="El torreón visto a través de la puerta tallada del templo, de noche" tam="foto--lg" pie="El torreón desde la puerta" />
            <Foto src="/img/costado-cruz-noche.jpg" alt="Costado del templo y la cruz al anochecer" tam="foto--lg" pie="El atrio al anochecer" />
            <Foto src="/img/silueta-torres.jpg" alt="Silueta de las torres y la cruz al atardecer" tam="foto--lg" pie="Las torres al atardecer" />
          </div>
        </div>
      </section>

      <section className="section parte" id="el-pasado">
        <div className="shell">
          <TituloSeccion
            eyebrow="Primera parte · El pasado"
            titulo="El pasado"
            texto="Del valle de las Vacas a la ermita que vio nacer la Nueva Guatemala de la Asunción."
          />
          {capitulos.map((c, i) => (
            <Capitulo key={c.num} c={c} conFoto={!!c.img || i % 2 === 1} />
          ))}
        </div>
      </section>

      <section className="section" id="reconstruccion" style={{ paddingTop: 0 }}>
        <div className="shell">
          <TituloSeccion
            eyebrow="Archivo · La reconstrucción"
            titulo="La reconstrucción en documentos"
            texto="Fotografías, croquis, planos y recortes que cuentan cómo el Cerrito se levantó después de los terremotos. Haz clic en cada documento para verlo completo."
          />
          <Documentos items={documentosReconstruccion} />
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell stack stack--md">
          <p className="eyebrow eyebrow--light">Importancia histórica</p>
          <p className="quote">
            En 1875, Eadweard Muybridge fotografió la Ciudad de Guatemala en panorámicas tomadas desde el
            Cerrito del Carmen.
          </p>
        </div>
      </section>

      <section className="section parte" id="la-virgen">
        <div className="shell">
          <TituloSeccion
            eyebrow="Segunda parte · La Virgen"
            titulo="La Virgen del Carmen"
            texto="La pequeña imagen que Juan Corz trajo desde Ávila y alrededor de la cual creció la Ciudad de Guatemala."
          />
          <p className="lead" style={{ maxWidth: '78ch', marginBottom: '40px' }}>
            Es una talla pequeña de madera de cedro vestida con el hábito carmelita. Llegó al valle de las
            Vacas en manos de un ermitaño y, cuatro siglos después, sigue siendo el centro de la devoción
            mariana más antigua de la ciudad.
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
            {fotosVirgen.map((f) => (
              <Foto key={f.alt} src={f.img} alt={f.alt} pie={f.pie} tam="foto--xl" pos="center 30%" />
            ))}
          </div>
        </div>
      </section>

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
            <Foto src="/img/procesion-salida.jpg" alt="Salida de la procesión de la Virgen con incienso y papel picado" tam="foto--lg" pie="La procesión de la fiesta" />
            <Foto src="/img/torreon-noche-nubes.jpg" alt="El torreón de noche entre nubes" tam="foto--lg" pie="El cerro de noche, tierra de leyendas" />
          </div>

          <p className="quote" style={{ color: 'var(--muted)', marginTop: '36px', fontSize: '1.3rem' }}>
            El santuario está al cuidado de los frailes franciscanos desde 1959 y hoy lo atiende el padre
            Edwin Muñoz.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>La arquitectura de la ermita</h2>
          <div>
            <Link to="/arquitectura" className="btn btn--dark">
              Ir a arquitectura →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
