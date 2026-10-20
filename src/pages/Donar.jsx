import { Fragment, useEffect, useRef, useState } from 'react'
import { site, cuentas, destinoAporte, agradecimientos, confirmado } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import { useAjustes } from '../lib/datos.js'
import { telHref } from '../lib/texto.js'
import './pages.css'

/** Copia al portapapeles; si el navegador no lo permite, con el método antiguo. */
async function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(texto)
      return true
    } catch {
      /* se intenta abajo */
    }
  }
  try {
    const area = document.createElement('textarea')
    area.value = texto
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}

/** Botón «Copiar» junto a un número de cuenta (copia sin espacios). */
function Copiar({ valor, etiqueta }) {
  const [estado, setEstado] = useState('') // '' | copiado | error
  const reloj = useRef(null)
  useEffect(() => () => clearTimeout(reloj.current), [])

  async function copiar() {
    const ok = await copiarTexto(String(valor).replace(/\s/g, ''))
    setEstado(ok ? 'copiado' : 'error')
    clearTimeout(reloj.current)
    reloj.current = setTimeout(() => setEstado(''), 2000)
  }

  return (
    <>
      <button type="button" className="chip cuenta__copiar" onClick={copiar} aria-label={`Copiar ${etiqueta}`}>
        {estado === 'copiado' ? 'Copiado' : 'Copiar'}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {estado === 'copiado' ? `${etiqueta} copiado` : estado === 'error' ? 'No se pudo copiar; selecciona el número a mano.' : ''}
      </span>
    </>
  )
}

/** IBAN en pares de bloques que no se parten al cambiar de línea. */
function Iban({ valor }) {
  const bloques = String(valor).trim().split(/\s+/)
  const pares = []
  for (let i = 0; i < bloques.length; i += 2) pares.push(bloques.slice(i, i + 2).join(' '))
  // El espacio entre pares va fuera del <span> sin cortes: es ahí donde puede cambiar de línea.
  return pares.map((par, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span style={{ whiteSpace: 'nowrap' }}>{par}</span>
    </Fragment>
  ))
}

