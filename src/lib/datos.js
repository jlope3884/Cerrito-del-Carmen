/**
 * Datos del sitio público que vienen del CRM, con respaldo en src/data/site.js.
 * Si Supabase no está configurado, los datos fijos se usan desde el primer render
 * (sin pantallas de «cargando»); si falla, también.
 * Se consulta la API REST directamente (src/lib/rest.js): supabase-js queda solo para /admin.
 */
import { useEffect, useRef, useState } from 'react'
import { site, horarios, agenda } from '../data/site.js'
import { hayCRM } from './config.js'
import { leer, insertar } from './rest.js'
import { inicioDeHoy } from './fechas.js'

const RESPALDO_AJUSTES = {
  parroco: site.parroco,
  horario_visita: horarios.visita,
  aviso_horarios: horarios.aviso,
  telefono: site.telefono,
  correo: site.correo,
  misas: horarios.misas,
}

// ---------- Ajustes ----------
let promesaAjustes = null
let datosAjustes = null

async function cargarAjustes() {
  const [a, h] = await Promise.all([
    leer('ajustes', { select: '*', id: 'eq.1' }),
    leer('horarios_misa', { select: '*', order: 'orden.asc' }),
  ])
  if (!a[0]) return RESPALDO_AJUSTES
  const limpio = Object.fromEntries(Object.entries(a[0]).filter(([, v]) => v !== '' && v != null))
  return { ...RESPALDO_AJUSTES, ...limpio, misas: h.length ? h : RESPALDO_AJUSTES.misas }
}

/** Párroco, horarios de visita y de misa, teléfono y correo. */
export function useAjustes() {
  const [datos, setDatos] = useState(datosAjustes || RESPALDO_AJUSTES)
  useEffect(() => {
    if (!hayCRM) return
    let vivo = true
    if (!promesaAjustes) {
      promesaAjustes = cargarAjustes().then(
        (d) => (datosAjustes = d),
        (err) => {
          // sin caché: la próxima página que lo pida vuelve a intentar
          promesaAjustes = null
          throw err
        },
      )
    }
    promesaAjustes.then(
      (d) => vivo && setDatos(d),
      () => {}, // ya se muestra el respaldo
    )
    return () => {
      vivo = false
    }
  }, [])
  return datos
}

// ---------- Próximos eventos ----------
const DURACION_CACHE = 5 * 60 * 1000 // 5 min: se muestra lo guardado y se revalida al vencer
const cacheEventos = new Map() // `${limite}|${soloDestacados}` → { eventos, hora }

const respaldoEventos = (soloDestacados) => ({ eventos: soloDestacados ? [] : agenda, cargando: false, desdeCRM: false })

function estadoInicial(clave, soloDestacados) {
  if (!hayCRM) return respaldoEventos(soloDestacados)
  const c = cacheEventos.get(clave)
  return c ? { eventos: c.eventos, cargando: false, desdeCRM: true } : { eventos: [], cargando: true, desdeCRM: false }
}

async function cargarEventos(limite, soloDestacados) {
  const parametros = {
    select: '*,tipo:tipos_evento(nombre,color)',
    publicado: 'eq.true',
    // en curso (aún no terminan) o que empiezan hoy o después
    or: `(fin.gte.${new Date().toISOString()},inicio.gte.${inicioDeHoy()})`,
    order: 'inicio.asc',
    limit: String(limite),
  }
  if (soloDestacados) parametros.destacado = 'eq.true'
  return leer('eventos', parametros)
}

/**
 * Próximos eventos publicados (incluye los que están en curso).
 * Devuelve { eventos, cargando, desdeCRM }. Sin CRM: la agenda fija de site.js.
 */
export function useProximosEventos({ limite = 12, soloDestacados = false } = {}) {
  const clave = `${limite}|${soloDestacados}`
  const [estado, setEstado] = useState(() => estadoInicial(clave, soloDestacados))
  const claveMostrada = useRef(clave)
  useEffect(() => {
    if (!hayCRM) return
    let vivo = true
    const c = cacheEventos.get(clave)
    if (claveMostrada.current !== clave) {
      claveMostrada.current = clave
      setEstado(estadoInicial(clave, soloDestacados))
    }
    if (c && Date.now() - c.hora < DURACION_CACHE) return
    cargarEventos(limite, soloDestacados)
      .then((eventos) => {
        cacheEventos.set(clave, { eventos, hora: Date.now() })
        if (vivo) setEstado({ eventos, cargando: false, desdeCRM: true })
      })
      .catch(() => {
        // si ya había algo guardado se deja; si no, la agenda fija
        if (vivo && !c) setEstado(respaldoEventos(soloDestacados))
      })
    return () => {
      vivo = false
    }
  }, [clave, limite, soloDestacados])
  return estado
}

// ---------- Solicitudes ----------
/**
 * Envía una solicitud de celebración al CRM. Lanza un error si falla;
 * si la base frenó el envío por exceso de solicitudes, el error trae codigo = 'limite'.
 */
export async function enviarSolicitud(datos) {
  if (!hayCRM) throw new Error('El CRM no está configurado')
  try {
    await insertar('solicitudes', datos)
  } catch (err) {
    if (String(err?.message || '').includes('limite_solicitudes')) err.codigo = 'limite'
    throw err
  }
}
