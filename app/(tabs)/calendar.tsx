import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  // Format month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Check if a date is today
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  // Sample events
  const events = [
    {
      id: '1',
      title: 'Team Meeting',
      time: '10:00 AM - 11:30 AM',
      location: 'Conference Room A',
      color: '#3b82f6'
    },
    {
      id: '2',
      title: 'Lunch with Sarah',
      time: '12:30 PM - 1:30 PM',
      location: 'Cafe Bistro',
      color: '#10b981'
    },
    {
      id: '3',
      title: 'Project Review',
      time: '3:00 PM - 4:00 PM',
      location: 'Meeting Room 3',
      color: '#f59e0b'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <ChevronLeft size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {getMonthName(currentMonth)} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <ChevronRight size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdaysRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dayCell,
              !day.isCurrentMonth && styles.notCurrentMonth,
              isToday(day.day, day.month, day.year) && styles.today
            ]}
          >
            <Text 
              style={[
                styles.dayText,
                !day.isCurrentMonth && styles.notCurrentMonthText,
                isToday(day.day, day.month, day.year) && styles.todayText
              ]}
            >
              {day.day}
            </Text>
            {day.day === 15 && day.isCurrentMonth && (
              <View style={[styles.eventDot, { backgroundColor: '#3b82f6' }]} />
            )}
            {day.day === 20 && day.isCurrentMonth && (
              <View style={[styles.eventDot, { backgroundColor: '#10b981' }]} />
            )}
            {day.day === 25 && day.isCurrentMonth && (
              <View style={[styles.eventDot, { backgroundColor: '#f59e0b' }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.eventsHeader}>
        <Text style={styles.eventsTitle}>Today's Events</Text>
      </View>
      
      <ScrollView 
        style={styles.eventsContainer}
        showsVerticalScrollIndicator={false}
      >
        {events.map(event => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <View style={styles.eventDetail}>
                <Clock size={14} color="#6b7280" style={styles.eventIcon} />
                <Text style={styles.eventDetailText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetail}>
                <MapPin size={14} color="#6b7280" style={styles.eventIcon} />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1f2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
  },
  weekdaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  dayCell: {
    width: '14.28%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1f2937',
  },
  notCurrentMonth: {
    opacity: 0.4,
  },
  notCurrentMonthText: {
    color: '#9ca3af',
  },
  today: {
    backgroundColor: '#3b82f6',
    borderRadius: 22.5,
  },
  todayText: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  eventsHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  eventsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  eventColorBar: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  eventContent: {
    flex: 1,
    padding: 15,
  },
  eventTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIcon: {
    marginRight: 6,
  },
  eventDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
});