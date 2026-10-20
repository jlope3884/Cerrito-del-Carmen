# Cerrito del Carmen — sitio web

Sitio del Santuario del Cerrito del Carmen, hecha en **React + Vite** con CSS propio
(sin frameworks de estilos). Sigue el diseño de Figma del proyecto de Horas de Extensión (UVG).

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:5173
```

Producción:

```bash
npm run build    # queda en dist/
npm run preview
```

## Páginas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/historia` | Historia — Pasado · documentos de la reconstrucción · La Virgen · Actualidad |
| `/arquitectura` | Arquitectura — fachada, torreón, catacumbas, campanas, cruz papal, arte |
| `/galeria` | Galería con filtros + fototeca de Muybridge |
| `/visita` | Visita, horarios de misa, qué ver, parque y Plaza México |
| `/celebraciones` | Planifica tu celebración religiosa — sacramentos y agenda |
| `/ubicacion` | Ubicación, cómo llegar, puntos de referencia |
| `/contacto` | Formulario, datos y preguntas frecuentes |
| `/donar` | Cuentas bancarias, aviso legal y agradecimientos |

## Estructura

```
src/
  data/site.js          ← TODO el contenido del sitio (textos, horarios, cuentas, FAQ, fotos)
  components/           ← Header, Footer, control de música, piezas compartidas
  pages/                ← una por sección
  styles/global.css     ← tokens de color y tipografía + utilidades
public/
  audio/                ← canto-gregoriano.mp3: «Veni Sancte Spiritus» (dominio público, Wikimedia Commons)
  img/                  ← fotos optimizadas (máx. 1600 px, JPEG)
  video/                ← vídeos de la galería (pólvora de la fiesta y fachada al atardecer)
```

## Cómo poner las fotos

Cada bloque con imagen tiene un campo `img` en `src/data/site.js`:

```js
{ titulo: 'La fachada ultrabarroca', img: '', alt: 'Fachada barroca de la ermita' }
```

1. Copiá la foto a `public/img/`, por ejemplo `public/img/fachada.jpg`
2. Escribí la ruta: `img: '/img/fachada.jpg'`

Mientras `img` esté vacío se muestra el marcador gris con el texto del `alt`. No hay que tocar
ningún componente.

## Sistema visual

| Token | Valor | Uso |
|---|---|---|
| `--cream` | `#FAF7F1` | fondo general |
| `--ink` | `#211A15` | texto principal, header y footer |
| `--gold` | `#C6A15B` | acento, filetes, estados activos |
| `--gold-deep` | `#B38C47` | eyebrows sobre fondo claro |
| `--muted` | `#4D4238` | texto de párrafo |
| `--border` | `#D1C4B3` | bordes de tarjetas |

Tipografías (Google Fonts): **Cinzel** (títulos), **Inter** (interfaz) y **Cormorant Garamond**
itálica (citas).

## Panel administrativo (CRM)

En `/admin` hay un panel con inicio de sesión para manejar **eventos** (con tipos y colores
personalizables, imagen y botón), **solicitudes** que llegan desde Celebraciones y los **ajustes** del sitio
(párroco y horarios). Usa Supabase (gratis). La configuración paso a paso está en
[`supabase/LEEME.md`](supabase/LEEME.md) y el esquema de la base en `supabase/schema.sql`.

```
src/admin/      ← pantallas del panel (se descargan solo al entrar a /admin)
src/lib/        ← conexión con Supabase, fechas en hora de Guatemala y datos para el sitio
supabase/       ← esquema SQL y guía de configuración
```

## Publicar en Cloudflare Pages

1. Subir este proyecto a un repositorio de GitHub (de preferencia en una organización a nombre de la parroquia).
2. En Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** y elegir el repositorio.
3. Configuración de build:
   - Framework preset: **Vite** (o React)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. En **Settings → Variables and Secrets** agregar `VITE_WEB3FORMS_KEY` (formulario de contacto) y
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (CRM). Ver `.env.example`. Volver a desplegar.
5. Listo: queda en `https://<proyecto>.pages.dev`. Cada `git push` a `main` vuelve a publicar.
6. Dominio propio: **Custom domains → Set up a domain**. Cloudflare indica los nameservers que hay que
   enviar al registro del dominio; el HTTPS se activa solo.

Las rutas (`/historia`, `/galeria`…) funcionan al recargar sin configurar nada: Cloudflare Pages sirve
`index.html` cuando no existe un `404.html` en la raíz. **No crear `public/404.html`.**

Sin la clave de Web3Forms, el formulario de contacto abre el correo del visitante con el mensaje listo.

## Datos que la parroquia debe confirmar

En `src/data/site.js`, el objeto `confirmado` controla qué se muestra:

- `cuentas: false` → en Donar se pide llamar al despacho en lugar de mostrar números de cuenta.
- `agradecimientos: false` → la sección de agradecimientos no aparece.

Al recibir los datos reales: reemplazarlos en `site.js` y cambiar la bandera a `true`.

## Pendientes

- Datos reales: números de cuenta, correos, enlaces de redes sociales, horario de visita (¿abre los lunes?) y lista de agradecimientos.
- Fotos que aún faltan: catacumbas y la panorámica de Muybridge (de dominio público).
- Confirmar que la foto de la cruz del atrio corresponde a la cruz papal.
- Autorización de los fotógrafos (Mario Cruz Álvarez y las imágenes con marca «N»).
- Si la parroquia tiene una grabación propia (por ejemplo, el coro del santuario), reemplazar public/audio/canto-gregoriano.mp3.
- Confirmar con la parroquia: números de cuenta, correos, horarios de misa y el aviso legal.
- Crear la clave de Web3Forms con el correo de la parroquia.
