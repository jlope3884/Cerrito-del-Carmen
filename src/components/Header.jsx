import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site, nav } from '../data/site.js'
import MusicControl from './MusicControl.jsx'
import Emblema from './Emblema.jsx'
import './header.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const burgerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => setOpen(false), [pathname])

  // Al abrir: el foco pasa al primer enlace del menú
  useEffect(() => {
    if (open) menuRef.current?.querySelector('.menu__item')?.focus()
  }, [open])

  // Esc cierra el menú y devuelve el foco al botón que lo abrió
  useEffect(() => {
    if (!open) return
    const cerrar = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      burgerRef.current?.focus()
    }
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [open])

  // Mientras el menú está abierto, el contenido de detrás no es alcanzable con el teclado
  useEffect(() => {
    if (!open) return
    const fondo = [document.querySelector('main'), document.querySelector('.footer')].filter(Boolean)
    fondo.forEach((el) => el.setAttribute('inert', ''))
    return () => fondo.forEach((el) => el.removeAttribute('inert'))
  }, [open])

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
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="shell header__main-inner">
          <Link to="/" className="brand" aria-label="Cerrito del Carmen, inicio">
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
            ref={burgerRef}
            type="button"
            className="header__burger"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav className="menu" id="menu-movil" aria-label="Menú principal" ref={menuRef}>
          <div className="menu__list">
            {[{ label: 'Inicio', to: '/' }, ...nav, { label: 'Donar', to: '/donar' }].map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="menu__item">
                {item.label}
                <span aria-hidden="true">›</span>
              </NavLink>
            ))}
          </div>
          <div className="menu__actions">
            <MusicControl />
            <Link to="/visita" className="btn btn--primary menu__cta">
              Planea tu visita
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
