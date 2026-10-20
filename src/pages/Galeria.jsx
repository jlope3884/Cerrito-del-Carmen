import { useState } from 'react'
import { Link } from 'react-router-dom'
import { galeria, galeriaFiltros, creditos, documentosReconstruccion } from '../data/site.js'
import Documentos from '../components/Documentos.jsx'
import Visor from '../components/Visor.jsx'
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
        texto="El templo por fuera y por dentro, la fiesta y la procesión, los detalles del anda, el parque y el archivo histórico de la reconstrucción."
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

          <h2 className="visually-hidden">Fotografías del santuario</h2>
          <div className="mosaico">
            {visibles.map((g, i) => (
              <button
                key={g.alt}
                type="button"
                className="mosaico__item"
                onClick={() => setAbierta(g)}
                aria-label={'Ampliar: ' + g.alt}
              >
                <Foto src={g.img} alt={g.alt} pie={g.cat} tam="foto--lg" prioridad={i < 3} />
              </button>
            ))}
          </div>

          <p className="note" style={{ marginTop: '24px' }} aria-live="polite">
            {visibles.length} de {galeria.length} imágenes · {creditos}
          </p>
        </div>

        {abierta && <Visor img={abierta.img} alt={abierta.alt} pie={abierta.alt} onCerrar={() => setAbierta(null)} />}
      </section>

      <section className="section section--dark" id="fototeca">
        <div className="shell">
          <div className="stack stack--md" style={{ maxWidth: '72ch' }}>
            <p className="eyebrow eyebrow--light">Archivo histórico</p>
            <h2>Archivo histórico</h2>
            <p className="lead">
              En 1875, Eadweard Muybridge fotografió la Ciudad de Guatemala en una serie de panorámicas
              tomadas desde el Cerrito del Carmen. Son el testimonio visual más antiguo de cómo se veía la
              capital desde el cerro. Aquí reunimos documentos, planos y recortes de prensa del archivo
              del santuario.
            </p>
          </div>
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
            eyebrow="Video"
            titulo="El Cerrito en movimiento"
            texto="La pólvora de la fiesta patronal frente al templo y la fachada al atardecer."
          />
          <div className="videos">
            <video
              src="/video/fiesta-polvora.mp4"
              poster="/video/fiesta-polvora.jpg"
              controls
              muted
              playsInline
              preload="none"
              aria-label="Pólvora de la fiesta patronal frente al templo (sin sonido)"
              style={{ aspectRatio: '848 / 478', height: 'auto' }}
            />
            <video
              src="/video/fachada-atardecer.mp4"
              poster="/video/fachada-atardecer.jpg"
              controls
              muted
              playsInline
              loop
              preload="none"
              aria-label="La fachada del santuario al atardecer (sin sonido)"
              style={{ aspectRatio: '478 / 850', height: 'auto' }}
            />
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
