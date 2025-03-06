"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import type { Competition } from "@/types"
import { ROUTES } from "@/lib/constants"
import { competitionEntrySchema } from "@/lib/validations"
import { formatDate, generateEntryNumber, isCompetitionActive } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

type FormData = z.infer<typeof competitionEntrySchema>

export default function CompetitionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [entryResult, setEntryResult] = useState<{
    success: boolean
    correct: boolean
    message: string
  } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoWatched, setVideoWatched] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(competitionEntrySchema),
  })

  useEffect(() => {
    const fetchCompetition = async () => {
      setIsLoading(true)

      try {
        // Fetch competition details
        const { data: competitionData, error: competitionError } = await supabase
          .from("competitions")
          .select("*")
          .eq("id", id)
          .single()

        if (competitionError) {
          throw competitionError
        }

        if (competitionData) {
          setCompetition(competitionData as Competition)
        }

        // Check if user has already entered this competition
        if (user) {
          const { data: entryData, error: entryError } = await supabase
            .from("entries")
            .select("*")
            .eq("user_id", user.id)
            .eq("competition_id", id)
            .single()

          if (entryData) {
            setHasEntered(true)
          }
        }
      } catch (error) {
        console.error("Error fetching competition:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCompetition()
    }
  }, [id, user])

  const handleVideoEnded = () => {
    setVideoWatched(true)
  }

  const onSubmit = async (data: FormData) => {
    if (!user || !competition) return

    setSubmitting(true)

    try {
      const isCorrect = data.answer.toLowerCase() === competition.correctAnswer.toLowerCase()
      const entryNumber = generateEntryNumber()

      const { error } = await supabase.from("entries").insert([
        {
          user_id: user.id,
          competition_id: competition.id,
          entry_number: entryNumber,
          answer: data.answer,
          correct: isCorrect,
        },
      ])

      if (error) {
        throw error
      }

      setEntryResult({
        success: true,
        correct: isCorrect,
        message: isCorrect
          ? "Congratulations! Your answer is correct. You have been entered into the draw."
          : "Sorry, your answer is incorrect. You can try again.",
      })

      if (isCorrect) {
        setHasEntered(true)
      }
    } catch (error) {
      console.error("Error submitting entry:", error)
      setEntryResult({
        success: false,
        correct: false,
        message: "There was an error submitting your entry. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading competition details...</p>
        </div>
      </div>
    )
  }

  if (!competition) {
    return (
      <div className="container py-12">
        <Card className="card-dark">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-300">Competition Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The competition you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push(ROUTES.COMPETITIONS)}>View All Competitions</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isActive = isCompetitionActive(competition.endsAt)

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="card-dark">
          <CardHeader>
            <div className="mb-2">
              <span
                className={`competition-badge ${isActive ? "competition-badge-active" : "competition-badge-ended"}`}
              >
                {isActive ? "Active" : "Ended"}
              </span>
            </div>
            <CardTitle className="text-2xl text-gray-300">{competition.title}</CardTitle>
            <CardDescription>
              {isActive
                ? `This competition ends on ${formatDate(competition.endsAt)}`
                : `This competition ended on ${formatDate(competition.endsAt)}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="mb-4">{competition.description}</p>
            </div>

            {isActive ? (
              hasEntered ? (
                <div className="bg-success/10 p-6 rounded-lg text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">You've Already Entered!</h3>
                  <p className="text-muted-foreground">
                    Thank you for participating. Winners will be announced after the competition ends.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        src={competition.adUrl}
                        controls
                        className="w-full h-full"
                        onEnded={handleVideoEnded}
                      />
                    </div>
                    <p className="text-sm text-gray-300 text-center">
                      Watch the full video to unlock the entry form
                    </p>
                  </div>

                  {entryResult && (
                    <div className={`p-4 rounded-lg ${entryResult.correct ? "bg-success/10" : "bg-destructive/10"}`}>
                      {entryResult.correct ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-success mr-2" />
                          <p>{entryResult.message}</p>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-destructive mr-2" />
                          <p>{entryResult.message}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="card-dark">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-300">Answer the Question to Enter</CardTitle>
                        <CardDescription>
                          Based on the ad you just watched, please answer the following question:
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2 text-gray-300">{competition.question}</h3>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="answer" className="text-gray-300">Your Answer</Label>
                            <Input id="answer" {...register("answer")} disabled={!videoWatched || submitting} />
                            {errors.answer && <p className="text-sm text-destructive">{errors.answer.message}</p>}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="w-full" disabled={!videoWatched || submitting}>
                          {submitting ? "Submitting..." : "Submit Answer"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </>
              )
            ) : (
              <div className="bg-muted p-6 rounded-lg text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Competition Ended</h3>
                <p className="text-gray-300">
                  This competition has ended. Check out our other active competitions.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push(ROUTES.COMPETITIONS)}>
              Back to All Competitions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

