-- Add role column to users table with default value of 'user'
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user';

-- Create index for role column for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Manually set a test user as admin (you would replace this email with your actual email)
-- This is just for testing purposes
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'francisc.frd@gmail.com';
