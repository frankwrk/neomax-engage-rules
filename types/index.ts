// User Types
export interface User {
  id: string
  email: string
  fullName: string
  mobileNumber: string
  gender: "male" | "female" | "other"
  ageRange: string
  county: string
  interests: string[]
  createdAt: string
}

// Competition Types
export interface Competition {
  id: string
  title: string
  description: string
  adUrl: string
  question: string
  correctAnswer: string
  createdAt: string
  endsAt: string
}

// Entry Types
export interface Entry {
  id: string
  userId: string
  competitionId: string
  entryNumber: string
  answer: string
  correct: boolean
  createdAt: string
}

// Winner Types
export interface Winner {
  id: string
  userId: string
  competitionId: string
  entryId: string
  prizeAwarded: boolean
  createdAt: string
}

// Form Schema Types
export interface UserRegistrationFormValues {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  mobileNumber: string
  gender: "male" | "female" | "other"
  ageRange: string
  county: string
  interests: string[]
  termsAccepted: boolean
}

export interface CompetitionEntryFormValues {
  answer: string
}

// Auth Types
export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number
  activeCompetitions: number
  totalEntries: number
  pendingWinners: number
}

