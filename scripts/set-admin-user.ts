/**
 * Script to set a user as an admin for testing purposes
 * 
 * Usage:
 * 1. Run with an email address parameter: npx tsx scripts/set-admin-user.ts user@example.com
 * 2. The user with the specified email will be given admin role
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Parse command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address as an argument');
  console.error('Usage: npx tsx scripts/set-admin-user.ts user@example.com');
  process.exit(1);
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setUserAsAdmin(email: string) {
  try {
    // First, check if the user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email)
      .single();

    if (userError) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update the user's role to admin
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select();

    if (error) {
      console.error('Error updating user role:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully set user ${email} as admin`);
    console.log('User details:', data[0]);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

setUserAsAdmin(email);
