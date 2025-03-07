"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { signInSchema } from "@/lib/validations"
import { useAuth } from "@/contexts/auth-context"
import { ROUTES } from "@/lib/constants"
import { saveRedirectUrl } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type FormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save the redirect URL from query params if available
  useEffect(() => {
    const redirectTo = searchParams.get('redirect_to')
    if (redirectTo) {
      saveRedirectUrl(redirectTo)
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(data.email, data.password)

      if (!result.success) {
        setError(result.error || "Invalid email or password")
      }
      // No need to redirect here as the auth context will handle it
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="container max-w-md">
        <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Sign In</CardTitle>
              <CardDescription className="text-gray-300">Sign in to your account to enter competitions and check your prizes.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" {...register("password")} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-gray-300">
                  Don't have an account?{" "}
                  <Link href={ROUTES.SIGN_UP} className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
      </div>
    </div>
  )
}

