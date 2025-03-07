"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured, createBrowserSupabaseClient } from "@/lib/supabase"
import type { User, UserRegistrationFormValues } from "@/types"
import { ROUTES } from "@/lib/constants"
import { Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (userData: UserRegistrationFormValues) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      console.error("Supabase is not configured. Authentication will not work.")
      setIsLoading(false)
      return
    }

    // Create a local supabase client instance for this component
    const client = createBrowserSupabaseClient()

    const fetchUser = async () => {
      try {
        const { data: { session } } = await client.auth.getSession()

        if (session) {
          await updateUserState(session)
        }
      } catch (error) {
        console.error("Error fetching user session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Helper function to convert database user to app User type
    const updateUserState = async (session: Session) => {
      try {
        const { data: userData, error } = await client
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching user data:", error)
          return
        }

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            fullName: userData.full_name,
            mobileNumber: userData.mobile_number,
            gender: userData.gender,
            ageRange: userData.age_range,
            county: userData.county,
            interests: userData.interests,
            createdAt: userData.created_at,
            role: userData.role
          })
        }
      } catch (error) {
        console.error("Error processing user data:", error)
      }
    }

    // Set up auth subscription for handling auth state changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          await updateUserState(session)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      }
    )

    return () => {
      // Clean up subscription when component unmounts
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      // Create a fresh client instance for this operation
      const client = createBrowserSupabaseClient()
      
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data || !data.user) {
        return { success: false, error: "Authentication failed" }
      }

      const { data: userData, error: userError } = await client
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        console.error("Error fetching user data after login:", userError)
        return { success: true } // Still return success since auth worked
      }

      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name,
          mobileNumber: userData.mobile_number,
          gender: userData.gender,
          ageRange: userData.age_range,
          county: userData.county,
          interests: userData.interests,
          createdAt: userData.created_at,
          role: userData.role
        })
        
        // Redirect based on user role
        if (userData.role === 'admin') {
          router.push(ROUTES.ADMIN.DASHBOARD)
        } else {
          router.push(ROUTES.DASHBOARD)
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during sign in",
      }
    }
  }

  const signUp = async (userData: UserRegistrationFormValues) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      // Create a fresh client instance for this operation
      const client = createBrowserSupabaseClient()
      
      const { data, error } = await client.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data?.user) {
        const { error: insertError } = await client
          .from("users")
          .insert([
            {
              id: data.user.id,
              email: userData.email,
              full_name: userData.fullName,
              mobile_number: userData.mobileNumber,
              gender: userData.gender,
              age_range: userData.ageRange,
              county: userData.county,
              interests: userData.interests,
              role: "user", // Default role for new users
            },
          ])

        if (insertError) {
          console.error("Error creating user profile:", insertError)
          return { success: false, error: insertError.message }
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during sign up",
      }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        const client = createBrowserSupabaseClient()
        await client.auth.signOut()
        setUser(null)
        router.push(ROUTES.HOME)
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

