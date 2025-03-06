"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { AdminDashboardStats } from "@/types"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Calendar, Award, Settings, FileText } from "lucide-react"
import { AdminPageWrapper } from "./admin-wrapper"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeCompetitions: 0,
    totalEntries: 0,
    pendingWinners: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)

      try {
        // Fetch total users
        const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

        // Fetch active competitions
        const { count: activeCompetitionsCount } = await supabase
          .from("competitions")
          .select("*", { count: "exact", head: true })
          .filter("ends_at", "gt", new Date().toISOString())

        // Fetch total entries
        const { count: entriesCount } = await supabase.from("entries").select("*", { count: "exact", head: true })

        // Fetch pending winners
        const { count: pendingWinnersCount } = await supabase
          .from("winners")
          .select("*", { count: "exact", head: true })
          .eq("prize_awarded", false)

        setStats({
          totalUsers: usersCount || 0,
          activeCompetitions: activeCompetitionsCount || 0,
          totalEntries: entriesCount || 0,
          pendingWinners: pendingWinnersCount || 0,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-12">
          <div className="container">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading admin dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <AdminPageWrapper>
      <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage competitions, users, and monitor platform activity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users on the platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Competitions</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCompetitions}</div>
                <p className="text-xs text-muted-foreground">Currently running competitions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntries}</div>
                <p className="text-xs text-muted-foreground">Competition entries submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Winners</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingWinners}</div>
                <p className="text-xs text-muted-foreground">Winners awaiting prize fulfillment</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Manage platform resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/competitions">
                    <Trophy className="h-4 w-4 mr-2" />
                    Manage Competitions
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/winners">
                    <Award className="h-4 w-4 mr-2" />
                    Process Winners
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/consent-records">
                    <FileText className="h-4 w-4 mr-2" />
                    Consent Records
                  </Link>
                </Button>
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-success mr-2" />
                    <p className="text-sm">New user registration: John Doe</p>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                    <p className="text-sm">New competition entry: Weekend Getaway</p>
                    <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent mr-2" />
                    <p className="text-sm">Winner selected: Shopping Spree</p>
                    <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-secondary mr-2" />
                    <p className="text-sm">New competition created: Luxury Car</p>
                    <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
      </div>
    </AdminPageWrapper>
  )
}
