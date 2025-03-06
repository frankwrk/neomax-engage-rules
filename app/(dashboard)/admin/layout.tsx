import React from 'react';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Award, FileText, Settings, Home } from 'lucide-react';
import { redirect } from 'next/navigation';
import { isAdmin, getSession } from '@/lib/auth-utils';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if the user is an admin, redirect to dashboard if not
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    redirect('/dashboard');
  }
  
  // Get user session
  const session = await getSession();
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <div className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Admin sidebar navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/competitions">
                  <Trophy className="h-4 w-4 mr-2" />
                  Competitions
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/winners">
                  <Award className="h-4 w-4 mr-2" />
                  Winners
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/consent-records">
                  <FileText className="h-4 w-4 mr-2" />
                  Consent Records
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </aside>
          
          {/* Main content area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
