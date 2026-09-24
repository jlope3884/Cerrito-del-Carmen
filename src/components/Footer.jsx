import { Link } from 'react-router-dom'
import { site, redes } from '../data/site.js'
import Emblema from './Emblema.jsx'
import './footer.css'

const columnas = [
  {
    titulo: 'Descubrir',
    enlaces: [
      { label: 'Historia', to: '/historia' },
      { label: 'La Virgen del Carmen', to: '/historia#la-virgen' },
      { label: 'Leyendas del cerro', to: '/historia#actualidad' },
    ],
  },
  {
    titulo: 'Visitar',
    enlaces: [
      { label: 'Cómo visitar', to: '/visita' },
      { label: 'Horarios de misa', to: '/visita#misas' },
      { label: 'Qué ver', to: '/visita#que-ver' },
      { label: 'Preguntas frecuentes', to: '/visita#faq' },
    ],
  },
  {
    titulo: 'Apoyar',
    enlaces: [
      { label: 'Donar', to: '/donar' },
      { label: 'Cuentas del santuario', to: '/donar#cuentas' },
      { label: 'Agradecimientos', to: '/donar#agradecimientos' },
    ],
  },
]

function IconoRed({ tipo }) {
  if (tipo === 'facebook') {
    return <span className="social__f">f</span>
  }
  if (tipo === 'instagram') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="0.8" y="0.8" width="12.4" height="12.4" rx="3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="10.6" cy="3.4" r="0.95" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
      <rect x="0.6" y="0.6" width="14.8" height="10.8" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.4 3.6 L10.4 6 L6.4 8.4 Z" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top" />
      <div className="shell footer__main">
        <div className="footer__brand">
          <div className="footer__logo">
            <Emblema size={44} />
            <span className="brand__text">
              <span className="brand__name footer__name">Cerrito del Carmen</span>
              <span className="brand__city">{site.ciudad}</span>
            </span>
          </div>
          <p className="footer__desc">{site.descripcion}</p>
          <p className="footer__patrimonio">Patrimonio Cultural de la Nación</p>
        </div>

        {columnas.map((col) => (
          <div key={col.titulo} className="footer__col">
            <h4 className="footer__coltitle">{col.titulo}</h4>
            <ul>
              {col.enlaces.map((e) => (
                <li key={e.label}>
                  <Link to={e.to}>{e.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__col">
          <h4 className="footer__coltitle">Síguenos</h4>
          <div className="social">
            {redes.map((r) => (
              <a
                key={r.nombre}
                href={r.url}
                className="social__link"
                aria-label={r.nombre}
                target="_blank"
                rel="noreferrer"
              >
                <IconoRed tipo={r.icono} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="shell footer__bottom-inner">
          <span>© {new Date().getFullYear()} Santuario del Cerrito del Carmen · {site.ciudad}</span>
          <span className="footer__legal">
            <a href="#">Notas legales</a>
            <a href="#">Política de privacidad</a>
            <a href="#">Créditos</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
