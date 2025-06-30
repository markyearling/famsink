import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[supabase.ts] Initializing Supabase client with:', {
  url: supabaseUrl ? 'URL provided' : 'URL missing',
  key: supabaseAnonKey ? 'Key provided' : 'Key missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase.ts] Missing Supabase configuration:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'present' : 'missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add error logging for Supabase operations
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[supabase.ts] Auth state change:', {
    event,
    hasSession: !!session,
    userId: session?.user?.id,
    timestamp: new Date().toISOString()
  });
});

// Log any Supabase errors
const originalFrom = supabase.from;
supabase.from = function(table: string) {
  const query = originalFrom.call(this, table);
  
  // Wrap common query methods to add error logging
  const originalSelect = query.select;
  query.select = function(...args: any[]) {
    const result = originalSelect.apply(this, args);
    return result.then(
      (data) => {
        if (data.error) {
          console.error(`[supabase.ts] Query error on table "${table}":`, data.error);
        }
        return data;
      },
      (error) => {
        console.error(`[supabase.ts] Promise rejection on table "${table}":`, error);
        throw error;
      }
    );
  };
  
  return query;
};

console.log('[supabase.ts] Supabase client initialized successfully');