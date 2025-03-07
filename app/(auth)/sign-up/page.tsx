"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { signUpSchema } from "@/lib/validations"
import { useAuth } from "@/contexts/auth-context"
import { ROUTES, AGE_RANGES, COUNTIES, INTEREST_CATEGORIES } from "@/lib/constants"
import { saveRedirectUrl } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


type FormData = z.infer<typeof signUpSchema>

function SignUpForm() {
  const { signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  
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
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      interests: [],
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp(data)

      if (result.success) {
        router.push(ROUTES.DASHBOARD)
      } else {
        setError(result.error || "An error occurred during sign up")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    let updatedInterests: string[]

    if (checked) {
      updatedInterests = [...selectedInterests, interest]
    } else {
      updatedInterests = selectedInterests.filter((i) => i !== interest)
    }

    setSelectedInterests(updatedInterests)
    setValue("interests", updatedInterests)
  }

  return (
    <div className="py-12">
      <div className="container max-w-3xl">
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Create an Account</CardTitle>
              <CardDescription className="text-gray-300">Sign up to start entering competitions and winning prizes.</CardDescription>
            </CardHeader>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Password</Label>
                      <Input id="password" type="password" {...register("password")} />
                      {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                      <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                      <Input id="fullName" type="text" {...register("fullName")} />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber" className="text-gray-300">Mobile Number</Label>
                      <Input id="mobileNumber" type="tel" placeholder="+353 12 345 6789" {...register("mobileNumber")} />
                      {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Gender</Label>
                      <div className="h-10 flex items-center"> 
                        <RadioGroup
                          onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
                          defaultValue={watch("gender")}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="text-gray-300">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="text-gray-300">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other" className="text-gray-300">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ageRange" className="text-gray-300">Age Range</Label>
                      <Select onValueChange={(value) => setValue("ageRange", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_RANGES.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.ageRange && <p className="text-sm text-destructive">{errors.ageRange.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="county" className="text-gray-300">County</Label>
                      <Select onValueChange={(value) => setValue("county", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTIES.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.county && <p className="text-sm text-destructive">{errors.county.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Interests section - full width */}
                <div className="col-span-1 md:col-span-2 space-y-2 mt-6">
                  <Label className="text-gray-300">Interests (select at least 3)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {INTEREST_CATEGORIES.map((interest) => (
                      <div key={interest} className="flex items-center space-x-3">
                        <Checkbox
                          id={interest}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-gray-300">{interest}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                </div>
                
                {/* Terms acceptance - full width */}
                <div className="col-span-1 md:col-span-2 mt-6">
                  <div className="flex items-center space-x-2 mb-1">
                    <Checkbox
                      id="termsAccepted"
                      onCheckedChange={(checked) => setValue("termsAccepted", checked as boolean)}
                    />
                    <Label htmlFor="termsAccepted" className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.termsAccepted && <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                <p className="text-sm text-center text-gray-300">
                  Already have an account?{" "}
                  <Link href={ROUTES.SIGN_IN} className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
      </div>
    </div>
  )
}

// Main page component with suspense boundary
export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="py-12">
        <div className="container max-w-md">
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Sign Up</CardTitle>
              <CardDescription className="text-gray-300">Create an account to enter competitions and win prizes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="skeleton-form space-y-2"></div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" disabled>Loading...</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
