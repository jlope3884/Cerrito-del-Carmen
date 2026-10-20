import { Link } from 'react-router-dom'
import { PageHero } from '../components/Bits.jsx'
import './pages.css'

export default function NoEncontrada() {
  return (
    <>
      <PageHero
        eyebrow="Error 404"
        titulo="Esta página no existe"
        texto="Puede que el enlace esté mal escrito o que la página se haya movido."
      />
      <section className="section section--tight">
        <div className="shell hero__ctas">
          <Link to="/" className="btn btn--dark">
            Ir al inicio →
          </Link>
          <Link to="/visita" className="btn btn--ghost-dark">
            Planea tu visita
          </Link>
        </div>
      </section>
    </>
  )
}
