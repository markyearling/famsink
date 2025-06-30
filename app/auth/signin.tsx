import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';

export default function SignIn() {
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as string || '/';
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for error message in params
    if (params.error) {
      setError(params.error as string);
    }

    // Check for success message in params
    if (params.message) {
      setMessage(params.message as string);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if we're in the reset password flow
        const currentPath = Platform.select({
          web: window.location.pathname,
          default: ''
        });
        
        const currentUrl = Platform.select({
          web: window.location.href,
          default: ''
        });
        
        // Don't navigate away if we're in the reset password flow
        if ((currentPath && currentPath.includes('/auth/reset-password')) || 
            (currentUrl && (currentUrl.includes('type=recovery') || currentUrl.includes('access_token=')))) {
          console.log('In password reset flow, not navigating to dashboard');
          return;
        }
        
        router.replace(returnTo);
      }
      setError(null);
    });

    return () => subscription.unsubscribe();
  }, [returnTo, params]);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in to FamSink</Text>
        <Text style={styles.subtitle}>
          Or{' '}
          <Link href="/auth/signup" style={styles.link}>
            create a new account
          </Link>
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {message && (
          <View style={styles.successContainer}>
            <CheckCircle size={20} color="#10b981" style={styles.successIcon} />
            <Text style={styles.successText}>{message}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.rememberContainer}>
            <TouchableOpacity style={styles.checkbox}>
              {/* Checkbox implementation */}
            </TouchableOpacity>
            <Text style={styles.rememberText}>Remember me</Text>
          </View>

          <Link href="/auth/forgot-password" style={styles.forgotLink}>
            Forgot your password?
          </Link>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
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
  link: {
    color: '#3b82f6',
    fontWeight: '500',
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
  successContainer: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successIcon: {
    marginRight: 8,
  },
  successText: {
    color: '#047857',
    fontSize: 14,
    flex: 1,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
    color: '#4b5563',
  },
  forgotLink: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});