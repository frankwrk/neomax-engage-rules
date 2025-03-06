/**
 * Custom hook for Supabase authentication
 * Provides user authentication state and helper methods
 */
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        if (!supabase) {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            error: new Error('Supabase client not initialized'),
          });
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setAuthState({
          user: session?.user || null,
          session: session,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error getting session:', error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown authentication error'),
        });
      }
    };

    checkSession();

    // Subscribe to auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setAuthState({
            user: session?.user || null,
            session: session,
            isLoading: false,
            error: null,
          });
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown sign out error'),
      }));
    }
  };

  return {
    ...authState,
    signOut,
  };
}
