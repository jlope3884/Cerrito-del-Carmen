/** Datos de conexión del CRM (Supabase). Ver .env.example y supabase/LEEME.md */
export const URL_CRM = import.meta.env.VITE_SUPABASE_URL || ''
export const CLAVE_CRM = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/** ¿Está configurado el CRM? (sin cargar la librería de Supabase) */
export const hayCRM = Boolean(URL_CRM && CLAVE_CRM)
