import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, Globe, Lock, CreditCard, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  
  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'personal-info',
          title: 'Personal Information',
          icon: <Info size={20} color="#6b7280" />,
          showArrow: true
        },
        {
          id: 'payment-methods',
          title: 'Payment Methods',
          icon: <CreditCard size={20} color="#6b7280" />,
          showArrow: true
        },
        {
          id: 'security',
          title: 'Security',
          icon: <Lock size={20} color="#6b7280" />,
          showArrow: true
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          title: 'Notifications',
          icon: <Bell size={20} color="#6b7280" />,
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          icon: <Moon size={20} color="#6b7280" />,
          toggle: true,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled
        },
        {
          id: 'language',
          title: 'Language',
          icon: <Globe size={20} color="#6b7280" />,
          showArrow: true,
          detail: 'English'
        },
        {
          id: 'biometrics',
          title: 'Use Biometrics',
          icon: <Lock size={20} color="#6b7280" />,
          toggle: true,
          value: biometricsEnabled,
          onToggle: setBiometricsEnabled
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          icon: <HelpCircle size={20} color="#6b7280" />,
          showArrow: true
        },
        {
          id: 'about',
          title: 'About',
          icon: <Info size={20} color="#6b7280" />,
          showArrow: true
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.sectionContent}>
              {section.items.map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.settingItem}
                  disabled={item.toggle}
                >
                  <View style={styles.settingItemLeft}>
                    <View style={styles.iconContainer}>
                      {item.icon}
                    </View>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                  </View>
                  
                  <View style={styles.settingItemRight}>
                    {item.detail && (
                      <Text style={styles.settingDetail}>{item.detail}</Text>
                    )}
                    
                    {item.toggle && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                        thumbColor={item.value ? '#3b82f6' : '#9ca3af'}
                        ios_backgroundColor="#d1d5db"
                      />
                    )}
                    
                    {item.showArrow && (
                      <ChevronRight size={20} color="#9ca3af" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1f2937',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1f2937',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ef4444',
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
  },
});