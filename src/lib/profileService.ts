/**
 * profileService.ts
 * Reads and updates user profiles in `public.profiles`.
 * Called from AuthContext after a session is established.
 *
 * Column names match the migration exactly:
 *   id, display_name, preferred_language, created_at, updated_at
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface ProfileRow {
  id: string;
  display_name: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the profile row for the given user ID.
 * Returns null if not found or on error.
 */
export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, preferred_language, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[profileService] Failed to fetch profile:', error.message);
      return null;
    }

    return data as ProfileRow | null;
  } catch (err) {
    console.warn('[profileService] Exception fetching profile:', err);
    return null;
  }
}

/**
 * Updates the profile row for the currently authenticated user.
 * Only passes fields that are explicitly provided — no accidental nulls.
 */
export async function updateProfile(
  userId: string,
  updates: { display_name?: string; preferred_language?: string }
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  if (!updates.display_name && !updates.preferred_language) return true;

  try {
    const payload: Record<string, string> = {};
    if (updates.display_name) payload.display_name = updates.display_name;
    if (updates.preferred_language) payload.preferred_language = updates.preferred_language;

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId);

    if (error) {
      console.warn('[profileService] Failed to update profile:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[profileService] Exception updating profile:', err);
    return false;
  }
}
