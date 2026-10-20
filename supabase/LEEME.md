# CRM del santuario — configuración de Supabase

El panel está en **`/admin`** (por ejemplo `https://cerritodelcarmen.pages.dev/admin`). Desde ahí se manejan:

- **Eventos**: crear, editar, duplicar, borrar, publicar/ocultar y destacar en Inicio. Cada evento tiene título,
  tipo, fecha y hora (o todo el día, o varios días), lugar, descripción, imagen y un botón opcional con enlace.
- **Tipos de evento**: nombre y color de cada tipo (Fiesta patronal, Procesión, etc.).
- **Solicitudes**: lo que la gente pide desde la página de Celebraciones; estado, notas internas y exportar a CSV.
- **Ajustes del sitio**: párroco, teléfono, correo, horario de visita y horarios de misa.

Lo que se publica en el panel aparece solo en el sitio (agenda de Celebraciones, «Próximos eventos» en Inicio,
horarios de misa, párroco). Si Supabase no está configurado o falla, el sitio usa los datos de `src/data/site.js`.

## 1. Crear el proyecto (una sola vez, ~15 min)

1. Entrar a <https://supabase.com> con el **Gmail de la parroquia** y crear un proyecto
   (región más cercana: *East US*; guardar la contraseña de la base de datos en un lugar seguro).
2. **SQL Editor → New query** → pegar todo `supabase/schema.sql` → **Run**.
   Crea las tablas, los permisos, la carpeta de imágenes `eventos` (máx. 5 MB; solo JPG, PNG o WebP) y los
   datos iniciales. Se puede volver a correr cuando el archivo cambie: no borra datos.
3. **Authentication → Sign In / Providers → Email**: desactivar **«Allow new users to sign up»**.
   Así nadie puede crearse una cuenta por su cuenta.
4. **Authentication → URL Configuration**: *Site URL* = `https://<dominio>` y en *Redirect URLs* agregar
   `https://<dominio>/admin` (con el dominio real del sitio). Sin esto, el enlace de «¿Olvidaste tu contraseña?»
   que llega por correo no regresa al panel para escribir la contraseña nueva.
5. **Authentication → Users → Add user → Create new user**: correo y contraseña de quien va a usar el panel
   (marcar *Auto Confirm User*).
6. Darle permiso de administrador. En **SQL Editor**:

   ```sql
   insert into public.admins (user_id, nombre)
   select id, 'Padre Edwin Muñoz' from auth.users where email = 'correo@ejemplo.com';
   ```

## 2. Conectar el sitio

En **Project Settings → API** copiar *Project URL* y la clave **anon public**.

- **En Cloudflare Pages** → *Settings → Variables and Secrets*:
  `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Luego *Deployments → Retry deployment*.
- **En la compu, para desarrollo**: crear `.env.local` (no se sube a GitHub) con las mismas dos variables.

> La clave *anon* es pública por diseño; la seguridad la dan las reglas (RLS) del `schema.sql`.
> **Nunca** usar la clave `service_role` en el sitio.

## 3. Probar

1. Abrir `/admin`, iniciar sesión y crear un evento publicado con fecha futura.
2. Abrir `/celebraciones`: debe salir en «Próximas celebraciones». Si se marcó «Destacar», también en Inicio.
3. Enviar una solicitud de prueba desde `/celebraciones#solicitar` y verla en *Solicitudes*.

## Seguridad y mantenimiento

- El público solo puede **leer** eventos publicados, tipos, ajustes y horarios, y **crear** solicitudes.
  No puede leer solicitudes ni modificar nada. Las solicitudes nuevas siempre entran como «Nueva», sin notas y con
  la hora del servidor; si llegan más de 20 en 10 minutos (envío masivo), las siguientes se rechazan y el sitio
  pide intentarlo más tarde. Un usuario que inicia sesión pero no está en `admins` no ve nada privado.
- **Olvido de contraseña**: en `/admin`, «¿Olvidaste tu contraseña?» envía un enlace; al abrirlo, el panel pide la
  contraseña nueva (mínimo 8 caracteres). Requiere el paso 4.
- **Copias**: el plan gratis no descarga respaldos. Exportar las solicitudes a CSV una vez al mes
  y guardarlas en el Drive de la parroquia.
- **Pausa por inactividad**: Supabase pausa los proyectos gratis después de 7 días sin uso. El sitio consulta la
  base en cada visita, lo que cuenta como uso. Si alguna vez se pausa, entrar a supabase.com y pulsar *Restore*;
  mientras tanto el sitio sigue funcionando con los datos de `site.js`.
- **Agregar otra persona al panel**: repetir los pasos 5 y 6. **Quitarla**: borrar el usuario en *Authentication → Users*.
