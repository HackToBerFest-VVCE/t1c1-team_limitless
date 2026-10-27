import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchProfile } from '../lib/profileService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoUser: boolean;
  isLoading: boolean;
  isBackendConnected: boolean;
  signInWithDemo: (displayName?: string) => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'scamlens_demo_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      // 1. Check real Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user && mounted) {
            const authUser = data.session.user;
            // Prefer display_name from public.profiles (set by DB trigger on signup)
            const profile = await fetchProfile(authUser.id);
            const displayName =
              profile?.display_name ||
              authUser.user_metadata?.displayName ||
              authUser.email?.split('@')[0] ||
              'User';
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              displayName,
              isDemoUser: false,
              created_at: authUser.created_at,
            });
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Error reading Supabase session:', err);
        }
      }

      // 2. Check local demo user session
      try {
        const savedDemo = localStorage.getItem(DEMO_USER_KEY);
        if (savedDemo && mounted) {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed);
        }
      } catch {
        // ignore
      }

      if (mounted) {
        setIsLoading(false);
      }
    }

    checkSession();

    // Listen to Supabase auth state change if configured
    let subscription: { unsubscribe: () => void } | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const authUser = session.user;
          // Fetch profile for display_name — don't block the auth state update
          const profile = await fetchProfile(authUser.id);
          const displayName =
            profile?.display_name ||
            authUser.user_metadata?.displayName ||
            authUser.email?.split('@')[0] ||
            'User';
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            displayName,
            isDemoUser: false,
          });
        } else if (!localStorage.getItem(DEMO_USER_KEY)) {
          setUser(null);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signInWithDemo = (displayName = 'Hackathon Judge') => {
    const demoUser: UserProfile = {
      id: `demo-${Date.now()}`,
      email: 'judge@hackathon.demo',
      displayName,
      isDemoUser: true,
      created_at: new Date().toISOString(),
    };
    setUser(demoUser);
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    } catch {
      // ignore
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error:
          'Supabase backend is not yet configured with real API credentials. Please click "Explore in Demo Mode" or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.displayName || data.user.email?.split('@')[0] || 'User',
          isDemoUser: false,
        });
        localStorage.removeItem(DEMO_USER_KEY);
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Authentication failed' };
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string
  ): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return {
        error:
          'Supabase backend is not yet configured with real API credentials. Please click "Explore in Demo Mode" or follow the setup guide in README.md.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { displayName },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          displayName,
          isDemoUser: false,
        });
        localStorage.removeItem(DEMO_USER_KEY);
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase signOut:', err);
      }
    }
    setUser(null);
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isDemoUser: Boolean(user?.isDemoUser),
        isLoading,
        isBackendConnected: isSupabaseConfigured,
        signInWithDemo,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