export default function Donar() {
  const aj = useAjustes()
  return (
    <>
      <PageHero
        eyebrow="Apoya al santuario"
        titulo="Tu ofrenda sostiene el Cerrito"
        texto="Cada aporte ayuda a conservar cuatro siglos de historia viva: la ermita, sus campanas, el torreón y el culto a la Virgen del Carmen."
      />

      <section className="section section--tight">
        <div className="shell">
          <p className="eyebrow" style={{ marginBottom: '20px' }}>Lo que tu aporte conserva</p>
          <div className="grid grid--3">
            <Foto src="/img/retablo-cortinas.jpg" alt="El retablo mayor con cortinas amarillas y blancas" tam="foto--lg" pie="El retablo mayor" prioridad />
            <Foto src="/img/campana.jpg" alt="Campana del campanario sobre la ciudad" tam="foto--lg" pie="Las campanas" prioridad />
            <Foto src="/img/torreon-dia.jpg" alt="El torreón sobre la plaza empedrada" tam="foto--lg" pie="El torreón" prioridad />
          </div>
        </div>
      </section>

      <section className="section" id="cuentas">
        <div className="shell">
          <TituloSeccion
            eyebrow="Transferencia o depósito"
            titulo="Cuentas del santuario"
            texto="Las donaciones se reciben por transferencia o depósito bancario a nombre del Santuario del Cerrito del Carmen. Envíanos tu comprobante y te confirmamos la recepción de tu aporte."
          />
          {!confirmado.cuentas ? (
            <div className="card" style={{ padding: '32px', maxWidth: '760px' }}>
              <h3 style={{ fontSize: '1.45rem' }}>Datos de la cuenta</h3>
              <hr className="divider" style={{ margin: '20px 0 24px' }} />
              <p>
                Pide los datos de la cuenta del santuario al despacho parroquial: llámanos al{' '}
                <a href={telHref(aj.telefono)} className="enlace">
                  {aj.telefono}
                </a>{' '}
                o escríbenos a{' '}
                <a href={`mailto:${site.correoDonaciones}`} className="enlace">
                  {site.correoDonaciones}
                </a>
                .
              </p>
            </div>
          ) : (
          <div className={cuentas.length > 1 ? 'grid grid--2' : 'grid'} style={cuentas.length > 1 ? undefined : { maxWidth: '640px' }}>
            {cuentas.map((c) => (
              <div key={c.banco} className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.45rem' }}>{c.banco}</h3>
                <hr className="divider" style={{ margin: '20px 0 24px' }} />
                <div className="cuenta__fila">
                  <span className="label">Tipo de cuenta</span>
                  <p style={{ color: 'var(--ink)' }}>{c.tipo}</p>
                </div>
                <div className="cuenta__fila">
                  <span className="label">Número de cuenta</span>
                  <div className="cuenta__valor">
                    <p className="cuenta__numero">{c.numero}</p>
                    <Copiar valor={c.numero} etiqueta="número de cuenta" />
                  </div>
                </div>
                {c.iban && (
                  <div className="cuenta__fila">
                    <span className="label">IBAN (transferencias desde el extranjero)</span>
                    <div className="cuenta__valor">
                      <p className="cuenta__iban">
                        <Iban valor={c.iban} />
                      </p>
                      <Copiar valor={c.iban} etiqueta="IBAN" />
                    </div>
                  </div>
                )}
                <div className="cuenta__fila">
                  <span className="label">A nombre de</span>
                  <p style={{ color: 'var(--ink)' }}>{c.titular}</p>
                </div>
              </div>
            ))}
          </div>
          )}
          <p className="note" style={{ marginTop: '24px' }}>
            Envía tu comprobante a {site.correoDonaciones} o llámanos al {aj.telefono}. Te confirmamos por
            correo la recepción de tu donación.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <TituloSeccion
            eyebrow="Transparencia"
            titulo="A dónde va tu aporte"
            texto="Publicamos cómo se usa lo recaudado a lo largo del año."
          />
          <div className="grid grid--4">
            {destinoAporte.map((d) => (
              <div key={d.num} className="stack stack--sm">
                <span className="explorar__num">{d.num}</span>
                <h3>{d.titulo}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="shell grid grid--2">
          <div className="stack stack--md">
            <p className="eyebrow eyebrow--light">Otras formas de ayudar</p>
            <h2>No todo es dinero</h2>
            <p className="lead">
              También puedes colaborar con materiales para la conservación, con tu tiempo como voluntario en
              la fiesta patronal o acompañando las celebraciones del santuario. Escríbenos y te contamos qué
              se necesita.
            </p>
          </div>
          <div className="stack stack--md">
            <p className="eyebrow eyebrow--light">Contacto para donaciones</p>
            <p className="quote" style={{ fontSize: '1.4rem' }}>
              {site.correoDonaciones}
            </p>
            <p className="lead">
              {aj.parroco} · {aj.telefono}
              <br />
              {site.direccion}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <div className="aviso-legal" id="aviso-legal">
            <p className="eyebrow" style={{ marginBottom: '14px' }}>
              Aviso legal
            </p>
            <p>
              Las cantidades recibidas son <strong>ofrendas voluntarias destinadas al culto divino</strong> y
              al sostenimiento del santuario del Cerrito del Carmen. No constituyen la compra de un bien o
              servicio, no generan contraprestación alguna y no son reembolsables.
            </p>
            <p>
              La administración del santuario destina lo recaudado a la conservación del templo, el culto y
              las actividades pastorales. A solicitud del donante se extiende constancia de la ofrenda
              recibida.
            </p>
          </div>
        </div>
      </section>

      {confirmado.agradecimientos && (
      <section className="section" id="agradecimientos">
        <div className="shell">
          <TituloSeccion
            eyebrow="Agradecimientos"
            titulo="Gracias a quienes sostienen el Cerrito"
            texto="Personas, familias y comunidades que han hecho posible la conservación del santuario. Si prefieres que tu aporte sea anónimo, así lo publicamos."
          />
          <div className="gracias">
            {agradecimientos.map((a) => (
              <div key={a.nombre} className="gracias__item">
                <strong>{a.nombre}</strong>
                <span>{a.nota}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
    </>
  )
}
