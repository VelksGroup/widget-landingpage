import { createClient } from '@supabase/supabase-js';

// Isolated on purpose (VITE_DEMO_SUPABASE_*, not VITE_SUPABASE_*): this points
// at the VELKS Demo Factory project only. Keeping the name distinct means the
// rest of the app can never accidentally start depending on the demo runtime's
// database just because a var named "VITE_SUPABASE_URL" happened to exist.
const url = import.meta.env.VITE_DEMO_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_DEMO_SUPABASE_ANON_KEY as string | undefined;

/** Browser client — anon key only, RLS-restricted to published demo data. Never import service-role keys here. */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
