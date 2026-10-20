-- ============================================================================
-- CRM del Santuario del Cerrito del Carmen — esquema de base de datos (Supabase)
--
-- Cómo usarlo: Supabase → SQL Editor → pegar este archivo completo → Run.
-- Se puede volver a correr sin romper nada (usa "if not exists" / "or replace").
--
-- Seguridad: todas las tablas tienen RLS activado. El público (clave anon) solo
-- puede LEER eventos publicados, tipos, ajustes y horarios, y CREAR solicitudes.
-- Todo lo demás requiere iniciar sesión con una cuenta registrada en `admins`.
-- ============================================================================

-- ---------- Administradores ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '',
  creado_en timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Tipos de evento (personalizables: nombre y color) ----------
create table if not exists public.tipos_evento (
  id bigint generated always as identity primary key,
  nombre text not null unique check (char_length(nombre) between 1 and 60),
  color text not null default '#C6A15B' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  orden int not null default 0
);

-- ---------- Eventos ----------
create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  titulo text not null check (char_length(titulo) between 1 and 140),
  tipo_id bigint references public.tipos_evento (id) on delete set null,
  inicio timestamptz not null,
  fin timestamptz,
  todo_el_dia boolean not null default false,
  lugar text not null default '' check (char_length(lugar) <= 140),
  descripcion text not null default '' check (char_length(descripcion) <= 4000),
  imagen_url text not null default '',
  publicado boolean not null default true,
  destacado boolean not null default false,
  boton_texto text not null default '' check (char_length(boton_texto) <= 40),
  boton_url text not null default '' check (boton_url = '' or boton_url ~ '^https?://'),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fin_despues_de_inicio check (fin is null or fin >= inicio)
);
create index if not exists eventos_inicio_idx on public.eventos (inicio);

-- ---------- Ajustes del sitio (una sola fila) ----------
create table if not exists public.ajustes (
  id int primary key default 1 check (id = 1),
  parroco text not null default 'Padre Edwin Muñoz',
  horario_visita text not null default '',
  aviso_horarios text not null default '',
  telefono text not null default '',
  correo text not null default '',
  actualizado_en timestamptz not null default now()
);

-- ---------- Horarios de misa ----------
create table if not exists public.horarios_misa (
  id bigint generated always as identity primary key,
  orden int not null default 0,
  dias text not null check (char_length(dias) between 1 and 60),
  hora text not null check (char_length(hora) between 1 and 60),
  detalle text not null default '' check (char_length(detalle) <= 300)
);

-- ---------- Solicitudes que llegan desde el sitio ----------
create table if not exists public.solicitudes (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  tipo text not null check (tipo in ('Bautismo','Primera Comunión','Confirmación','Matrimonio','Reconciliación','Unción de los enfermos','Otra celebración')),
  nombre text not null check (char_length(nombre) between 1 and 120),
  telefono text not null default '' check (char_length(telefono) <= 40),
  correo text not null default '' check (char_length(correo) <= 160),
  fecha_preferida date,
  mensaje text not null default '' check (char_length(mensaje) <= 3000),
  consentimiento boolean not null check (consentimiento),
  estado text not null default 'nueva' check (estado in ('nueva','en_proceso','confirmada','cerrada')),
  notas_internas text not null default '',
  constraint contacto_obligatorio check (telefono <> '' or correo <> '')
);
create index if not exists solicitudes_creado_idx on public.solicitudes (creado_en desc);

-- ---------- Marca de actualización ----------
create or replace function public.marcar_actualizado()
returns trigger language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end $$;

drop trigger if exists eventos_actualizado on public.eventos;
create trigger eventos_actualizado before update on public.eventos
  for each row execute function public.marcar_actualizado();
drop trigger if exists ajustes_actualizado on public.ajustes;
create trigger ajustes_actualizado before update on public.ajustes
  for each row execute function public.marcar_actualizado();

-- ============================================================================
-- Permisos (Row Level Security)
-- ============================================================================
alter table public.admins enable row level security;
alter table public.tipos_evento enable row level security;
alter table public.eventos enable row level security;
alter table public.ajustes enable row level security;
alter table public.horarios_misa enable row level security;
alter table public.solicitudes enable row level security;

-- admins: cada admin ve la lista; solo se modifica desde el panel de Supabase
drop policy if exists admins_leer on public.admins;
create policy admins_leer on public.admins for select to authenticated using (public.is_admin());

