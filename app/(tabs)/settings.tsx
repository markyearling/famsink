import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { 
  Bell, 
  Globe, 
  Lock, 
  Mail, 
  Moon, 
  Sun, 
  User, 
  Phone, 
  Calendar, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [additionalEmails, setAdditionalEmails] = useState<{id: string, email: string}[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [settings, setSettings] = useState({
    full_name: 'John Smith',
    phone_number: '',
    profile_photo_url: null,
    email_notifications: true,
    sms_notifications: false,
    in_app_notifications: true,
    schedule_updates: true,
    team_communications: true,
    all_notifications: true,
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    additional_emails: [] as string[]
  });
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const toggleSwitch = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setHasUnsavedChanges(true);
  };

  const addEmail = () => {
    if (newEmail && newEmail.includes('@')) {
      setAdditionalEmails([...additionalEmails, { id: Date.now().toString(), email: newEmail }]);
      setNewEmail('');
      setHasUnsavedChanges(true);
    }
  };

  const removeEmail = (id: string) => {
    setAdditionalEmails(additionalEmails.filter(email => email.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving data
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    }, 1500);
  };

  const handleChangePassword = () => {
    // Reset states
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setIsChangingPassword(true);
    
    // Simulate password change
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(null);
        setShowPasswordSection(false);
      }, 3000);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          {hasUnsavedChanges && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Save size={16} color="#ffffff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Settings</Text>
          
          <View style={styles.profileSection}>
            <View style={styles.photoUploadContainer}>
              <View style={styles.photoPlaceholder}>
                <User size={32} color="#d1d5db" />
              </View>
              <Text style={styles.photoUploadText}>Tap to upload photo</Text>
            </View>
            
            <View style={styles.profileFields}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={settings.full_name}
                  onChangeText={(value) => handleInputChange('full_name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  value={userEmail}
                  editable={false}
                  placeholder="Your email address"
                  placeholderTextColor="#9ca3af"
                />
                <Text style={styles.helperText}>
                  This is your primary email address used for authentication.
                </Text>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={settings.phone_number}
                  onChangeText={(value) => handleInputChange('phone_number', value)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Email Addresses</Text>
            
            {additionalEmails.map(email => (
              <View key={email.id} style={styles.emailRow}>
                <TextInput
                  style={[styles.textInput, styles.emailInput]}
                  value={email.email}
                  editable={false}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeEmail(email.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
            
            <View style={styles.emailRow}>
              <TextInput
                style={[styles.textInput, styles.emailInput]}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Add another email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.addEmailButton}
                onPress={addEmail}
              >
                <Text style={styles.addEmailButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Clock size={20} color="#9ca3af" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Timezone</Text>
                <View style={styles.timezoneContainer}>
                  <Text style={styles.timezoneValue}>{settings.timezone}</Text>
                </View>
                <Text style={styles.timezoneInfo}>
                  Current time: {new Date().toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Lock size={20} color="#9ca3af" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Password</Text>
                <Text style={styles.settingDescription}>Update your password</Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => setShowPasswordSection(!showPasswordSection)}
              >
                <Text style={styles.changeButtonText}>
                  {showPasswordSection ? 'Cancel' : 'Change'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {showPasswordSection && (
              <View style={styles.passwordSection}>
                {passwordSuccess && (
                  <View style={styles.successContainer}>
                    <CheckCircle size={20} color="#10b981" style={styles.successIcon} />
                    <Text style={styles.successText}>{passwordSuccess}</Text>
                  </View>
                )}
                
                {passwordError && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color="#ef4444" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{passwordError}</Text>
                  </View>
                )}
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>New Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
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
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Confirm New Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm new password"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
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
                  style={[
                    styles.updatePasswordButton,
                    (isChangingPassword || !newPassword || !confirmPassword) && styles.updatePasswordButtonDisabled
                  ]}
                  onPress={handleChangePassword}
                  disabled={isChangingPassword || !newPassword || !confirmPassword}
                >
                  {isChangingPassword ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.updatePasswordButtonText}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Globe size={20} color="#9ca3af" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDescription}>Choose your preferred language</Text>
              </View>
              <View style={styles.languageSelector}>
                <Text style={styles.languageValue}>English</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingIconContainer}>
                <Sun size={20} color="#9ca3af" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Theme</Text>
                <Text style={styles.settingDescription}>Choose light or dark theme</Text>
              </View>
              <View style={styles.themeButtons}>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    !isDarkMode && styles.activeThemeButton
                  ]}
                  onPress={() => setIsDarkMode(false)}
                >
                  <Sun size={20} color={!isDarkMode ? '#3b82f6' : '#6b7280'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeButton,
                    isDarkMode && styles.activeThemeButton
                  ]}
                  onPress={() => setIsDarkMode(true)}
                >
                  <Moon size={20} color={isDarkMode ? '#3b82f6' : '#6b7280'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            
            <View style={styles.notificationRow}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Email Notifications</Text>
                <Text style={styles.notificationDescription}>Receive updates via email</Text>
              </View>
              <Switch
                value={settings.email_notifications}
                onValueChange={() => toggleSwitch('email_notifications')}
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={settings.email_notifications ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
            
            <View style={styles.notificationRow}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>SMS Notifications</Text>
                <Text style={styles.notificationDescription}>Receive updates via text message</Text>
              </View>
              <Switch
                value={settings.sms_notifications}
                onValueChange={() => toggleSwitch('sms_notifications')}
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={settings.sms_notifications ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
            
            <View style={styles.notificationRow}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>In-App Notifications</Text>
                <Text style={styles.notificationDescription}>Receive notifications in the app</Text>
              </View>
              <Switch
                value={settings.in_app_notifications}
                onValueChange={() => toggleSwitch('in_app_notifications')}
                trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                thumbColor={settings.in_app_notifications ? '#3b82f6' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  profileSection: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  photoUploadContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoUploadText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  profileFields: {
    flex: 1,
    gap: 12,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter-Regular',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  emailInput: {
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  addEmailButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEmailButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  timezoneContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  timezoneValue: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  timezoneInfo: {
    fontSize: 12,
    color: '#3b82f6',
    fontFamily: 'Inter-Regular',
  },
  changeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
  },
  passwordSection: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successIcon: {
    marginRight: 8,
  },
  successText: {
    color: '#047857',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  eyeButton: {
    padding: 12,
  },
  updatePasswordButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updatePasswordButtonDisabled: {
    opacity: 0.5,
  },
  updatePasswordButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  languageSelector: {
    paddingHorizontal: 8,
  },
  languageValue: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeThemeButton: {
    backgroundColor: '#eff6ff',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  notificationDescription: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
});