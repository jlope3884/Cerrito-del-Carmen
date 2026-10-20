import { site, cuentas, destinoAporte, agradecimientos, confirmado } from '../data/site.js'
import { PageHero, TituloSeccion, Foto } from '../components/Bits.jsx'
import './pages.css'

export default function Donar() {
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
            <Foto src="/img/retablo-cortinas.jpg" alt="El retablo mayor con cortinas amarillo y blanco" tam="foto--lg" pie="El retablo mayor" />
            <Foto src="/img/campana.jpg" alt="Campana del campanario sobre la ciudad" tam="foto--lg" pie="Las campanas" />
            <Foto src="/img/torreon-dia.jpg" alt="El torreón sobre la plaza empedrada" tam="foto--lg" pie="El torreón" />
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
                <a href={`tel:+502${site.telefono.replace(/\s/g, '')}`} style={{ color: 'var(--gold-deep)' }}>{site.telefono}</a> o escríbenos a{' '}
                <a href={`mailto:${site.correoDonaciones}`} style={{ color: 'var(--gold-deep)' }}>
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
                  <p className="cuenta__numero">{c.numero}</p>
                </div>
                {c.iban && (
                  <div className="cuenta__fila">
                    <span className="label">IBAN (transferencias desde el extranjero)</span>
                    <p style={{ color: 'var(--ink)', letterSpacing: '0.5px' }}>{c.iban}</p>
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
            Envía tu comprobante a {site.correoDonaciones} o llámanos al {site.telefono}. Te confirmamos por
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
              {site.parroco} · {site.telefono}
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
