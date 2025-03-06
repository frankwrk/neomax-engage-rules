-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age_range TEXT NOT NULL,
  county TEXT NOT NULL,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create competitions table
CREATE TABLE public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  ad_url TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create entries table
CREATE TABLE public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  competition_id UUID REFERENCES public.competitions(id),
  entry_number TEXT NOT NULL,
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create winners table
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  competition_id UUID REFERENCES public.competitions(id),
  entry_id UUID REFERENCES public.entries(id),
  prize_awarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_competitions_ends_at ON public.competitions(ends_at);
CREATE INDEX idx_entries_user_id ON public.entries(user_id);
CREATE INDEX idx_entries_competition_id ON public.entries(competition_id);
CREATE INDEX idx_winners_user_id ON public.winners(user_id);
CREATE INDEX idx_winners_competition_id ON public.winners(competition_id);

