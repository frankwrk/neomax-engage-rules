"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Competition } from "@/types"
import { ROUTES } from "@/lib/constants"
import { formatDate, isCompetitionActive, truncateText } from "@/lib/utils"
import { getCompetitionEntryCount } from "@/lib/entry-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, AlertCircle, Users, Clock } from "lucide-react"

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<(Competition & { entryCount: number })[]>([])
  const [filteredCompetitions, setFilteredCompetitions] = useState<(Competition & { entryCount: number })[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoading(true)
      setError(null)

      if (!isSupabaseConfigured()) {
        setError("Supabase is not configured. Please check your environment variables.")
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("competitions")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          if (error.message.includes('relation "public.competitions" does not exist')) {
            setError("The competitions table does not exist in the database. Please set up your database schema.")
          } else {
            throw error
          }
        } else if (data) {
          const competitionsWithEntries = await Promise.all(
            (data as Competition[]).map(async (competition) => {
              const entryCount = await getCompetitionEntryCount(competition.id);
              return { ...competition, entryCount };
            })
          );
          setCompetitions(competitionsWithEntries as (Competition & { entryCount: number })[]);
          setFilteredCompetitions(competitionsWithEntries as (Competition & { entryCount: number })[]);
        }
      } catch (error) {
        console.error("Error fetching competitions:", error)
        setError("An error occurred while fetching competitions. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompetitions(competitions)
    } else {
      const filtered = competitions.filter(
        (competition) =>
          competition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          competition.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCompetitions(filtered)
    }
  }, [searchQuery, competitions])

  if (isLoading) {
    return (
      <div className="container py-12 bg-secondary">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-300">Loading competitions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 bg-secondary">
        <Card className="card-dark">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            {error.includes("table does not exist") && (
              <div className="text-left mt-4">
                <p className="font-medium mb-2">To set up your database schema:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Run the following SQL to create the competitions table:</li>
                </ol>
                <pre className="bg-secondary/50 border border-gray-700 p-4 rounded-md mt-2 text-sm overflow-x-auto text-gray-300">
                  {`CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ad_url TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL
);`}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 bg-secondary">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Competitions</h1>
        <p className="text-gray-300 mt-1">Browse all available competitions and enter for a chance to win.</p>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((competition) => {
            const isActive = isCompetitionActive(competition.endsAt)

            return (
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
                  <div className="flex justify-between mb-2">
                    <span
                      className={`competition-badge ${isActive ? "competition-badge-active" : "competition-badge-ended"}`}
                    >
                      {isActive ? "Active" : "Ended"}
                    </span>
                    <div className="flex items-center text-xs text-gray-300">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{competition.entryCount || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{competition.title}</h3>
                  <p className="text-gray-300 mb-4">{truncateText(competition.description, 100)}</p>
                  <div className="flex items-center text-sm text-gray-300 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <p>{isActive ? `Ends: ${formatDate(competition.endsAt)}` : `Ended: ${formatDate(competition.endsAt)}`}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  {isActive ? (
                    <Link href={ROUTES.COMPETITION(competition.id)} className="w-full">
                      <Button className="w-full">Enter Competition</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Competition Ended
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-white">No competitions found</h3>
          <p className="text-gray-300 mt-1">
            Try adjusting your search or check back later for new competitions.
          </p>
        </div>
      )}
    </div>
  )
}

