"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User } from "@/types"
import { ROUTES } from "@/lib/constants"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (userData: any) => Promise<{ success: boolean; error?: string }>
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
      } = await supabase!.auth.getSession()

      if (session) {
        const { data: userData } = await supabase!.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setUser(userData as User)
        }
      }

      setIsLoading(false)
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: userData } = await supabase!.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setUser(userData as User)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", data.user.id).single()

      if (userData) {
        setUser(userData as User)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred during sign in",
      }
    }
  }

  const signUp = async (userData: any) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured" }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: userData.email,
            full_name: userData.fullName,
            mobile_number: userData.mobileNumber,
            gender: userData.gender,
            age_range: userData.ageRange,
            county: userData.county,
            interests: userData.interests,
          },
        ])

        if (profileError) {
          return { success: false, error: profileError.message }
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
      await supabase!.auth.signOut()
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

