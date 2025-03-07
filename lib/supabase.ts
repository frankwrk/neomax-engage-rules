"use client"

import { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"

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

// This is the browser client that will be used in client components
if (typeof window !== "undefined") {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")
  } else {
    try {
      // Use createBrowserClient for client-side components
      supabase = createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
      )
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
    }
  }
}

/**
 * Returns the browser Supabase client
 * This should only be used in client components
 */
export { supabase }

/**
 * Create a new Supabase client instance
 * @returns A Supabase client instance
 */
export function createClient() {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. This can happen if environment variables are missing or if called in a server component.')
  }
  return supabase
}

/**
 * Checks if the Supabase client is configured
 * @returns boolean indicating if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null && !!supabaseUrl && !!supabaseAnonKey
}

/**
 * Creates a new browser Supabase client
 * This can be used in situations where you need a fresh client instance
 * @returns A new Supabase client instance
 */
export function createBrowserSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing. Please check your environment variables.")
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