-- tipos de evento: lectura pública, escritura de admins
drop policy if exists tipos_leer on public.tipos_evento;
create policy tipos_leer on public.tipos_evento for select to anon, authenticated using (true);
drop policy if exists tipos_admin on public.tipos_evento;
create policy tipos_admin on public.tipos_evento for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- eventos: el público solo ve los publicados; los admins ven y editan todo
drop policy if exists eventos_leer_publicados on public.eventos;
create policy eventos_leer_publicados on public.eventos for select to anon, authenticated using (publicado or public.is_admin());
drop policy if exists eventos_admin on public.eventos;
create policy eventos_admin on public.eventos for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ajustes y horarios: lectura pública, escritura de admins
drop policy if exists ajustes_leer on public.ajustes;
create policy ajustes_leer on public.ajustes for select to anon, authenticated using (true);
drop policy if exists ajustes_admin on public.ajustes;
create policy ajustes_admin on public.ajustes for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists horarios_leer on public.horarios_misa;
create policy horarios_leer on public.horarios_misa for select to anon, authenticated using (true);
drop policy if exists horarios_admin on public.horarios_misa;
create policy horarios_admin on public.horarios_misa for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- solicitudes: el público solo puede CREAR (siempre como "nueva" y sin notas); nadie del público las lee
drop policy if exists solicitudes_crear on public.solicitudes;
create policy solicitudes_crear on public.solicitudes for insert to anon, authenticated
  with check (estado = 'nueva' and notas_internas = '' and consentimiento);
drop policy if exists solicitudes_admin on public.solicitudes;
create policy solicitudes_admin on public.solicitudes for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- El público no puede leer el id generado de una solicitud: se inserta sin "returning".
-- Privilegios por tabla (Supabase ya los da; se repiten para que el archivo sea explícito)
grant select on public.tipos_evento, public.eventos, public.ajustes, public.horarios_misa to anon, authenticated;
grant insert on public.solicitudes to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke select on public.solicitudes from anon;

-- ============================================================================
-- Imágenes de eventos (Supabase Storage)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('eventos', 'eventos', true)
on conflict (id) do nothing;

drop policy if exists eventos_img_leer on storage.objects;
create policy eventos_img_leer on storage.objects for select to anon, authenticated
  using (bucket_id = 'eventos');
drop policy if exists eventos_img_subir on storage.objects;
create policy eventos_img_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'eventos' and public.is_admin());
drop policy if exists eventos_img_editar on storage.objects;
create policy eventos_img_editar on storage.objects for update to authenticated
  using (bucket_id = 'eventos' and public.is_admin());
drop policy if exists eventos_img_borrar on storage.objects;
create policy eventos_img_borrar on storage.objects for delete to authenticated
  using (bucket_id = 'eventos' and public.is_admin());

-- ============================================================================
-- Datos iniciales (solo si las tablas están vacías)
-- ============================================================================
insert into public.ajustes (id, parroco, horario_visita, aviso_horarios, telefono, correo)
values (1, 'Padre Edwin Muñoz', 'Todos los días, de 6:00 a 18:00 h',
  'Los horarios pueden variar durante la fiesta patronal y las celebraciones especiales. Confírmalos con el santuario antes de tu visita.',
  '2232 4988', 'info@cerritodelcarmen.gt')
on conflict (id) do nothing;

insert into public.horarios_misa (orden, dias, hora, detalle)
select * from (values
  (1, 'Martes a viernes', '7:00 h', 'Misa diaria entre semana en el templo del santuario.'),
  (2, 'Domingo', '9:00, 11:00 y 16:00 h', 'Tres celebraciones dominicales; la de 11:00 se transmite en línea.'),
  (3, 'Sábado y lunes', 'Sin misa', 'El sábado no hay celebración y el lunes el templo permanece cerrado.')
) v
where not exists (select 1 from public.horarios_misa);

insert into public.tipos_evento (nombre, color, orden)
select * from (values
  ('Fiesta patronal', '#B38C47', 1),
  ('Procesión', '#8A3B2E', 2),
  ('Misa especial', '#2F5D50', 3),
  ('Sacramentos', '#3C5A8A', 4),
  ('Cultural', '#6B4E7A', 5)
) v
where not exists (select 1 from public.tipos_evento);
