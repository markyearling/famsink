import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Calendar, Users, BarChart, Link as LinkIcon, ExternalLink, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ConnectionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState<any[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<any[]>([]);
  const [refreshingPlatform, setRefreshingPlatform] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectedPlatforms([
        {
          id: 1,
          name: 'SportsEngine',
          icon: Calendar,
          color: '#2563EB',
          connected: true,
          hasIssue: false,
          teamCount: 3,
          lastSynced: new Date().toISOString()
        },
        {
          id: 2,
          name: 'TeamSnap',
          icon: Users,
          color: '#7C3AED',
          connected: true,
          hasIssue: false,
          teamCount: 2,
          lastSynced: new Date().toISOString()
        }
      ]);
      
      setAvailablePlatforms([
        {
          id: 3,
          name: 'Playmetrics',
          icon: BarChart,
          color: '#10B981',
          connected: false,
          hasIssue: false
        },
        {
          id: 4,
          name: 'GameChanger',
          icon: BarChart,
          color: '#F97316',
          connected: false,
          hasIssue: false
        }
      ]);
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleManage = (platformName: string) => {
    // In a real app, this would navigate to the platform management screen
    console.log(`Managing platform: ${platformName}`);
  };

  const handleRefresh = (platformId: number) => {
    setRefreshingPlatform(platformId);
    
    // Simulate refreshing data
    setTimeout(() => {
      setRefreshingPlatform(null);
      setSuccess('Platform refreshed successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 2000);
  };

  const getPlatformLogo = (platformName: string) => {
    switch(platformName) {
      case 'TeamSnap':
        return "https://play-lh.googleusercontent.com/jB40sjFamYP83iQhDcc3DZy_1ukC3TuhH0Dfvh2HMKmhEIFMzB2zTWYZ8CtHU3x5-V8";
      case 'SportsEngine':
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnajmgf8Kri_EZxVAbe7kFESjsiGlQx4lOKw&s";
      case 'Playmetrics':
        return "https://play-lh.googleusercontent.com/3qlMAhClWu_R_XMqFx_8afl4ZiMQpDmw0Xfyb6OyTHAv3--KRr6yxmvmPr0gzQlKJWQ";
      case 'GameChanger':
        return "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/GameChanger_Logo.jpg/250px-GameChanger_Logo.jpg";
      default:
        return "";
    }
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
        <Text style={styles.title}>Connections</Text>
        
        {success && (
          <View style={styles.successContainer}>
            <CheckCircle size={20} color="#10b981" style={styles.successIcon} />
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <AlertTriangle size={20} color="#ef4444" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your connections to sports platforms and services
          </Text>
          
          {connectedPlatforms.length > 0 ? (
            <View style={styles.platformsList}>
              {connectedPlatforms.map(platform => (
                <View key={platform.id} style={styles.platformCard}>
                  <View style={styles.platformHeader}>
                    <View style={styles.platformLogoContainer}>
                      <Image 
                        source={{ uri: getPlatformLogo(platform.name) }}
                        style={styles.platformLogo}
                      />
                    </View>
                    
                    <View style={styles.platformInfo}>
                      <Text style={styles.platformName}>{platform.name}</Text>
                      <View style={styles.statusContainer}>
                        {platform.hasIssue ? (
                          <View style={styles.statusBadgeWarning}>
                            <AlertTriangle size={12} color="#f59e0b" />
                            <Text style={styles.statusTextWarning}>Connection issue</Text>
                          </View>
                        ) : (
                          <View style={styles.statusBadgeSuccess}>
                            <CheckCircle size={12} color="#10b981" />
                            <Text style={styles.statusTextSuccess}>Connected</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.platformDescription}>
                    {platform.hasIssue 
                      ? `There is an issue with your ${platform.name} connection. Please refresh or reconnect.` 
                      : `Your ${platform.name} account is connected and syncing data to FamSink.`}
                  </Text>
                  
                  {platform.teamCount && (
                    <View style={styles.teamInfoContainer}>
                      <Text style={styles.teamInfoText}>
                        <Text style={styles.teamCountText}>{platform.teamCount}</Text> team{platform.teamCount !== 1 ? 's' : ''} connected
                        {platform.lastSynced && (
                          <Text style={styles.lastSyncedText}>
                            {' · Last synced '}{new Date(platform.lastSynced).toLocaleString()}
                          </Text>
                        )}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.platformActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleManage(platform.name)}
                    >
                      <Text style={styles.actionButtonText}>Manage</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRefresh(platform.id)}
                      disabled={refreshingPlatform === platform.id}
                    >
                      {refreshingPlatform === platform.id ? (
                        <View style={styles.refreshingContainer}>
                          <RefreshCw size={16} color="#64748b" style={styles.refreshingIcon} />
                          <Text style={styles.actionButtonText}>Refreshing...</Text>
                        </View>
                      ) : (
                        <View style={styles.refreshContainer}>
                          <RefreshCw size={16} color="#64748b" />
                          <Text style={styles.actionButtonText}>Refresh</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Calendar size={48} color="#d1d5db" />
              <Text style={styles.emptyStateTitle}>No platforms connected</Text>
              <Text style={styles.emptyStateSubtitle}>Connect to your sports platforms to start syncing data</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Platforms</Text>
          <Text style={styles.sectionSubtitle}>
            Connect to additional sports platforms to import your schedules and events
          </Text>
          
          <View style={styles.availablePlatformsList}>
            {availablePlatforms.length > 0 ? (
              availablePlatforms.map(platform => (
                <View key={platform.id} style={styles.availablePlatformCard}>
                  <View style={[styles.availablePlatformHeader, { backgroundColor: platform.color + '10' }]}>
                    <View style={styles.platformLogoContainer}>
                      <Image 
                        source={{ uri: getPlatformLogo(platform.name) }}
                        style={styles.platformLogo}
                      />
                    </View>
                    <Text style={styles.platformName}>{platform.name}</Text>
                  </View>
                  
                  <View style={styles.availablePlatformContent}>
                    <Text style={styles.availablePlatformDescription}>
                      Connect to {platform.name} to import your schedules, events, and team information.
                    </Text>
                    
                    <View style={styles.availablePlatformActions}>
                      <TouchableOpacity style={styles.learnMoreButton}>
                        <Text style={styles.learnMoreText}>Learn more</Text>
                        <ExternalLink size={14} color="#3b82f6" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.connectButton}
                        onPress={() => handleManage(platform.name)}
                      >
                        <Text style={styles.connectButtonText}>Connect</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <CheckCircle size={48} color="#10b981" />
                <Text style={styles.emptyStateTitle}>All platforms connected!</Text>
                <Text style={styles.emptyStateSubtitle}>You've connected all available platforms</Text>
              </View>
            )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontFamily: 'Inter-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
  },
  platformsList: {
    paddingBottom: 8,
  },
  platformCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  platformLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextSuccess: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  statusBadgeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextWarning: {
    fontSize: 12,
    color: '#f59e0b',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  platformDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  teamInfoContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  teamInfoText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter-Regular',
  },
  teamCountText: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  lastSyncedText: {
    color: '#6b7280',
  },
  platformActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  refreshingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refreshingIcon: {
    marginRight: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  availablePlatformsList: {
    padding: 16,
    gap: 16,
  },
  availablePlatformCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  availablePlatformHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  availablePlatformContent: {
    padding: 16,
  },
  availablePlatformDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  availablePlatformActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
  },
  connectButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  connectButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
});