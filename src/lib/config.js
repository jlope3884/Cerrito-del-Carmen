/** ¿Está configurado el CRM? (sin cargar la librería de Supabase) */
export const hayCRM = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
