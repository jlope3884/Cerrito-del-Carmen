/**
 * Cliente mínimo de la API REST de Supabase (PostgREST) para el sitio público.
 * Así las páginas no descargan supabase-js, que solo usa el panel /admin.
 */
import { URL_CRM, CLAVE_CRM } from './config.js'

const cabeceras = () => ({ apikey: CLAVE_CRM, Authorization: `Bearer ${CLAVE_CRM}` })

async function fallo(r) {
  let cuerpo = {}
  try {
    cuerpo = await r.json()
  } catch {
    /* respuesta sin JSON */
  }
  const err = new Error(cuerpo.message || `Error ${r.status}`)
  err.status = r.status
  err.code = cuerpo.code
  return err
}

/** GET /rest/v1/<tabla>?<parámetros> → arreglo de filas */
export async function leer(tabla, parametros) {
  const r = await fetch(`${URL_CRM}/rest/v1/${tabla}?${new URLSearchParams(parametros)}`, { headers: cabeceras() })
  if (!r.ok) throw await fallo(r)
  return r.json()
}

/** POST /rest/v1/<tabla> sin devolver la fila (el público no puede leerla) */
export async function insertar(tabla, datos) {
  const r = await fetch(`${URL_CRM}/rest/v1/${tabla}`, {
    method: 'POST',
    headers: { ...cabeceras(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(datos),
  })
  if (!r.ok) throw await fallo(r)
}
