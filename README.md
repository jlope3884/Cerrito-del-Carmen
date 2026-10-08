# Cerrito del Carmen — sitio web (demo)

Demo del sitio del Santuario del Cerrito del Carmen, hecha en **React + Vite** con CSS propio
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
| `/historia` | Historia — Pasado · La Virgen · Actualidad |
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
  audio/                ← aquí va canto-gregoriano.mp3 (música ambiental)
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

## Pendientes

- Fotos que aún faltan: catacumbas, vistas aéreas y la fototeca histórica (Muybridge).
- Confirmar que la foto de la cruz del atrio corresponde a la cruz papal.
- Autorización de los fotógrafos (Mario Cruz Álvarez y las imágenes con marca «N»).
- Audio del canto gregoriano.
- Confirmar con la parroquia: números de cuenta, correos, horarios de misa y el aviso legal.
- Conectar el envío real del formulario de contacto.
- Panel administrativo (va aparte, con login y base de datos).
