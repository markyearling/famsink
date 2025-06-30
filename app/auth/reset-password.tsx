import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';

export default function ResetPassword() {
  const params = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Log the full URL and search parameters for debugging
    console.log('ResetPassword: Full URL:', params);
    
    // Check if we have the required tokens from the URL
    const accessToken = params.access_token as string;
    const refreshToken = params.refresh_token as string;
    const code = params.code as string;
    
    console.log('ResetPassword: access_token from params:', accessToken ? 'present' : 'missing');
    console.log('ResetPassword: refresh_token from params:', refreshToken ? 'present' : 'missing');
    console.log('ResetPassword: code from params:', code ? 'present' : 'missing');

    const setupResetSession = async () => {
      try {
        console.log('ResetPassword: Checking for valid session');
        
        // First check if we have tokens in the URL
        if (accessToken && refreshToken) {
          console.log('ResetPassword: Found tokens in URL, setting up session');
          
          // Explicitly clear any stored tokens from localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('sb-refresh-token');
            localStorage.removeItem('sb-access-token');
          }
          
          // Ensure any existing session is cleared first
          await supabase.auth.signOut();
          
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          console.log('ResetPassword: setSession result:', { 
            success: !error, 
            hasData: !!data,
            error: error ? error.message : null
          });

          if (error) {
            console.error('ResetPassword: Error setting session:', error);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else {
            console.log('ResetPassword: Session set successfully with tokens from URL');
          }
        } 
        // Check if we have a code parameter
        else if (code) {
          console.log('ResetPassword: Found code in URL, exchanging for session');
          
          // Explicitly clear any stored tokens from localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('sb-refresh-token');
            localStorage.removeItem('sb-access-token');
          }
          
          // Ensure any existing session is cleared first
          await supabase.auth.signOut();
          
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          console.log('ResetPassword: exchangeCodeForSession result:', { 
            success: !error, 
            hasData: !!data,
            hasSession: !!data?.session,
            error: error ? error.message : null
          });
          
          if (error) {
            console.error('ResetPassword: Error exchanging code for session:', error);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else if (!data.session) {
            console.error('ResetPassword: No session returned from code exchange');
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else {
            console.log('ResetPassword: Successfully exchanged code for session');
          }
        } else {
          // No tokens or code in URL, check if we have an active session already
          console.log('ResetPassword: No tokens or code in URL, checking for existing session');
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('ResetPassword: Error getting session:', sessionError);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else if (!sessionData.session) {
            console.error('ResetPassword: No session found');
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else {
            console.log('ResetPassword: Found existing session, can proceed with password reset');
          }
        }
      } catch (err) {
        console.error('ResetPassword: Exception setting up session:', err);
        setError('Invalid or expired reset link. Please request a new password reset.');
      } finally {
        setInitializing(false);
      }
    };

    setupResetSession();
  }, [params]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      console.log('ResetPassword: Updating password');
      
      // Update the user's password
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      console.log('ResetPassword: updateUser result:', { 
        success: !error, 
        hasData: !!data,
        error: error ? error.message : null
      });

      if (error) throw error;

      // Password updated successfully, now sign out to force re-authentication
      console.log('ResetPassword: Password updated successfully, signing out');
      await supabase.auth.signOut();
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.replace('/auth/signin', { 
          params: { 
            message: 'Password updated successfully. Please sign in with your new password.' 
          } 
        });
      }, 3000);

    } catch (err) {
      console.error('ResetPassword: Error updating password:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating your password');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
          <Text style={styles.loadingText}>Verifying your reset link...</Text>
        </View>
      </View>
    );
  }

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.successContent}>
            <View style={styles.iconContainer}>
              <CheckCircle size={24} color="#10b981" />
            </View>
            <Text style={styles.title}>Password updated!</Text>
            <Text style={styles.message}>
              Your password has been successfully updated.
            </Text>
            <Text style={styles.redirectText}>
              Redirecting you to the sign in page...
            </Text>
            <ActivityIndicator size="small" color="#3b82f6" style={styles.redirectLoader} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter your new password below
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your new password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Password must be at least 8 characters with uppercase, lowercase, and number
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your new password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, (loading || !password || !confirmPassword) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Update password</Text>
          )}
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeIcon: {
    padding: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  successContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  redirectLoader: {
    marginTop: 16,
  },
});