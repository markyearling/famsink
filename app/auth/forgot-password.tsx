import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowLeft, Mail, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '../../src/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the auth/callback endpoint for the redirect URL
      const redirectUrl = `${process.env.EXPO_PUBLIC_WEBSITE_URL || (Platform.OS === 'web' ? window.location.origin : '')}/auth/auth-callback`;
      
      console.log('ForgotPassword: Sending reset password email with redirectUrl:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      console.log('ForgotPassword: Reset password email sent successfully');
      setSuccess(true);
    } catch (err) {
      console.error('ForgotPassword: Error sending reset email:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.successContent}>
            <View style={styles.iconContainer}>
              <CheckCircle size={24} color="#10b981" />
            </View>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.message}>
              We've sent a password reset link to <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Text style={styles.helperText}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setSuccess(false);
                  setEmail('');
                }}
              >
                <Text style={styles.secondaryButtonText}>Try again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.replace('/auth/signin')}
              >
                <Text style={styles.primaryButtonText}>Back to sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, (!email || loading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!email || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Send reset link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={16} color="#3b82f6" />
          <Text style={styles.backButtonText}>Back to sign in</Text>
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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
  emailHighlight: {
    fontWeight: 'bold',
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '500',
  },
});