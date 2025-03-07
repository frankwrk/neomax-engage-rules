import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth-utils';
import { createCompetitionEntry } from '@/lib/entry-utils';

// Schema for entry submission
const entrySubmissionSchema = z.object({
  competitionId: z.string().uuid(),
  answer: z.string().min(1, 'Answer is required'),
  competitionTitle: z.string(),
});

/**
 * POST handler for competition entry submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = entrySubmissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { competitionId, answer, competitionTitle } = validationResult.data;

    // Get competition to verify it exists and get correct answer
    const supabase = createClient();
    const { data: competition, error: competitionError } = await supabase
      .from('competitions')
      .select('correct_answer')
      .eq('id', competitionId)
      .single();

    if (competitionError || !competition) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      );
    }

    // Process the entry
    const result = await createCompetitionEntry(
      authUser.id,
      competitionId,
      answer,
      competition.correct_answer,
      authUser.email,
      competitionTitle
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing entry submission:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving user entries
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Query the database for user entries
    const supabase = createClient();
    const { data, error } = await supabase
      .from('entries')
      .select(`
        *,
        competition:competitions(*)
      `)
      .eq('user_id', authUser.id)
      .eq('correct', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ entries: data });
  } catch (error) {
    console.error('Error retrieving user entries:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
