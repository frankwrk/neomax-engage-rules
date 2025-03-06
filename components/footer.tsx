import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-secondary text-white border-t border-gray-700">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Neomax Engage</h3>
            <p className="text-sm text-gray-300">
              Watch ads, answer questions, and win exciting prizes with Neomax Engage.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.HOME} className="text-sm text-gray-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href={ROUTES.COMPETITIONS} className="text-sm text-gray-300 hover:text-primary">
                  Competitions
                </Link>
              </li>
              <li>
                <Link href={ROUTES.WINNERS} className="text-sm text-gray-300 hover:text-primary">
                  Winners
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-sm text-gray-300 hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">Email: support@neomaxengage.com</li>
              <li className="text-sm text-gray-300">Phone: +353 1 234 5678</li>
            </ul>
            <div className="flex space-x-2 mt-4">
              <Link href="#" className="text-sm px-3 py-2 border border-gray-700 text-gray-300 rounded-md hover:text-primary hover:border-primary transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Get Support
              </Link>
              <Link href="#" className="text-sm px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Send Feedback
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Neomax Engage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

