import React from 'react';
import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

/**
 * Layout component for legal pages using the same header and footer as the main app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} - Layout component
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 py-12 bg-secondary">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
