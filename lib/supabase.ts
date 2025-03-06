import { createClient } from "@supabase/supabase-js"

// Helper function to ensure the Supabase URL has the https:// prefix
function getFormattedSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Otherwise, add the https:// prefix
  return `https://${url}`
}

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = getFormattedSupabaseUrl(rawSupabaseUrl)
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

