/**
 * API route to configure custom email templates in Supabase
 * This needs to be triggered once after deployment or during app initialization
 */
import { NextResponse } from 'next/server';
import { configureSupabaseCustomEmails } from '@/lib/supabase-email';

export async function GET() {
  try {
    // This requires the SUPABASE_SERVICE_ROLE_KEY to be set
    await configureSupabaseCustomEmails();
    
    return NextResponse.json({ success: true, message: 'Email templates configured successfully' });
  } catch (error) {
    console.error('Failed to configure email templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
