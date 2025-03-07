import { createClient } from '@/lib/supabase';
import type { Entry, Competition } from '@/types';
import { generateEntryNumber } from '@/lib/utils';
import { sendEntryConfirmationEmail } from '@/lib/email-utils';

/**
 * Checks if a user has already entered a specific competition
 * @param userId User ID to check
 * @param competitionId Competition ID to check
 * @returns Boolean indicating if user has entered
 */
export async function hasUserEnteredCompetition(userId: string, competitionId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('entries')
      .select('id')
      .eq('user_id', userId)
      .eq('competition_id', competitionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking user entry:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error in hasUserEnteredCompetition:', error);
    return false;
  }
}

/**
 * Checks if a user has reached their daily entry limit
 * @param userId User ID to check
 * @returns Boolean indicating if user has reached daily limit
 */
export async function hasReachedDailyEntryLimit(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error checking daily entry limit:', error);
      throw error;
    }

    // Currently set to 1 entry per day as per requirements
    return (count ?? 0) >= 1;
  } catch (error) {
    console.error('Error in hasReachedDailyEntryLimit:', error);
    return false;
  }
}

/**
 * Creates a new competition entry for a user
 * @param userId User ID
 * @param competitionId Competition ID
 * @param answer User's answer
 * @param correctAnswer The correct answer
 * @returns Object with entry result
 */
export async function createCompetitionEntry(
  userId: string,
  competitionId: string,
  answer: string,
  correctAnswer: string,
  userEmail: string,
  competitionTitle: string,
): Promise<{
  success: boolean;
  correct: boolean;
  message: string;
  entryNumber?: string;
}> {
  try {
    // Check if user has already entered
    const hasEntered = await hasUserEnteredCompetition(userId, competitionId);
    if (hasEntered) {
      return {
        success: false,
        correct: false,
        message: 'You have already entered this competition.',
      };
    }

    // Check daily entry limit
    const hasReachedLimit = await hasReachedDailyEntryLimit(userId);
    if (hasReachedLimit) {
      return {
        success: false,
        correct: false,
        message: 'You have reached your daily entry limit. Please try again tomorrow.',
      };
    }

    // Check if answer is correct
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    // Generate unique entry number
    const entryNumber = generateEntryNumber();

    // Create entry in database
    const supabase = createClient();
    const { error } = await supabase.from('entries').insert([
      {
        user_id: userId,
        competition_id: competitionId,
        entry_number: entryNumber,
        answer,
        correct: isCorrect,
      },
    ]);

    if (error) {
      throw error;
    }

    // Send confirmation email for correct answers
    if (isCorrect && userEmail) {
      await sendEntryConfirmationEmail(userEmail, {
        competitionTitle,
        entryNumber,
      });
    }

    return {
      success: true,
      correct: isCorrect,
      message: isCorrect
        ? `Congratulations! Your answer is correct. You have been entered into the draw with entry number ${entryNumber}.`
        : 'Sorry, your answer is incorrect. You can try again.',
      entryNumber: isCorrect ? entryNumber : undefined,
    };
  } catch (error) {
    console.error('Error creating competition entry:', error);
    return {
      success: false,
      correct: false,
      message: 'There was an error submitting your entry. Please try again.',
    };
  }
}

/**
 * Gets the total number of entries for a competition
 * @param competitionId Competition ID to check
 * @returns Number of entries
 */
export async function getCompetitionEntryCount(competitionId: string): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('entries')
      .select('id', { count: 'exact', head: true })
      .eq('competition_id', competitionId)
      .eq('correct', true);

    if (error) {
      console.error('Error counting competition entries:', error);
      throw error;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Error in getCompetitionEntryCount:', error);
    return 0;
  }
}

/**
 * Gets all entries for a user
 * @param userId User ID
 * @returns Array of entries with competition details
 */
export async function getUserEntries(userId: string): Promise<(Entry & { competition: Competition })[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('entries')
      .select(`
        *,
        competition:competitions(*)
      `)
      .eq('user_id', userId)
      .eq('correct', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user entries:', error);
      throw error;
    }

    return (data || []) as (Entry & { competition: Competition })[];
  } catch (error) {
    console.error('Error in getUserEntries:', error);
    return [];
  }
}
