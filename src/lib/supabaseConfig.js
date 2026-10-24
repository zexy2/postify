// Lightweight public configuration used before loading the optional Supabase client.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
