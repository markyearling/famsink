import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Share2
} from 'lucide-react-native';
import { Event } from '../../types';
import { DateTime } from 'luxon';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  userTimezone?: string;
}

const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  onClose,
  userTimezone = 'UTC'
}) => {
  // Format date and time with user's timezone
  const formatDate = (date: Date) => {
    return DateTime.fromJSDate(date).setZone(userTimezone).toLocaleString({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return DateTime.fromJSDate(date).setZone(userTimezone).toLocaleString({
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const PlatformIcon = event.platformIcon;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View 
                    style={[styles.colorDot, { backgroundColor: event.child.color }]}
                  />
                  <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
                </View>
                <View style={styles.headerButtons}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => {/* Share functionality would go here */}}
                  >
                    <Share2 size={20} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={onClose}
                  >
                    <X size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.content}>
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Calendar size={20} color="#6b7280" style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                      {formatDate(event.startTime)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Clock size={20} color="#6b7280" style={styles.detailIcon} />
                    <Text style={styles.detailText}>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <User size={20} color="#6b7280" style={styles.detailIcon} />
                    <Text style={styles.detailText}>{event.child.name}</Text>
                  </View>

                  {event.location && (
                    <View style={styles.locationContainer}>
                      <View style={styles.detailRow}>
                        <MapPin size={20} color="#6b7280" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{event.location}</Text>
                      </View>
                      
                      <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapPlaceholderText}>
                          Map view not available in mobile app
                        </Text>
                      </View>
                    </View>
                  )}

                  {event.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionText}>{event.description}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.platformInfo}>
                  <PlatformIcon size={16} color={event.platformColor} style={styles.platformIcon} />
                  <Text style={[styles.platformText, { color: event.platformColor }]}>
                    Synced from {event.platform}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter-Regular',
  },
  locationContainer: {
    marginTop: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  mapPlaceholderText: {
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  descriptionContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter-Regular',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  platformIcon: {
    marginRight: 8,
  },
  platformText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});

export default EventModal;