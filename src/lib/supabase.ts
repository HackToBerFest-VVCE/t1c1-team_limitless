import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-supabase-url')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface ScanHistoryRecord {
  id: string;
  user_id?: string;
  scan_type: string;
  risk_level: string;
  verdict: string;
  summary: string;
  created_at: string;
}

// Local storage fallback for guest/demo history without sending private data to server
const LOCAL_HISTORY_KEY = 'scamlens_local_history';

export function getLocalHistory(): ScanHistoryRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalHistory(item: Omit<ScanHistoryRecord, 'id' | 'created_at'>): ScanHistoryRecord {
  const current = getLocalHistory();
  const record: ScanHistoryRecord = {
    ...item,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };
  const updated = [record, ...current].slice(0, 30); // keep up to 30 items locally
  try {
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
  return record;
}

export function clearLocalHistory(): void {
  try {
    localStorage.removeItem(LOCAL_HISTORY_KEY);
  } catch (err) {
    console.warn('Failed to clear local history:', err);
  }
}
