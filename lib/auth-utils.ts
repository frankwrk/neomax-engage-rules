/**
 * Utility functions for authentication and authorization
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Session } from "@supabase/supabase-js";

/**
 * Get the current user's session from Supabase auth
 * @returns The user session or null if not authenticated
 */
export async function getSession() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Check if the current user has admin role
 * @returns Boolean indicating if the current user is an admin
 */
export async function isAdmin() {
  const session = await getSession();
  
  if (!session) {
    return false;
  }
  
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

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
 * @param session User session
 * @returns User profile data or null if not found
 */
export async function getUserProfile(session: Session | null) {
  if (!session) {
    return null;
  }
  
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

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
