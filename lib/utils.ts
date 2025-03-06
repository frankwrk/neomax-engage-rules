import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function generateEntryNumber() {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function isCompetitionActive(endsAt: string) {
  return new Date(endsAt) > new Date()
}

