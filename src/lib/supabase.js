/**
 * Conexión con Supabase para el panel /admin (inicio de sesión, edición e imágenes).
 * El sitio público no la usa: lee y envía datos con src/lib/rest.js, más liviano.
 * Se configura con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver .env.example);
 * sin ellas, el panel muestra cómo configurarlo.
 */
import { createClient } from '@supabase/supabase-js'
import { URL_CRM, CLAVE_CRM, hayCRM } from './config.js'

export const supabase = hayCRM ? createClient(URL_CRM, CLAVE_CRM) : null
