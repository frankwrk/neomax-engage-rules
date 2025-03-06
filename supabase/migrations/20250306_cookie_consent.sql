-- Migration for cookie consent records
-- Create a table to store user consent preferences
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  preferences JSONB NOT NULL DEFAULT '{"necessary": true, "functional": false, "analytics": false, "marketing": false}',
  consent_type TEXT NOT NULL CHECK (consent_type IN ('all', 'necessary', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS consent_records_user_id_idx ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS consent_records_created_at_idx ON consent_records(created_at);
CREATE INDEX IF NOT EXISTS consent_records_consent_type_idx ON consent_records(consent_type);

-- Add RLS policies
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Users can read only their own consent records
CREATE POLICY "Users can read their own consent records"
  ON consent_records FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own consent records
CREATE POLICY "Users can insert their own consent records"
  ON consent_records FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only service role can read all consents (for admin purposes)
CREATE POLICY "Service role can read all consent records"
  ON consent_records FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Helper function to count consent preferences
CREATE OR REPLACE FUNCTION get_consent_preference_counts()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'necessary', COUNT(*) FILTER (WHERE preferences->>'necessary' = 'true'),
    'functional', COUNT(*) FILTER (WHERE preferences->>'functional' = 'true'),
    'analytics', COUNT(*) FILTER (WHERE preferences->>'analytics' = 'true'),
    'marketing', COUNT(*) FILTER (WHERE preferences->>'marketing' = 'true')
  )
  FROM consent_records;
$$;
