import { useEffect, useState } from 'react'
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

  useEffect(() => setAbierto(false), [pathname])
  useEffect(() => {
    supabase
      .from('solicitudes')
      .select('id', { count: 'exact', head: true })
      .eq('estado', 'nueva')
      .then(({ count }) => setNuevas(count || 0))
  }, [pathname])

  return (
    <div className="adm">
      <aside className={'adm-side' + (abierto ? ' is-open' : '')}>
        <div className="adm-side__marca">
          <Emblema size={30} />
          <div>
            <strong>Cerrito del Carmen</strong>
            <span>Panel del santuario</span>
          </div>
        </div>
        <nav className="adm-side__nav">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => 'adm-side__link' + (isActive ? ' is-active' : '')}>
              {m.label}
              {m.to.endsWith('solicitudes') && nuevas > 0 && <b className="adm-badge">{nuevas}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="adm-side__pie">
          <a href="/" target="_blank" rel="noreferrer" className="adm-side__link">
            Ver el sitio ↗
          </a>
          <span className="adm-side__usuario">{usuario.email}</span>
          <button className="adm-btn adm-btn--claro" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="adm-main">
        <button className="adm-menu" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto}>
          ☰ Menú
        </button>
        <Outlet />
      </div>
    </div>
  )
}
