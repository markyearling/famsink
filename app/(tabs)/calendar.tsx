import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Calendar as CalendarIcon,
  LayoutGrid,
  LayoutList
} from 'lucide-react-native';
import { DateTime } from 'luxon';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [userTimezone, setUserTimezone] = useState('UTC');

  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };
  
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const renderTitle = () => {
    const options = { 
      year: 'numeric' as const, 
    };
    
    switch (view) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long' as const,
          year: 'numeric' as const
        });
      case 'week':
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() + 6);
        return `${currentDate.toLocaleDateString('en-US', { month: 'short' as const, day: 'numeric' as const })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' as const, day: 'numeric' as const, year: 'numeric' as const })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long' as const, 
          month: 'long' as const, 
          day: 'numeric' as const,
          year: 'numeric' as const
        });
      default:
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long' as const,
          year: 'numeric' as const
        });
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
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Calendar</Text>
          </View>
          
          <View style={styles.navigationContainer}>
            <View style={styles.navControls}>
              <TouchableOpacity
                onPress={navigatePrevious}
                style={styles.navButton}
              >
                <ChevronLeft size={20} color="#64748b" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={navigateToday}
                style={styles.todayButton}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={navigateNext}
                style={styles.navButton}
              >
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
              
              <Text style={styles.dateTitle}>{renderTitle()}</Text>
            </View>
            
            <View style={styles.viewControls}>
              <View style={styles.viewButtonsContainer}>
                <TouchableOpacity
                  onPress={() => setView('month')}
                  style={[
                    styles.viewButton,
                    view === 'month' && styles.activeViewButton
                  ]}
                >
                  <CalendarIcon 
                    size={20} 
                    color={view === 'month' ? '#3b82f6' : '#64748b'} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setView('week')}
                  style={[
                    styles.viewButton,
                    view === 'week' && styles.activeViewButton
                  ]}
                >
                  <LayoutGrid 
                    size={20} 
                    color={view === 'week' ? '#3b82f6' : '#64748b'} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setView('day')}
                  style={[
                    styles.viewButton,
                    view === 'day' && styles.activeViewButton
                  ]}
                >
                  <View style={styles.dayViewIcon}>
                    <View style={styles.dayViewLine}></View>
                    <View style={styles.dayViewLine}></View>
                    <View style={styles.dayViewLine}></View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setView('agenda')}
                  style={[
                    styles.viewButton,
                    view === 'agenda' && styles.activeViewButton
                  ]}
                >
                  <LayoutList 
                    size={20} 
                    color={view === 'agenda' ? '#3b82f6' : '#64748b'} 
                  />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={() => setFilterOpen(!filterOpen)}
                style={styles.filterButton}
              >
                <Filter size={16} color="#64748b" />
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {filterOpen && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filters coming soon</Text>
            <Text style={styles.filterSubtitle}>We're working on implementing filters for the calendar view</Text>
          </View>
        )}
        
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <View key={index} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.calendarBody}>
            <Text style={styles.comingSoonText}>Calendar view coming soon</Text>
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
    marginBottom: 24,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  navigationContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    marginHorizontal: 8,
  },
  todayButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    padding: 8,
    borderRadius: 4,
  },
  activeViewButton: {
    backgroundColor: '#ebf5ff',
  },
  dayViewIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayViewLine: {
    width: 16,
    height: 2,
    backgroundColor: '#64748b',
    marginVertical: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
  },
  filterContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  filterSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  calendarHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dayHeader: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
  calendarBody: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Inter-Medium',
  },
});