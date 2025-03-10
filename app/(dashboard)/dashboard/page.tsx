"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import type { Competition, Entry } from "@/types"
import { ROUTES } from "@/lib/constants"
import { formatDate, truncateText } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>([])
  const [userEntries, setUserEntries] = useState<(Entry & { competitionTitle?: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)

      try {
        // Fetch active competitions
        const { data: competitionsData } = await supabase?.from("competitions")
          .select("*")
          .filter("ends_at", "gt", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(3) || { data: null }

        if (competitionsData) {
          // Convert snake_case database fields to camelCase for the Competition type
          const formattedCompetitions: Competition[] = competitionsData.map(comp => ({
            id: comp.id as string,
            title: comp.title as string,
            description: comp.description as string,
            adUrl: comp.ad_url as string,
            question: comp.question as string,
            correctAnswer: comp.correct_answer as string,
            createdAt: comp.created_at as string,
            endsAt: comp.ends_at as string
          }))
          setActiveCompetitions(formattedCompetitions)
        }

        // Fetch user entries
        if (user) {
          // Fetch entries first
          const { data: entriesData } = await supabase?.from("entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }) || { data: null }
            
          // Define interface for the enhanced entry with competition data
          interface EntryWithCompetition {
            id: string;
            user_id: string;
            competition_id: string;
            entry_number: string;
            answer: string;
            correct: boolean;
            created_at: string;
            competitionData?: {
              id: string;
              title: string;
              description: string;
              ad_url: string;
              question: string;
              correct_answer: string;
              created_at: string;
              ends_at: string;
            } | null;
            [key: string]: unknown; // For any other fields in the database response
          }

          // Get competition data separately for better type safety
          let entriesWithCompetitions: EntryWithCompetition[] = [];
          // Type guard to ensure entriesData has the expected structure
          type DatabaseEntry = {
            id: string;
            user_id: string;
            competition_id: string;
            entry_number: string;
            answer: string;
            correct: boolean;
            created_at: string;
            [key: string]: unknown;
          };

          // Function to check if an entry has the required properties
          function isDatabaseEntry(entry: unknown): entry is DatabaseEntry {
            return (
              typeof entry === 'object' &&
              entry !== null &&
              'id' in entry &&
              'user_id' in entry &&
              'competition_id' in entry &&
              'entry_number' in entry &&
              'answer' in entry &&
              'correct' in entry &&
              'created_at' in entry
            );
          }

          if (entriesData && Array.isArray(entriesData) && entriesData.length > 0) {
            // Create a properly typed array of validated entries
            const validatedEntries = entriesData.filter(isDatabaseEntry);

            entriesWithCompetitions = await Promise.all(
              validatedEntries.map(async (entry) => {
                const { data: competitionData } = await supabase?.from("competitions")
                  .select("*")
                  .eq("id", entry.competition_id)
                  .single() || { data: null };
                return {
                  ...entry,
                  competitionData
                } as EntryWithCompetition;
              })
            );
          }

          if (entriesWithCompetitions && entriesWithCompetitions.length > 0) {
            // Convert snake_case database fields to camelCase for the Entry type
            // Map entries and add title from joined competitions data
            const formattedEntries: (Entry & { competitionTitle?: string })[] = entriesWithCompetitions.map(entry => ({
              id: entry.id as string,
              userId: entry.user_id as string,
              competitionId: entry.competition_id as string,
              entryNumber: entry.entry_number as string,
              answer: entry.answer as string,
              correct: entry.correct as boolean,
              createdAt: entry.created_at as string,
              competitionTitle: entry.competitionData?.title as string
            }))
            setUserEntries(formattedEntries)
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, {user?.fullName?.split(" ")[0] || "User"}</h1>
        <p className="text-gray-300 mt-1">Here's what's happening with your competitions and entries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Competitions</CardTitle>
            <Trophy className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCompetitions.length}</div>
            <p className="text-xs text-gray-300">Competitions you can enter today</p>
          </CardContent>
        </Card>

        <Card className="card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Entries</CardTitle>
            <Calendar className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEntries.length}</div>
            <p className="text-xs text-gray-300">Total competition entries</p>
          </CardContent>
        </Card>

        <Card className="card-dark">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userEntries.filter((entry) => entry.correct).length}</div>
            <p className="text-xs text-gray-300">Entries with correct answers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="competitions" className="space-y-4">
        <TabsList className="bg-secondary/50 border border-gray-700">
          <TabsTrigger value="competitions">Active Competitions</TabsTrigger>
          <TabsTrigger value="entries">Your Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="competitions" className="space-y-4">
          {activeCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCompetitions.map((competition) => (
                <Card key={competition.id} className="prize-card">
                  <div className="aspect-video bg-secondary/50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=200&width=400"
                        alt={competition.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <span className="competition-badge competition-badge-active">Active</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{competition.title}</h3>
                    <p className="text-gray-300 mb-4">{truncateText(competition.description, 100)}</p>
                    <p className="text-sm text-gray-300 mb-4">Ends: {formatDate(competition.endsAt)}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={ROUTES.COMPETITION(competition.id)} className="w-full">
                      <Button className="w-full">Enter Competition</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-dark">
              <CardContent className="py-8 text-center">
                <p className="text-gray-300">
                  There are no active competitions at the moment. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center">
            <Link href={ROUTES.COMPETITIONS}>
              <Button variant="outline">View All Competitions</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="space-y-4">
          {userEntries.length > 0 ? (
            <div className="space-y-4">
              {userEntries.map((entry) => (
                <Card key={entry.id} className="card-dark">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {entry.competitionTitle || "Competition Entry"}
                        </h3>
                        <p className="text-sm text-gray-300">Entry Number: {entry.entryNumber}</p>
                        <p className="text-sm text-gray-300">Date: {formatDate(entry.createdAt)}</p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span
                          className={`competition-badge ${entry.correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}
                        >
                          {entry.correct ? "Correct Answer" : "Incorrect Answer"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-dark">
              <CardContent className="py-8 text-center">
                <p className="text-gray-300">
                  You haven't entered any competitions yet. Start now to win prizes!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

