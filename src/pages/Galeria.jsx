import { useState } from 'react'
import { Link } from 'react-router-dom'
import { galeria, galeriaFiltros, creditos, documentosReconstruccion } from '../data/site.js'
import Documentos from '../components/Documentos.jsx'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

export default function Galeria() {
  const [filtro, setFiltro] = useState('Todo')
  const [abierta, setAbierta] = useState(null)
  const visibles = filtro === 'Todo' ? galeria : galeria.filter((g) => g.cat === filtro)

  return (
    <>
      <PageHero
        eyebrow="Galería"
        titulo="Galería del Cerrito"
        texto="El templo por fuera y por dentro, la fiesta y la procesión, los detalles del anda, el parque y la fototeca histórica — incluidas las panorámicas que Muybridge tomó desde el cerro en 1875."
      />

      <section className="section">
        <div className="shell">
          <div className="chips">
            {galeriaFiltros.map((f) => (
              <button
                key={f}
                className={'chip' + (filtro === f ? ' is-on' : '')}
                onClick={() => setFiltro(f)}
                aria-pressed={filtro === f}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mosaico">
            {visibles.map((g) => (
              <button key={g.alt} className="mosaico__item" onClick={() => setAbierta(g)} aria-label={'Ampliar: ' + g.alt}>
                <Foto src={g.img} alt={g.alt} pie={g.cat} tam="foto--lg" />
              </button>
            ))}
          </div>

          <p className="note" style={{ marginTop: '24px' }}>
            {visibles.length} de {galeria.length} imágenes · {creditos}
          </p>
        </div>

        {abierta && (
          <div className="visor" role="dialog" aria-modal="true" aria-label={abierta.alt} onClick={() => setAbierta(null)}>
            <figure className="visor__fig" onClick={(e) => e.stopPropagation()}>
              <img src={abierta.img} alt={abierta.alt} />
              <figcaption>
                <span>{abierta.alt}</span>
                <button className="visor__cerrar" onClick={() => setAbierta(null)}>
                  Cerrar ✕
                </button>
              </figcaption>
            </figure>
          </div>
        )}
      </section>

      <section className="section section--dark" id="fototeca">
        <div className="shell grid grid--2" style={{ alignItems: 'center' }}>
          <div className="stack stack--md">
            <p className="eyebrow eyebrow--light">Fototeca histórica</p>
            <h2>Las panorámicas de Muybridge</h2>
            <p className="lead">
              En 1875, Eadweard Muybridge fotografió la Ciudad de Guatemala en una serie de panorámicas
              tomadas desde el Cerrito del Carmen. Son el testimonio visual más antiguo de cómo se veía la
              capital desde el cerro, y el punto de partida de la fototeca del santuario.
            </p>
          </div>
          <Foto alt="panorámica de Muybridge tomada desde el Cerrito en 1875" tam="foto--md" />
        </div>
        <div className="shell" style={{ marginTop: '64px' }}>
          <p className="eyebrow eyebrow--light" style={{ marginBottom: '24px' }}>
            Archivo de la reconstrucción
          </p>
          <Documentos items={documentosReconstruccion} claro />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Vídeo"
            titulo="El Cerrito en movimiento"
            texto="La pólvora de la fiesta patronal frente al templo y la fachada al atardecer."
          />
          <div className="videos">
            <video src="/video/fiesta-polvora.mp4" poster="/video/fiesta-polvora.jpg" controls muted playsInline preload="none" />
            <video src="/video/fachada-atardecer.mp4" poster="/video/fachada-atardecer.jpg" controls muted playsInline loop preload="none" />
          </div>
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
