import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import Emblema from '../components/Emblema.jsx'

const menu = [
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/tipos', label: 'Tipos de evento' },
  { to: '/admin/solicitudes', label: 'Solicitudes' },
  { to: '/admin/ajustes', label: 'Ajustes del sitio' },
]

export default function Layout({ usuario }) {
  const [nuevas, setNuevas] = useState(0)
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const botonMenu = useRef(null)
  const botonCerrar = useRef(null)

  const cerrar = useCallback((devolverFoco) => {
    setAbierto(false)
    if (devolverFoco) botonMenu.current?.focus()
  }, [])

  useEffect(() => setAbierto(false), [pathname])

  // Al abrir el menú en el celular, el foco entra en él; Esc lo cierra.
  useEffect(() => {
    if (!abierto) return
    botonCerrar.current?.focus()
    const tecla = (e) => {
      if (e.key === 'Escape') cerrar(true)
    }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [abierto, cerrar])

  // Insignia de solicitudes nuevas: al cambiar de página y cuando Solicitudes avisa de un cambio.
  useEffect(() => {
    let vivo = true
    const contar = () =>
      supabase
        .from('solicitudes')
        .select('id', { count: 'exact', head: true })
        .eq('estado', 'nueva')
        .then(({ count, error }) => vivo && !error && setNuevas(count || 0))
    contar()
    window.addEventListener('solicitudes-cambiaron', contar)
    return () => {
      vivo = false
      window.removeEventListener('solicitudes-cambiaron', contar)
    }
  }, [pathname])

  return (
    <div className="adm">
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <aside id="adm-menu-lateral" className={'adm-side' + (abierto ? ' is-open' : '')} aria-label="Menú del panel">
        <button ref={botonCerrar} type="button" className="adm-btn adm-btn--claro adm-btn--chico adm-side__cerrar" onClick={() => cerrar(true)}>
          ✕ Cerrar
        </button>
        <div className="adm-side__marca">
          <Emblema size={30} />
          <div>
            <strong>Cerrito del Carmen</strong>
            <span>Panel del santuario</span>
          </div>
        </div>
        <nav className="adm-side__nav" aria-label="Secciones del panel">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => 'adm-side__link' + (isActive ? ' is-active' : '')}>
              {m.label}
              {m.to.endsWith('solicitudes') && nuevas > 0 && (
                <>
                  <b className="adm-badge">{nuevas}</b>
                  <span className="visually-hidden"> {nuevas === 1 ? 'nueva' : 'nuevas'}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="adm-side__pie">
          <a href="/" target="_blank" rel="noreferrer" className="adm-side__link">
            <span>
              Ver el sitio <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (se abre en una pestaña nueva)</span>
            </span>
          </a>
          <span className="adm-side__usuario">{usuario.email}</span>
          <button className="adm-btn adm-btn--claro" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      {abierto && <button type="button" className="adm-velo" aria-label="Cerrar menú" tabIndex={-1} onClick={() => cerrar(false)} />}
      <main className="adm-main" id="contenido" tabIndex={-1}>
        <button
          ref={botonMenu}
          type="button"
          className="adm-menu"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="adm-menu-lateral"
        >
          ☰ Menú
        </button>
        <Outlet />
      </main>
    </div>
  )
}
