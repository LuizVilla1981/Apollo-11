import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { reportError } from '../utils/logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  reportError(
    '[Supabase] Variáveis ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local para habilitar os formulários públicos.',
    { hasUrl: Boolean(supabaseUrl), hasAnonKey: Boolean(supabaseAnonKey) }
  );
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export const hasSupabaseEnv = isConfigured;