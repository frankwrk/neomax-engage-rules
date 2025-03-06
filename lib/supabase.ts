import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | null = null

if (typeof window !== "undefined") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")
  } else {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
    }
  }
}

export { supabase }

export function isSupabaseConfigured(): boolean {
  return supabase !== null
}

