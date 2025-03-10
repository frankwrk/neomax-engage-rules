export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

export const COUNTIES = [
  "Antrim",
  "Armagh",
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Derry",
  "Donegal",
  "Down",
  "Dublin",
  "Fermanagh",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
]

export const INTEREST_CATEGORIES = [
  "Sports",
  "Travel",
  "Food & Drink",
  "Technology",
  "Fashion",
  "Health & Fitness",
  "Entertainment",
  "Home & Garden",
  "Automotive",
  "Finance",
]

export const ROUTES = {
  HOME: "/",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  COMPETITIONS: "/competitions",
  COMPETITION: (id: string) => `/competitions/${id}`,
  WINNERS: "/winners",
  LIVE_DRAW: "/live-draw",
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    COMPETITIONS: "/admin/competitions",
    WINNERS: "/admin/winners",
    ADVERTISERS: "/admin/advertisers",
  },
}

