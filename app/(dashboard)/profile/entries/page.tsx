"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getUserEntries } from "@/lib/entry-utils"
import type { Entry, Competition } from "@/types"
import { ROUTES } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, Trophy, CalendarDays, Ticket } from "lucide-react"

/**
 * User Entries Page
 * Displays all of a user's competition entries with their status
 */
export default function UserEntriesPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<(Entry & { competition: Competition })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserEntries = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        const userEntries = await getUserEntries(user.id)
        setEntries(userEntries)
      } catch (error) {
        console.error("Error fetching user entries:", error)
        setError("Failed to load your entries. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserEntries()
    }
  }, [user])

  // Group entries by active and past competitions
  const activeEntries = entries.filter(entry => 
    new Date(entry.competition.endsAt) > new Date()
  )
  
  const pastEntries = entries.filter(entry => 
    new Date(entry.competition.endsAt) <= new Date()
  )

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-gray-300">Loading your entries...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="card-dark">
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Entries</h1>
        <p className="text-gray-300">Track all your competition entries and their status</p>
      </div>

      {entries.length === 0 ? (
        <Card className="card-dark">
          <CardContent className="py-12 text-center">
            <Ticket className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Entries Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven't entered any competitions yet. Start participating to see your entries here.
            </p>
            <Link href={ROUTES.COMPETITIONS}>
              <Button>Browse Competitions</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active Entries
              {activeEntries.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeEntries.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Entries
              {pastEntries.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pastEntries.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeEntries.length === 0 ? (
              <Card className="card-dark">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-400">You don't have any active competition entries.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} isActive={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEntries.length === 0 ? (
              <Card className="card-dark">
                <CardContent className="py-8 text-center">
                  <p className="text-gray-400">You don't have any past competition entries.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} isActive={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

/**
 * Entry Card Component
 * Displays an individual entry with its details and status
 */
function EntryCard({
  entry,
  isActive,
}: {
  entry: Entry & { competition: Competition }
  isActive: boolean
}) {
  return (
    <Card className="card-dark overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={isActive ? "default" : "secondary"} className="mb-2">
              {isActive ? "Active" : "Completed"}
            </Badge>
            <div className="flex items-center">
              <Ticket className="h-4 w-4 mr-1 text-accent" />
              <span className="text-sm font-mono text-accent">{entry.entryNumber}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">{entry.competition.title}</h3>
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>
              {isActive 
                ? `Ends on ${formatDate(entry.competition.endsAt)}` 
                : `Ended on ${formatDate(entry.competition.endsAt)}`}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Entry Date: {formatDate(entry.createdAt)}
          </p>
        </div>
        <div className="bg-primary/5 p-6 flex flex-row md:flex-col justify-between items-center md:w-48 border-t md:border-t-0 md:border-l border-gray-700">
          <div className="text-center">
            <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-300 mb-1">Draw Status</p>
            <p className="text-xs text-gray-400">
              {isActive ? "Waiting for draw" : "Draw completed"}
            </p>
          </div>
          <Link href={ROUTES.COMPETITION(entry.competitionId)}>
            <Button variant="outline" size="sm" className="mt-4">
              View Competition
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
