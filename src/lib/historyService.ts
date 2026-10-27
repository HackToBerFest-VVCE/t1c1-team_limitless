/**
 * historyService.ts
 * Handles saving and retrieving scan history from Supabase `public.scan_history`.
 * Falls back gracefully to the local history functions in supabase.ts when
 * the user is not authenticated or the backend is not configured.
 *
 * Column names match the migration exactly:
 *   id, user_id, scan_type, verdict, risk_level, summary, created_at
 */

import { supabase, isSupabaseConfigured, ScanHistoryRecord } from './supabase';

export interface CloudSaveInput {
  user_id: string;
  scan_type: string;
  verdict: string;
  risk_level: string;
  summary: string;
}

/**
 * Persists a scan result to `public.scan_history` for authenticated users.
 * Returns the saved record on success, or null on failure (caller should still
 * have already saved to localStorage as a local fallback).
 */
export async function saveScanToSupabase(
  input: CloudSaveInput
): Promise<ScanHistoryRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('scan_history')
      .insert({
        user_id: input.user_id,
        scan_type: input.scan_type,
        verdict: input.verdict,
        risk_level: input.risk_level,
        summary: input.summary,
      })
      .select('id, user_id, scan_type, verdict, risk_level, summary, created_at')
      .single();

    if (error) {
      console.warn('[historyService] Failed to save scan to Supabase:', error.message);
      return null;
    }

    return data as ScanHistoryRecord;
  } catch (err) {
    console.warn('[historyService] Exception saving scan to Supabase:', err);
    return null;
  }
}

/**
 * Fetches the 50 most recent scan records from `public.scan_history`
 * for the currently authenticated user (RLS enforces this automatically).
 * Returns an empty array on error.
 */
export async function fetchSupabaseHistory(): Promise<ScanHistoryRecord[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('id, user_id, scan_type, verdict, risk_level, summary, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[historyService] Failed to fetch history from Supabase:', error.message);
      return [];
    }

    return (data ?? []) as ScanHistoryRecord[];
  } catch (err) {
    console.warn('[historyService] Exception fetching history from Supabase:', err);
    return [];
  }
}

/**
 * Merges cloud records and local records into a single deduplicated list
 * sorted by `created_at` descending. Cloud records take precedence.
 * Local-only records (id starts with 'local-') are appended at the end.
 */
export function mergeHistories(
  cloudRecords: ScanHistoryRecord[],
  localRecords: ScanHistoryRecord[]
): ScanHistoryRecord[] {
  const cloudIds = new Set(cloudRecords.map((r) => r.id));
  const localOnly = localRecords.filter((r) => r.id.startsWith('local-') || !cloudIds.has(r.id));
  const merged = [...cloudRecords, ...localOnly];
  merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return merged.slice(0, 50);
}
