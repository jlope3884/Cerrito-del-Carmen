import { supabase } from './supabase.js'

/**
 * Mensajes de error del panel que dicen qué pasó de verdad:
 * sin internet, sesión vencida o, si no, el mensaje propio de cada acción.
 * Solo para el panel /admin (importa supabase-js).
 */
export const SIN_CONEXION = 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
export const SESION_VENCIDA = 'Tu sesión venció. Vuelve a iniciar sesión.'

/** ¿Falló la red (no hubo respuesta del servidor)? */
export function esErrorDeRed(error) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true
  if (!error) return false
  const texto = `${error.name || ''} ${error.message || ''}`
  return error.name === 'TypeError' || /Failed to fetch|NetworkError|Load failed|FetchError|AuthRetryableFetchError/i.test(texto)
}

/** ¿El servidor rechazó el token de la sesión? */
export function esSesionVencida(error) {
  if (!error) return false
  return (
    error.status === 401 ||
    error.code === 'PGRST301' ||
    error.code === 'PGRST303' ||
    /JWT expired/i.test(String(error.message || ''))
  )
}

/**
 * Texto para mostrar al usuario. Con la sesión vencida, además la cierra
 * para que el panel vuelva a la pantalla de inicio de sesión.
 */
export function mensajeError(error, porDefecto) {
  if (esErrorDeRed(error)) return SIN_CONEXION
  if (esSesionVencida(error)) {
    supabase?.auth.signOut().catch(() => {})
    return SESION_VENCIDA
  }
  return porDefecto
}
