import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site, nav } from '../data/site.js'
import MusicControl from './MusicControl.jsx'
import Emblema from './Emblema.jsx'
import './header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="header">
      <div className="header__utility">
        <div className="shell header__utility-inner">
          <span className="header__tagline">{site.tagline}</span>
          <div className="header__utility-right">
            <MusicControl />
            <span className="header__lang">
              <strong>ES</strong> / EN
            </span>
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="shell header__main-inner">
          <Link to="/" className="brand" aria-label="Inicio">
            <Emblema size={30} />
            <span className="brand__text">
              <span className="brand__name">Cerrito del Carmen</span>
              <span className="brand__city">{site.ciudad}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Principal">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/donar" className="btn btn--ghost header__cta">
            Donar
          </Link>

          <button
            className="header__burger"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="menu" role="dialog" aria-label="Menú">
          <nav className="menu__list">
            {[{ label: 'Inicio', to: '/' }, ...nav, { label: 'Donar', to: '/donar' }].map((item) => (
              <NavLink key={item.to} to={item.to} className="menu__item">
                {item.label}
                <span aria-hidden="true">›</span>
              </NavLink>
            ))}
          </nav>
          <div className="menu__actions">
            <MusicControl />
            <Link to="/visita" className="btn btn--primary menu__cta">
              Planea tu visita
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
