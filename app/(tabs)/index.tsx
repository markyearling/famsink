import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  ArrowRight,
  Bell
} from 'lucide-react-native';
import EventCard from '../components/events/EventCard';
import ChildActivitySummary from '../components/dashboard/ChildActivitySummary';
import ConnectedPlatform from '../components/dashboard/ConnectedPlatform';
import { Child, Platform, Event } from '../types';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');
  
  // Mock data for demonstration
  const [user] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
  });

  const [childrenData] = useState<Child[]>([
    {
      id: '1',
      name: 'Emma',
      age: 10,
      color: '#3B82F6', // Blue
      sports: [
        { name: 'Soccer', color: '#10B981' }, // Green
        { name: 'Swimming', color: '#3B82F6' }, // Blue
      ],
      eventCount: 5,
    },
    {
      id: '2',
      name: 'Jack',
      age: 8,
      color: '#EF4444', // Red
      sports: [
        { name: 'Baseball', color: '#F59E0B' }, // Yellow
        { name: 'Basketball', color: '#EF4444' }, // Red
      ],
      eventCount: 3,
    },
    {
      id: '3',
      name: 'Sophia',
      age: 12,
      color: '#8B5CF6', // Purple
      sports: [
        { name: 'Volleyball', color: '#EC4899' }, // Pink
        { name: 'Tennis', color: '#8B5CF6' }, // Purple
      ],
      eventCount: 4,
    },
  ]);

  const [platformsData] = useState<Platform[]>([
    {
      id: 1,
      name: 'SportsEngine',
      icon: CalendarIcon,
      color: '#2563EB', // Blue
      connected: true,
      hasIssue: false,
    },
    {
      id: 2,
      name: 'TeamSnap',
      icon: Users,
      color: '#7C3AED', // Purple
      connected: true,
      hasIssue: false,
    },
    {
      id: 3,
      name: 'PlayMetrics',
      icon: CalendarIcon,
      color: '#10B981', // Green
      connected: false,
      hasIssue: false,
    },
    {
      id: 4,
      name: 'GameChanger',
      icon: CalendarIcon,
      color: '#F97316', // Orange
      connected: true,
      hasIssue: true,
    },
  ]);

  // Generate mock events
  const generateEvents = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const events: Event[] = [];
    
    // Create events for each child
    childrenData.forEach(child => {
      child.sports.forEach(sport => {
        // Generate some events for the current month
        for (let i = 1; i <= 28; i++) {
          // Only create events on certain days to avoid too many
          if (i % 3 === 0 || i % 5 === 0) {
            const isGame = i % 3 === 0;
            const startTime = new Date(year, month, i, 16 + (i % 4), 0);
            const endTime = new Date(startTime);
            endTime.setHours(endTime.getHours() + (isGame ? 2 : 1.5));
            
            const platform = platformsData[Math.floor(Math.random() * platformsData.length)];
            
            events.push({
              id: events.length + 1,
              title: `${sport.name} ${isGame ? 'Game' : 'Practice'}`,
              description: isGame 
                ? `${child.name}'s ${sport.name} game against ${['Tigers', 'Eagles', 'Warriors', 'Sharks'][i % 4]}`
                : `Regular ${sport.name} practice session`,
              startTime,
              endTime,
              location: isGame 
                ? `${['City Park', 'Memorial Field', 'Community Center', 'Sports Complex'][i % 4]}`
                : `Training Center`,
              sport: sport.name,
              color: sport.color,
              child,
              platform: platform.name,
              platformColor: platform.color,
              platformIcon: platform.icon,
              isToday: startTime.getDate() === now.getDate(),
            });
          }
        }
      });
    });
    
    return events;
  };

  const [events] = useState<Event[]>(generateEvents());
  
  // Upcoming events (today and future)
  const upcomingEvents = events
    .filter(event => event.startTime >= new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  // Handle platform management
  const handleManagePlatform = (platformName: string) => {
    // In a real app, this would navigate to the platform management screen
    console.log(`Managing platform: ${platformName}`);
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <CalendarIcon size={20} color="#ffffff" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
            </View>
            <Text style={styles.sectionCount}>
              {upcomingEvents.filter(e => e.isToday).length} Events
            </Text>
          </View>
          <View style={styles.sectionContent}>
            {upcomingEvents.filter(e => e.isToday).length > 0 ? (
              upcomingEvents
                .filter(e => e.isToday)
                .map(event => (
                  <EventCard 
                    key={`today-${event.id}`} 
                    event={event} 
                    userTimezone={userTimezone}
                  />
                ))
            ) : (
              <View style={styles.emptyState}>
                <Clock size={48} color="#d1d5db" />
                <Text style={styles.emptyStateTitle}>No events scheduled for today</Text>
                <Text style={styles.emptyStateSubtitle}>Enjoy your free time!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Children Activity & Connected Platforms */}
        <View style={styles.twoColumnLayout}>
          {/* Children Activity Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Users size={20} color="#6b7280" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Children's Activities</Text>
              </View>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/profiles')}
              >
                <Text style={styles.viewAllText}>View all</Text>
                <ArrowRight size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              {childrenData.map(child => (
                <ChildActivitySummary key={child.id} child={child} />
              ))}
            </View>
          </View>

          {/* Connected Platforms */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <CalendarIcon size={20} color="#6b7280" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Connected Platforms</Text>
              </View>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/connections')}
              >
                <Text style={styles.viewAllText}>Manage</Text>
                <ArrowRight size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
              {platformsData.filter(p => p.connected).map(platform => (
                <ConnectedPlatform 
                  key={platform.id} 
                  platform={platform} 
                  onManage={() => handleManagePlatform(platform.name)}
                />
              ))}
              {platformsData.filter(p => p.connected).length === 0 && (
                <View style={styles.emptyPlatforms}>
                  <Text style={styles.emptyPlatformsText}>
                    No platforms connected yet. Visit the Connections page to connect your sports platforms.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <CalendarIcon size={20} color="#6b7280" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Upcoming Events</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/calendar')}
            >
              <Text style={styles.viewAllText}>View calendar</Text>
              <ArrowRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.upcomingEventsContainer}>
            {upcomingEvents
              .filter(e => !e.isToday)
              .slice(0, 5)
              .map(event => (
                <EventCard 
                  key={`upcoming-${event.id}`} 
                  event={event}
                  userTimezone={userTimezone}
                />
              ))}
            {upcomingEvents.filter(e => !e.isToday).length === 0 && (
              <View style={styles.emptyState}>
                <CalendarIcon size={48} color="#d1d5db" />
                <Text style={styles.emptyStateTitle}>No upcoming events scheduled</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(59, 130, 246, 1)', // Blue gradient start
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  sectionContent: {
    // Content will be filled by EventCard components
  },
  twoColumnLayout: {
    flexDirection: 'column',
    marginBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    marginRight: 4,
    fontFamily: 'Inter-Medium',
  },
  cardContent: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 12,
    fontFamily: 'Inter-Medium',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  emptyPlatforms: {
    padding: 16,
  },
  emptyPlatformsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  upcomingEventsContainer: {
    // Content will be filled by EventCard components
  },
});