"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Winner } from "@/types"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"

interface WinnerWithDetails extends Winner {
  competitions: {
    title: string
    description: string
  }
  users: {
    full_name: string
    county: string
  }
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<WinnerWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from("winners")
          .select(`
            *,
            competitions (
              title,
              description
            ),
            users (
              full_name,
              county
            )
          `)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (data) {
          setWinners(data as WinnerWithDetails[])
        }
      } catch (error) {
        console.error("Error fetching winners:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWinners()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-300">Loading winners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Winners</h1>
        <p className="text-gray-300 mt-1">Congratulations to all our lucky winners!</p>
      </div>

      {winners.length > 0 ? (
        <div className="space-y-6">
          {winners.map((winner) => (
            <Card key={winner.id} className="overflow-hidden card-dark">
              <div className="bg-primary h-2" />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center justify-center bg-primary/30 rounded-full p-4 h-16 w-16">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{winner.competitions?.title || "Competition Prize"}</h3>
                    <p className="text-gray-300 mb-4">
                      {winner.competitions?.description || "Prize description"}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
                      <div>
                        <span className="font-medium">Winner:</span> {winner.users?.full_name || "Anonymous"}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {winner.users?.county || "Unknown"}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(winner.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-dark">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium mb-2 text-white">No Winners Yet</h3>
            <p className="text-gray-300">Check back soon to see our latest winners!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

