/**
 * Datos del sitio público que vienen del CRM, con respaldo en src/data/site.js.
 * Si Supabase no está configurado o falla, se usan los datos fijos.
 */
import { useEffect, useState } from 'react'
import { site, horarios, agenda } from '../data/site.js'
import { inicioDeHoy } from './fechas.js'

const RESPALDO_AJUSTES = {
  parroco: site.parroco,
  horario_visita: horarios.visita,
  aviso_horarios: horarios.aviso,
  telefono: site.telefono,
  correo: site.correo,
  misas: horarios.misas,
}

// Supabase se carga aparte para no hacer más pesada la primera visita.
const cliente = () => import('./supabase.js').then((m) => m.supabase)

let promesaAjustes = null
let datosAjustes = null
async function cargarAjustes() {
  const sb = await cliente()
  if (!sb) return RESPALDO_AJUSTES
  const [a, h] = await Promise.all([
    sb.from('ajustes').select('*').eq('id', 1).maybeSingle(),
    sb.from('horarios_misa').select('*').order('orden'),
  ])
  if (a.error || h.error || !a.data) return RESPALDO_AJUSTES
  const limpio = Object.fromEntries(Object.entries(a.data).filter(([, v]) => v !== '' && v != null))
  return { ...RESPALDO_AJUSTES, ...limpio, misas: h.data.length ? h.data : RESPALDO_AJUSTES.misas }
}

/** Párroco, horarios de visita y de misa, teléfono y correo. */
export function useAjustes() {
  const [datos, setDatos] = useState(datosAjustes || RESPALDO_AJUSTES)
  useEffect(() => {
    let vivo = true
    if (!promesaAjustes) promesaAjustes = cargarAjustes().catch(() => RESPALDO_AJUSTES)
    promesaAjustes.then((d) => {
      datosAjustes = d
      if (vivo) setDatos(d)
    })
    return () => {
      vivo = false
    }
  }, [])
  return datos
}

/**
 * Próximos eventos publicados (incluye los que están en curso).
 * Devuelve { eventos, cargando, desdeCRM }. Sin CRM: la agenda fija de site.js.
 */
export function useProximosEventos({ limite = 12, soloDestacados = false } = {}) {
  const [estado, setEstado] = useState({ eventos: [], cargando: true, desdeCRM: false })
  useEffect(() => {
    let vivo = true
    ;(async () => {
      const sb = await cliente()
      if (!sb) return vivo && setEstado({ eventos: soloDestacados ? [] : agenda, cargando: false, desdeCRM: false })
      const ahora = new Date().toISOString()
      let q = sb
        .from('eventos')
        .select('*, tipo:tipos_evento(nombre, color)')
        .eq('publicado', true)
        .or(`fin.gte.${ahora},inicio.gte.${inicioDeHoy()}`)
        .order('inicio')
        .limit(limite)
      if (soloDestacados) q = q.eq('destacado', true)
      const { data, error } = await q
      if (!vivo) return
      if (error) setEstado({ eventos: soloDestacados ? [] : agenda, cargando: false, desdeCRM: false })
      else setEstado({ eventos: data, cargando: false, desdeCRM: true })
    })().catch(() => vivo && setEstado({ eventos: soloDestacados ? [] : agenda, cargando: false, desdeCRM: false }))
    return () => {
      vivo = false
    }
  }, [limite, soloDestacados])
  return estado
}

/** Envía una solicitud de celebración al CRM. Lanza un error si falla. */
export async function enviarSolicitud(datos) {
  const sb = await cliente()
  if (!sb) throw new Error('El CRM no está configurado')
  const { error } = await sb.from('solicitudes').insert(datos)
  if (error) throw error
}

export async function crmDisponible() {
  return Boolean(await cliente())
}
