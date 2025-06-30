import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';

export default function AuthCallback() {
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[AuthCallback] Starting callback handler');
        console.log('[AuthCallback] URL params:', params);
        
        // First, check for password reset tokens in the URL query parameters
        const accessToken = params.access_token as string;
        const refreshToken = params.refresh_token as string;
        const type = params.type as string;
        const code = params.code as string;
        
        console.log('[AuthCallback] Query params check:');
        console.log('  - access_token:', accessToken ? 'present' : 'null');
        console.log('  - refresh_token:', refreshToken ? 'present' : 'null');
        console.log('  - type:', type);
        console.log('  - code:', code ? 'present' : 'null');

        // CASE 1: Password Recovery Flow with tokens
        // Check for recovery tokens
        if ((type === 'recovery' && accessToken && refreshToken)) {
          console.log('[AuthCallback] Password reset flow detected with tokens');
          
          // Navigate to reset password with tokens
          router.replace({
            pathname: '/auth/reset-password',
            params: {
              access_token: accessToken,
              refresh_token: refreshToken
            }
          });
          return;
        }

        // CASE 2: Password Recovery Flow with code
        if ((type === 'recovery' && code)) {
          console.log('[AuthCallback] Password reset flow detected with code');
          
          try {
            // Clear any stored tokens if on web platform
            if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
              localStorage.removeItem('supabase.auth.token');
              localStorage.removeItem('sb-refresh-token');
              localStorage.removeItem('sb-access-token');
            }
            
            // Ensure any existing session is cleared first
            await supabase.auth.signOut();
            
            // Exchange the code for a session
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            console.log('[AuthCallback] Code exchange result:', {
              success: !exchangeError,
              hasSession: !!data?.session,
              error: exchangeError ? exchangeError.message : null
            });
            
            if (exchangeError) {
              console.error('[AuthCallback] Error exchanging code for session:', exchangeError);
              router.replace({
                pathname: '/auth/forgot-password',
                params: { 
                  error: 'Password reset link was invalid or expired. Please request a new one.' 
                }
              });
              return;
            }
            
            if (data?.session) {
              console.log('[AuthCallback] Successfully exchanged code for session, redirecting to reset password');
              router.replace('/auth/reset-password');
              return;
            } else {
              console.log('[AuthCallback] Code exchange successful but no session returned');
              router.replace({
                pathname: '/auth/forgot-password',
                params: { 
                  error: 'Password reset link was invalid or expired. Please request a new one.' 
                }
              });
              return;
            }
          } catch (exchangeError) {
            console.error('[AuthCallback] Error exchanging code for session:', exchangeError);
            router.replace({
              pathname: '/auth/forgot-password',
              params: { 
                error: 'Password reset link was invalid or expired. Please request a new one.' 
              }
            });
            return;
          }
        }

        // CASE 3: Standard OAuth or Magic Link Flow with code
        if (code) {
          console.log('[AuthCallback] Standard auth flow detected with code');
          
          try {
            // Exchange the code for a session
            const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            
            console.log('[AuthCallback] Code exchange result:', {
              success: !exchangeError,
              hasSession: !!exchangeData?.session,
              error: exchangeError ? exchangeError.message : null
            });
            
            if (exchangeError) {
              throw exchangeError;
            }
            
            if (exchangeData?.session) {
              console.log('[AuthCallback] Successfully exchanged code for session');
              router.replace('/');
              return;
            } else {
              console.log('[AuthCallback] Code exchange successful but no session returned');
              setError('Authentication failed. Please try signing in again.');
              setProcessing(false);
              return;
            }
          } catch (exchangeError) {
            console.error('[AuthCallback] Error exchanging code for session:', exchangeError);
            setError('Authentication failed. Please try signing in again.');
            setProcessing(false);
            return;
          }
        }

        // CASE 4: Check for recovery keyword in URL as fallback
        if (params.recovery) {
          console.log('[AuthCallback] Recovery keyword found in URL, but tokens not properly extracted');
          
          // Try to get the current session
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (sessionData?.session) {
            console.log('[AuthCallback] Found existing session for recovery flow, redirecting to reset password');
            router.replace('/auth/reset-password');
            return;
          }
          
          // Redirect to forgot password page as fallback
          router.replace({
            pathname: '/auth/forgot-password',
            params: { 
              error: 'Password reset link was invalid or expired. Please request a new one.' 
            }
          });
          return;
        }

        // CASE 5: No specific parameters found, check for session
        console.log('[AuthCallback] No specific auth parameters found, checking for session');
        const { data, error } = await supabase.auth.getSession();
        
        console.log('[AuthCallback] getSession result:', {
          success: !error,
          hasSession: !!data?.session,
          error: error ? error.message : null
        });
        
        if (error) {
          console.error('[AuthCallback] Error getting session:', error);
          setError('Authentication error. Please sign in again.');
          setProcessing(false);
          return;
        }
        
        if (data.session) {
          console.log('[AuthCallback] Valid session found, navigating to dashboard');
          router.replace('/');
        } else {
          console.log('[AuthCallback] No session found, navigating to sign in');
          router.replace('/auth/signin');
        }
      } catch (error) {
        console.error('[AuthCallback] Error in auth callback:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred during authentication.');
        setProcessing(false);
      }
    };

    handleCallback();
  }, [params]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.errorContent}>
            <AlertCircle size={48} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.title}>Authentication Error</Text>
            <Text style={styles.message}>{error}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/auth/signin')}
            >
              <Text style={styles.buttonText}>Return to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <Loader2 size={32} color="#3b82f6" style={styles.loadingIcon} />
        <Text style={styles.loadingText}>Processing authentication...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  errorContent: {
    alignItems: 'center',
  },
  errorIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});