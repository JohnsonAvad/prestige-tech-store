import { createClient } from '@supabase/supabase-js';

// IMPORTANT: this uses the SERVICE ROLE key, not the anon key your frontend uses.
// NEVER expose this key in frontend code or a VITE_ variable — it must only
// ever be read here, on the server, from a non-VITE_ env var.
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);