"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User, UserRegistrationFormValues } from "@/types"
import { ROUTES } from "@/lib/constants"

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

    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase?.auth.getSession() || { data: { session: null } }

      if (session) {
        const { data: userData } = await supabase?.from("users").select("*").eq("id", session.user.id).single() || { data: null }

        if (userData) {
          setUser({
            id: userData.id as string,
            email: userData.email as string,
            fullName: userData.full_name as string,
            mobileNumber: userData.mobile_number as string,
            gender: userData.gender as "male" | "female" | "other",
            ageRange: userData.age_range as string,
            county: userData.county as string,
            interests: userData.interests as string[],
            createdAt: userData.created_at as string
          })
        }
      }

      setIsLoading(false)
    }

    fetchUser()

    // Get the auth subscription for handling auth state changes
    // Define a fallback response for handling the case when supabase client isn't available
    const authChangeResponse = supabase?.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: userData } = await supabase?.from("users").select("*").eq("id", session.user.id).single() || { data: null }

        if (userData) {
          setUser({
            id: userData.id as string,
            email: userData.email as string,
            fullName: userData.full_name as string,
            mobileNumber: userData.mobile_number as string,
            gender: userData.gender as "male" | "female" | "other",
            ageRange: userData.age_range as string,
            county: userData.county as string,
            interests: userData.interests as string[],
            createdAt: userData.created_at as string
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      // Clean up subscription when component unmounts
      if (authChangeResponse && 'data' in authChangeResponse) {
        const { data } = authChangeResponse;
        if (data && 'subscription' in data) {
          data.subscription.unsubscribe();
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      const authResponse = await supabase?.auth.signInWithPassword({
        email,
        password,
      }) || { data: null, error: new Error("Authentication failed") }

      if (authResponse.error) {
        return { success: false, error: authResponse.error.message }
      }

      if (!authResponse.data || !authResponse.data.user) {
        return { success: false, error: "Authentication failed" }
      }

      const { data: userData } = await supabase?.from("users").select("*").eq("id", authResponse.data.user.id).single() || { data: null }

      if (userData) {
        setUser({
          id: userData.id as string,
          email: userData.email as string,
          fullName: userData.full_name as string,
          mobileNumber: userData.mobile_number as string,
          gender: userData.gender as "male" | "female" | "other",
          ageRange: userData.age_range as string,
          county: userData.county as string,
          interests: userData.interests as string[],
          createdAt: userData.created_at as string
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
      const authResponse = await supabase?.auth.signUp({
        email: userData.email,
        password: userData.password,
      }) || { data: null, error: new Error("Signup failed") }

      if (authResponse.error) {
        return { success: false, error: authResponse.error.message }
      }

      if (authResponse.data?.user) {
        const insertResponse = await supabase?.from("users").insert([
          {
            id: authResponse.data.user.id,
            email: userData.email,
            full_name: userData.fullName,
            mobile_number: userData.mobileNumber,
            gender: userData.gender,
            age_range: userData.ageRange,
            county: userData.county,
            interests: userData.interests,
          },
        ])

        if (insertResponse?.error) {
          return { success: false, error: insertResponse.error.message }
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
      await supabase?.auth.signOut()
    }
    setUser(null)
    router.push(ROUTES.HOME)
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

