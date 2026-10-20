/**
 * Conexión con Supabase (base de datos del CRM).
 * Se configura con las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver .env.example).
 * Si no están, el sitio funciona igual con los datos fijos de src/data/site.js
 * y el panel /admin muestra cómo configurarlo.
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && clave ? createClient(url, clave) : null
export const crmActivo = Boolean(supabase)
