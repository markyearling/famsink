import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('[supabase.ts] Initializing Supabase client with:', {
  url: supabaseUrl ? 'URL provided' : 'URL missing',
  key: supabaseAnonKey ? 'Key provided' : 'Key missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase.ts] Missing Supabase configuration:', {
    EXPO_PUBLIC_SUPABASE_URL: supabaseUrl ? 'present' : 'missing',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'present' : 'missing'
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

export async function testConnection() {
  try {
    // Test 1: Basic connection test with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    );

    const connectionPromise = supabase
      .from('profiles')
      .select('count')
      .limit(0)
      .throwOnError();

    const { data, error } = await Promise.race([connectionPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Database connection test failed:', error);
      return {
        success: false,
        error: 'Database connection failed',
        details: {
          message: error.message,
          code: error.code,
          hint: error.hint
        }
      };
    }

    // Test 2: Auth service test
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Auth service test failed:', authError);
      return {
        success: false,
        error: 'Authentication service failed',
        details: {
          message: authError.message,
          name: authError.name
        }
      };
    }

    return {
      success: true,
      message: 'Connection successful',
      details: {
        dbConnected: true,
        authConnected: true
      }
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? {
        message: error.message,
        name: error.name
      } : {
        message: 'Unknown error occurred'
      }
    };
  }
}

console.log('[supabase.ts] Supabase client initialized successfully');