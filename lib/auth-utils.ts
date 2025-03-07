/**
 * Utility functions for authentication and authorization
 */
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type Session } from "@supabase/supabase-js";

/**
 * Create a Supabase client using server-side cookies
 * This function should only be called in server components or server actions
 */
export async function createServerSupabaseClient() {
  // Dynamic import ensures next/headers is only imported on the server
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  return supabase;
}

/**
 * Get the current user's session
 * Server-side only function
 */
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Check if the current user has admin role
 * Server-side only function
 * @returns Boolean indicating if the current user is an admin
 */
export async function isAdmin() {
  const session = await getSession();
  
  if (!session) {
    return false;
  }
  
  const supabase = await createServerSupabaseClient();

  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !userData) {
    return false;
  }

  return userData.role === "admin";
}

/**
 * Get the current user's profile from the database
 * Server-side only function
 * @param session User session
 * @returns User profile data or null if not found
 */
export async function getUserProfile(session: Session | null) {
  if (!session) {
    return null;
  }
  
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}
