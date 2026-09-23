import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Client-side Supabase instance using the public ANON key (safe to expose to
// the browser — it only grants what RLS policies allow). Used for student
// auth (sign up / sign in / session). Never import the service-role key here.
//
// Falls back to a harmless placeholder URL when env vars are missing so the
// app can still boot (e.g. reviewing UI without Supabase configured yet);
// any actual auth call will then fail with a clear network/config error
// instead of crashing the whole page at import time.
export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder-anon-key')

export const isSupabaseConfigured = Boolean(url && anonKey)
