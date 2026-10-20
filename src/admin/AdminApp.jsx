import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, crmActivo } from '../lib/supabase.js'
import Login from './Login.jsx'
import Layout from './Layout.jsx'
import Eventos from './Eventos.jsx'
import EventoForm from './EventoForm.jsx'
import Tipos from './Tipos.jsx'
import Solicitudes from './Solicitudes.jsx'
import Ajustes from './Ajustes.jsx'
import './admin.css'

function Pantalla({ titulo, children }) {
  return (
    <div className="adm-centro">
      <div className="adm-caja">
        <h1>{titulo}</h1>
        {children}
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [sesion, setSesion] = useState(undefined) // undefined = cargando
  const [esAdmin, setEsAdmin] = useState(undefined)

  useEffect(() => {
    document.title = 'Panel · Cerrito del Carmen'
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    meta.content = 'noindex, nofollow'
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!sesion) return setEsAdmin(undefined)
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', sesion.user.id)
      .maybeSingle()
      .then(({ data, error }) => setEsAdmin(!error && Boolean(data)))
  }, [sesion])

  if (!crmActivo) {
    return (
      <Pantalla titulo="Falta configurar el CRM">
        <p>
          El panel necesita las variables <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>. Los
          pasos están en <code>supabase/LEEME.md</code>.
        </p>
      </Pantalla>
    )
  }
  if (sesion === undefined) return <Pantalla titulo="Cargando…" />
  if (!sesion) return <Login />
  if (esAdmin === undefined) return <Pantalla titulo="Verificando acceso…" />
  if (!esAdmin) {
    return (
      <Pantalla titulo="Sin acceso">
        <p>La cuenta {sesion.user.email} no tiene permiso para usar el panel. Pide acceso al administrador del sitio.</p>
        <button className="adm-btn" onClick={() => supabase.auth.signOut()}>
          Cerrar sesión
        </button>
      </Pantalla>
    )
  }

  return (
    <Routes>
      <Route element={<Layout usuario={sesion.user} />}>
        <Route index element={<Navigate to="eventos" replace />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="eventos/nuevo" element={<EventoForm />} />
        <Route path="eventos/:id" element={<EventoForm />} />
        <Route path="tipos" element={<Tipos />} />
        <Route path="solicitudes" element={<Solicitudes />} />
        <Route path="ajustes" element={<Ajustes />} />
        <Route path="*" element={<Navigate to="eventos" replace />} />
      </Route>
    </Routes>
  )
}
