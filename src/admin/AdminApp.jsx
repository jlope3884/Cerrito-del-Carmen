import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { hayCRM } from '../lib/config.js'
import { mensajeError } from '../lib/errores.js'
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
      <main className="adm-caja">
        <h1>{titulo}</h1>
        {children}
      </main>
    </div>
  )
}

/** Se muestra al abrir el enlace de «¿Olvidaste tu contraseña?» que llega por correo. */
function NuevaClave({ alTerminar }) {
  const [estado, setEstado] = useState({ guardando: false, error: '', ok: '' })

  async function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const clave = String(f.get('clave') || '')
    if (clave.length < 8) return setEstado({ guardando: false, error: 'La contraseña debe tener al menos 8 caracteres.', ok: '' })
    if (clave !== f.get('clave2')) return setEstado({ guardando: false, error: 'Las contraseñas no coinciden.', ok: '' })
    setEstado({ guardando: true, error: '', ok: '' })
    const { error } = await supabase.auth.updateUser({ password: clave })
    if (error) {
      return setEstado({
        guardando: false,
        error: mensajeError(error, 'No se pudo cambiar la contraseña. Pide un enlace nuevo e inténtalo otra vez.'),
        ok: '',
      })
    }
    setEstado({ guardando: false, error: '', ok: 'Contraseña actualizada.' })
    setTimeout(alTerminar, 1200)
  }

  return (
    <Pantalla titulo="Nueva contraseña">
      <form className="adm-login" onSubmit={enviar} noValidate>
        <p>Escribe la contraseña nueva para tu cuenta (mínimo 8 caracteres).</p>
        <label className="adm-campo">
          <span>Contraseña nueva</span>
          <input type="password" name="clave" required aria-required="true" minLength={8} autoComplete="new-password" />
        </label>
        <label className="adm-campo">
          <span>Repite la contraseña</span>
          <input type="password" name="clave2" required aria-required="true" minLength={8} autoComplete="new-password" />
        </label>
        {estado.error && (
          <p className="adm-error" role="alert">
            {estado.error}
          </p>
        )}
        {estado.ok && (
          <p className="adm-ok" role="status">
            {estado.ok}
          </p>
        )}
        <button className="adm-btn adm-btn--primario" disabled={estado.guardando || Boolean(estado.ok)}>
          {estado.guardando ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </Pantalla>
  )
}

export default function AdminApp() {
  const location = useLocation()
  const [sesion, setSesion] = useState(undefined) // undefined = cargando
  const [esAdmin, setEsAdmin] = useState(undefined) // undefined = verificando · 'error' = no se pudo verificar
  const [recuperando, setRecuperando] = useState(false)
  const [intento, setIntento] = useState(0)

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
    const { data } = supabase.auth.onAuthStateChange((evento, s) => {
      if (evento === 'PASSWORD_RECOVERY') setRecuperando(true)
      setSesion(s)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const usuarioId = sesion?.user?.id
  useEffect(() => {
    if (!usuarioId) return setEsAdmin(undefined)
    let vivo = true
    setEsAdmin(undefined)
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', usuarioId)
      .maybeSingle()
      .then(({ data, error }) => vivo && setEsAdmin(error ? 'error' : Boolean(data)))
      .catch(() => vivo && setEsAdmin('error'))
    return () => {
      vivo = false
    }
  }, [usuarioId, intento])

  if (!hayCRM) {
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
  if (recuperando && sesion) return <NuevaClave alTerminar={() => setRecuperando(false)} />
  if (!sesion) return <Login />
  if (esAdmin === undefined) return <Pantalla titulo="Verificando acceso…" />
  if (esAdmin === 'error') {
    return (
      <Pantalla titulo="No se pudo verificar el acceso">
        <p role="alert">Revisa tu conexión a internet e inténtalo de nuevo.</p>
        <button className="adm-btn adm-btn--primario" onClick={() => setIntento((n) => n + 1)}>
          Reintentar
        </button>
        <button className="adm-btn" onClick={() => supabase.auth.signOut()}>
          Cerrar sesión
        </button>
      </Pantalla>
    )
  }
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
        {/* key: al pasar de un evento a otro (o a «Duplicar») el formulario empieza de cero */}
        <Route path="eventos/nuevo" element={<EventoForm key={location.pathname + location.search} />} />
        <Route path="eventos/:id" element={<EventoForm key={location.pathname + location.search} />} />
        <Route path="tipos" element={<Tipos />} />
        <Route path="solicitudes" element={<Solicitudes />} />
        <Route path="ajustes" element={<Ajustes />} />
        <Route path="*" element={<Navigate to="eventos" replace />} />
      </Route>
    </Routes>
  )
}
