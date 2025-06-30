import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabase';

// Add comprehensive error logging
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Promise Rejection:', {
    reason,
    promise,
    stack: reason instanceof Error ? reason.stack : 'No stack trace available',
    timestamp: new Date().toISOString(),
    reasonType: typeof reason,
    reasonIsError: reason instanceof Error,
    reasonStringified: (() => {
      try {
        return JSON.stringify(reason);
      } catch (e) {
        return `[Cannot stringify: ${e}]`;
      }
    })()
  });
});

process.on('uncaughtException', (error) => {
  console.error('🔴 Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
});

// Web-specific error handling
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', event => {
    console.error('🚨 Unhandled Rejection (window):', {
      reason: event.reason,
      stack: event.reason instanceof Error ? event.reason.stack : 'No stack trace available',
      timestamp: new Date().toISOString(),
      reasonType: typeof event.reason,
      reasonIsError: event.reason instanceof Error,
      reasonStringified: (() => {
        try {
          return JSON.stringify(event.reason);
        } catch (e) {
          return `[Cannot stringify: ${e}]`;
        }
      })()
    });
  });

  window.addEventListener('error', event => {
    console.error('🚨 Global Error (window):', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
      timestamp: new Date().toISOString()
    });
  });
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const reactRoot = createRoot(root);

// Initialize Supabase auth state with error handling
try {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('[main.tsx] Auth state changed:', event, session ? 'Session exists' : 'No session');
    
    try {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Delete any existing auth data
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-access-token');
      }
      
      // Log if this is a password recovery flow
      if (event === 'PASSWORD_RECOVERY') {
        console.log('[main.tsx] Password recovery flow detected');
        // Clear any existing session data
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-refresh-token');
        localStorage.removeItem('sb-access-token');
      }
    } catch (error) {
      console.error('[main.tsx] Error in auth state change handler:', error);
    }
  });
} catch (error) {
  console.error('[main.tsx] Error setting up auth state listener:', error);
}

// Check URL for password reset parameters with error handling
try {
  const url = new URL(window.location.href);
  const type = url.searchParams.get('type');
  const accessToken = url.searchParams.get('access_token');
  const refreshToken = url.searchParams.get('refresh_token');

  // If this is a password reset link, clear any existing session immediately
  if (type === 'recovery' || (accessToken && refreshToken)) {
    console.log('[main.tsx] Password reset parameters detected in URL, clearing session');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('sb-access-token');
  }
} catch (error) {
  console.error('[main.tsx] Error processing URL parameters:', error);
}

// Render app with error boundary
try {
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('[main.tsx] Error rendering app:', error);
}