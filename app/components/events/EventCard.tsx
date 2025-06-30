import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { Event } from '../../types';
import EventModal from './EventModal';
import { DateTime } from 'luxon';

interface EventCardProps {
  event: Event;
  userTimezone?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, userTimezone = 'UTC' }) => {
  const [showModal, setShowModal] = useState(false);
  const PlatformIcon = event.platformIcon;

  // Format time with user's timezone using Luxon
  const formatTime = (date: Date) => {
    return DateTime.fromJSDate(date).setZone(userTimezone).toLocaleString({
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setShowModal(true)}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <View 
                style={[
                  styles.dateBox, 
                  { backgroundColor: event.color + '20', borderColor: event.color }
                ]}
              >
                <Text style={[styles.month, { color: event.color }]}>
                  {event.startTime.toLocaleString('default', { month: 'short' })}
                </Text>
                <Text style={[styles.day, { color: event.color }]}>
                  {event.startTime.getDate()}
                </Text>
              </View>
            </View>
            <View style={styles.eventInfo}>
              <View style={styles.sportRow}>
                <View 
                  style={[styles.sportDot, { backgroundColor: event.color }]}
                />
                <Text style={styles.sportText}>{event.sport}</Text>
                <View style={styles.sportBadge}>
                  <Text style={styles.sportBadgeText}>{event.sport}</Text>
                </View>
              </View>
              <Text style={styles.title}>{event.title}</Text>
              <View style={styles.detailsRow}>
                <View style={styles.timeContainer}>
                  <Clock size={16} color="#6b7280" style={styles.icon} />
                  <Text style={styles.detailText}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </Text>
                </View>
                {event.location && (
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#6b7280" style={styles.icon} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.platformContainer}>
              <View 
                style={[
                  styles.platformIcon, 
                  { backgroundColor: event.platformColor + '20' }
                ]}
              >
                <PlatformIcon size={16} color={event.platformColor} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {showModal && (
        <EventModal 
          event={event} 
          onClose={() => setShowModal(false)}
          userTimezone={userTimezone}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateContainer: {
    marginRight: 16,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  month: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  eventInfo: {
    flex: 1,
    minWidth: 0,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sportDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sportText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  sportBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  sportBadgeText: {
    fontSize: 10,
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  platformContainer: {
    marginLeft: 8,
  },
  platformIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventCard;