import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-secondary text-text-light">
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
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-gray-300 hover:text-primary">
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
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Neomax Engage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

