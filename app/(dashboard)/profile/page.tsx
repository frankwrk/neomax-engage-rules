"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import { profileUpdateSchema } from "@/lib/validations"
import { AGE_RANGES, COUNTIES, INTEREST_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle } from "lucide-react"

type FormData = z.infer<typeof profileUpdateSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      mobileNumber: user?.mobileNumber || "",
      gender: (user?.gender as "male" | "female" | "other") || "male",
      ageRange: user?.ageRange || "",
      county: user?.county || "",
      interests: user?.interests || [],
    },
  })

  const onSubmit = async (data: FormData) => {
    if (!user) return

    setIsLoading(true)
    setUpdateSuccess(false)
    setUpdateError(null)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: data.fullName,
          mobile_number: data.mobileNumber,
          gender: data.gender,
          age_range: data.ageRange,
          county: data.county,
          interests: data.interests,
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      setUpdateSuccess(true)
    } catch (error) {
      console.error("Error updating profile:", error)
      setUpdateError("There was an error updating your profile. Please try again.")
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
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and preferences.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {updateSuccess && (
                  <div className="bg-success/10 text-success p-3 rounded-md flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Your profile has been updated successfully.</span>
                  </div>
                )}

                {updateError && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>{updateError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" type="text" {...register("fullName")} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input id="mobileNumber" type="tel" placeholder="+353 12 345 6789" {...register("mobileNumber")} />
                  {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
                    defaultValue={watch("gender")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ageRange">Age Range</Label>
                  <Select onValueChange={(value) => setValue("ageRange", value)} defaultValue={watch("ageRange")}>
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
                  <Label htmlFor="county">County</Label>
                  <Select onValueChange={(value) => setValue("county", value)} defaultValue={watch("county")}>
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

                <div className="space-y-2">
                  <Label>Interests (select at least 3)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_CATEGORIES.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={selectedInterests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest}>{interest}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

