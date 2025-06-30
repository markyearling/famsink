import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check, AlertCircle } from 'lucide-react-native';
import { Platform } from '../../types';

interface ConnectedPlatformProps {
  platform: Platform;
  onManage?: () => void;
}

const ConnectedPlatform: React.FC<ConnectedPlatformProps> = ({ platform, onManage }) => {
  const PlatformIcon = platform.icon;

  return (
    <View style={styles.container}>
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: platform.color + '20' }
        ]}
      >
        <PlatformIcon size={24} color={platform.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{platform.name}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {platform.connected ? 'Connected' : 'Not connected'}
          </Text>
          {platform.connected && (
            <View style={styles.connectedBadge}>
              <Check size={12} color="#10b981" style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Synced</Text>
            </View>
          )}
          {platform.hasIssue && (
            <View style={styles.issueBadge}>
              <AlertCircle size={12} color="#f59e0b" style={styles.badgeIcon} />
              <Text style={styles.issueBadgeText}>Issue</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity 
        onPress={onManage}
        style={styles.manageButton}
      >
        <Text style={styles.manageText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#047857',
    fontFamily: 'Inter-Medium',
  },
  issueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  issueBadgeText: {
    fontSize: 10,
    color: '#92400e',
    fontFamily: 'Inter-Medium',
  },
  manageButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  manageText: {
    fontSize: 12,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
  },
});

export default ConnectedPlatform;