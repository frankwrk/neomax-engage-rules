/**
 * Service for managing cookie consent records
 * Handles storing and retrieving consent data from Supabase
 */
import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Environment variables for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Admin client for privileged operations
const adminClient = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export interface ConsentPreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentRecord {
  id?: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  preferences: ConsentPreferences;
  consent_type: 'all' | 'necessary' | 'custom';
  created_at?: string;
  updated_at?: string;
}

/**
 * Saves a user's consent preferences to the database
 * Links to user account if logged in, otherwise stores anonymous data
 */
export async function saveConsentRecord(consentData: Omit<ConsentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not initialized' };
    }

    const { data, error } = await supabase
      .from('consent_records')
      .insert([{
        ...consentData,
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error saving consent record:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to save consent record:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Retrieves the most recent consent record for a user
 */
export async function getUserConsentRecord(userId: string): Promise<{ data: ConsentRecord | null; error?: string }> {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase not initialized' };
    }

    const { data, error } = await supabase
      .from('consent_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
      console.error('Error retrieving consent record:', error);
      return { data: null, error: error.message };
    }

    return { data: data || null };
  } catch (error) {
    console.error('Failed to retrieve consent record:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Admin function to retrieve all consent records
 * Requires admin privileges via the service role key
 */
export async function getAllConsentRecords(
  page = 1, 
  limit = 50,
  filters?: { 
    user_id?: string; 
    consent_type?: 'all' | 'necessary' | 'custom'; 
    from_date?: string;
    to_date?: string;
  }
): Promise<{ 
  data: ConsentRecord[] | null; 
  count: number | null;
  error?: string 
}> {
  try {
    if (!adminClient) {
      return { 
        data: null, 
        count: null,
        error: 'Admin client not initialized. Service role key may be missing.' 
      };
    }

    let query = adminClient
      .from('consent_records')
      .select('*', { count: 'exact' });

    // Apply filters if provided
    if (filters) {
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.consent_type) {
        query = query.eq('consent_type', filters.consent_type);
      }
      if (filters.from_date) {
        query = query.gte('created_at', filters.from_date);
      }
      if (filters.to_date) {
        query = query.lte('created_at', filters.to_date);
      }
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error retrieving consent records:', error);
      return { data: null, count: null, error: error.message };
    }

    return { data, count };
  } catch (error) {
    console.error('Failed to retrieve consent records:', error);
    return { 
      data: null, 
      count: null,
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Gets consent statistics for admin dashboard
 */
export async function getConsentStatistics(): Promise<{ 
  data: {
    total: number;
    by_type: Record<string, number>;
    by_preference: Record<string, number>;
  } | null; 
  error?: string 
}> {
  try {
    if (!adminClient) {
      return { 
        data: null, 
        error: 'Admin client not initialized. Service role key may be missing.' 
      };
    }

    // Get total count
    const { count: total, error: countError } = await adminClient
      .from('consent_records')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return { data: null, error: countError.message };
    }

    // Get counts by consent type
    const { data: typeData, error: typeError } = await adminClient
      .from('consent_records')
      .select('consent_type, count')
      .group('consent_type');

    if (typeError) {
      return { data: null, error: typeError.message };
    }

    // Get counts by preference
    const { data: prefData, error: prefError } = await adminClient.rpc('get_consent_preference_counts');

    if (prefError) {
      return { data: null, error: prefError.message };
    }

    // Format the response
    const by_type: Record<string, number> = {};
    typeData.forEach(item => {
      by_type[item.consent_type] = item.count;
    });

    const by_preference: Record<string, number> = prefData ? prefData : {};

    return {
      data: {
        total: total || 0,
        by_type,
        by_preference
      }
    };
  } catch (error) {
    console.error('Failed to retrieve consent statistics:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
