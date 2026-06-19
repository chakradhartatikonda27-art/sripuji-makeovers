import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY!

export const supabaseBrowser = () =>
  createBrowserClient(SUPABASE_URL, SUPABASE_ANON)

export const supabaseAdmin = () =>
  createClient(SUPABASE_URL, SUPABASE_SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
