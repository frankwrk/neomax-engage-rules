import type React from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

/**
 * Layout for authentication pages (sign-in, sign-up)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 bg-secondary">{children}</main>
      <Footer />
    </div>
  )
}
