import { Link } from 'react-router-dom'
import { arquitectura } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

export default function Arquitectura() {
  return (
    <>
      <PageHero
        eyebrow="Arquitectura"
        titulo="Una ermita única"
        texto="Fachada ultrabarroca, nave de bóveda, retablo dorado, torreón, catacumbas y cuatro campanas: el conjunto que hace del Cerrito un monumento irrepetible en la ciudad."
      />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid grid--2">
            <Foto src="/img/fachada.jpg" alt="Fachada frontal de la ermita con arreglos florales" tam="foto--xl" pie="La fachada" />
            <Foto src="/img/torreon-fachada-atardecer.jpg" alt="El torreón y la fachada al atardecer" tam="foto--xl" pie="Torreón y fachada" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Recorrido"
            titulo="El templo pieza por pieza"
            texto="El conjunto declarado Patrimonio Cultural de la Nación incluye el templo, el torreón, las capillas de la plazuela y el atrio empedrado."
          />
          {arquitectura.map((p, i) => (
            <article key={p.num} className={'pieza' + (i % 2 === 1 ? ' pieza--inv' : '')}>
              <Foto src={p.img} alt={p.alt} tam="foto--lg" />
              <div>
                <span className="capitulo__epoca">{p.num}</span>
                <h3 style={{ fontSize: '1.7rem' }}>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell stack stack--md">
          <p className="eyebrow eyebrow--light">El arte del santuario</p>
          <h2>Cuatro siglos de arte sacro</h2>
          <p className="lead">
            Además del retablo mayor, el templo conserva imaginería colonial, óleos y platería devocional.
            La fachada reúne a las figuras del Carmelo —san Juan de la Cruz, el profeta Elías, santa Teresa
            de Ávila y santa María Magdalena de Pazzi— y el interior, el confesionario ultrabarroco
            decorado con espejos. Es, en conjunto, uno de los repertorios de arte carmelita más antiguos
            que se conservan en la ciudad.
          </p>
          <div className="grid grid--3" style={{ marginTop: '20px' }}>
            <Foto src="/img/retablo-mayor.jpg" alt="El retablo mayor dorado con la Virgen" tam="foto--lg" pie="Retablo mayor" />
            <Foto src="/img/angel-anda.jpg" alt="Ángel del anda de la Virgen" tam="foto--lg" pie="Imaginería" />
            <Foto src="/img/angeles-reina.jpg" alt="Ángeles con listones «Reina de los Ángeles»" tam="foto--lg" pie="Platería y ángeles del anda" />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell stack stack--md">
          <p className="eyebrow">Siguiente</p>
          <h2>La galería del Cerrito</h2>
          <div>
            <Link to="/galeria" className="btn btn--dark">
              Ir a galería →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
