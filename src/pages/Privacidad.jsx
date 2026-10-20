import { Link } from 'react-router-dom'
import { site, creditos } from '../data/site.js'
import { PageHero } from '../components/Bits.jsx'
import './pages.css'

export default function Privacidad() {
  return (
    <>
      <PageHero
        eyebrow="Información legal"
        titulo="Privacidad y créditos"
        texto="Qué datos recibe el sitio del santuario, para qué los usamos y quiénes hicieron posible este sitio."
      />

      <section className="section">
        <div className="shell legal">
          <h2>Política de privacidad</h2>
          <p>
            Este sitio pertenece al Santuario del Cerrito del Carmen ({site.direccion}). No tiene cuentas de
            usuario ni usa cookies propias.
          </p>

          <h3>Qué datos recibimos</h3>
          <p>
            Solo los que escribes en el formulario de <Link to="/contacto">Contacto</Link>: nombre, correo,
            asunto y mensaje. Los usamos únicamente para responder tu consulta; no los vendemos, no los
            compartimos y no te enviaremos publicidad.
          </p>

          <h3>Cómo se envían</h3>
          <p>
            El formulario se envía mediante el servicio Web3Forms, que entrega el mensaje al correo del
            santuario. Los mensajes se conservan solo el tiempo necesario para atender la consulta.
          </p>

          <h3>Servicios de terceros</h3>
          <p>
            Algunas páginas cargan contenido de otros servicios, que pueden registrar datos técnicos de tu
            visita (como la dirección IP): Google Maps, en la página de Ubicación, y Google Fonts, para las
            tipografías del sitio.
          </p>

          <h3>Tus derechos</h3>
          <p>
            Puedes pedirnos que corrijamos o borremos los datos que nos enviaste escribiendo a{' '}
            <a href={`mailto:${site.correo}`}>{site.correo}</a> o llamando al {site.telefono}.
          </p>

          <h2 id="creditos" style={{ marginTop: '56px' }}>
            Créditos
          </h2>
          <p>{creditos}</p>
          <p>
            Documentos de la reconstrucción: planos estructurales del Departamento de Estudios y Proyectos
            de Edificios Públicos de la Dirección General de Obras Públicas (1979), recorte del Diario de
            Centro América (1987) y resolución arzobispal de 1995, del archivo del santuario.
          </p>
          <p>
            Música ambiental: «Veni Sancte Spiritus», canto gregoriano. Grabación de dominio público
            publicada en Wikimedia Commons.
          </p>
          <p>
            Diseño y desarrollo: Javier Alejandro López del Cid y Hugo Javier Cifuentes Carredano,
            estudiantes de Ciencias de la Computación de la Universidad del Valle de Guatemala, como
            proyecto de Horas de Extensión.
          </p>
        </div>
      </section>
    </>
  )
}
