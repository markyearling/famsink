import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Child } from '../../types';

interface ChildActivitySummaryProps {
  child: Child;
}

const ChildActivitySummary: React.FC<ChildActivitySummaryProps> = ({ child }) => {
  return (
    <View style={styles.container}>
      <View 
        style={[styles.avatar, { backgroundColor: child.color }]}
      >
        <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{child.name}</Text>
        <View style={styles.sportsContainer}>
          {child.sports.map((sport, index) => (
            <View key={index} style={styles.sportItem}>
              <View 
                style={[styles.sportDot, { backgroundColor: sport.color }]}
              />
              <Text style={styles.sportText}>{sport.name}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{child.eventCount}</Text>
        <Text style={styles.countLabel}>This week</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1f2937',
  },
  sportsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  sportDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  sportText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  countContainer: {
    alignItems: 'flex-end',
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  countLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
});

export default ChildActivitySummary;