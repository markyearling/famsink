import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Modal,
  TextInput,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Plus, 
  X, 
  Crown, 
  Upload
} from 'lucide-react-native';

export default function ProfilesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    color: '#3B82F6',
    notes: ''
  });
  
  // Mock data for demonstration
  const [profiles, setProfiles] = useState<any[]>([]);
  const [friendsProfiles, setFriendsProfiles] = useState<any[]>([]);
  
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' }
  ];

  const availableSports = [
    { name: 'Soccer', color: '#10B981' },
    { name: 'Baseball', color: '#F59E0B' },
    { name: 'Basketball', color: '#EF4444' },
    { name: 'Swimming', color: '#3B82F6' },
    { name: 'Tennis', color: '#8B5CF6' },
    { name: 'Volleyball', color: '#EC4899' }
  ];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setProfiles([
        {
          id: '1',
          name: 'Emma',
          age: 10,
          color: '#3B82F6',
          sports: [
            { name: 'Soccer', color: '#10B981' },
            { name: 'Swimming', color: '#3B82F6' }
          ],
          eventCount: 5,
          isOwnProfile: true
        },
        {
          id: '2',
          name: 'Jack',
          age: 8,
          color: '#EF4444',
          sports: [
            { name: 'Baseball', color: '#F59E0B' },
            { name: 'Basketball', color: '#EF4444' }
          ],
          eventCount: 3,
          isOwnProfile: true
        }
      ]);
      
      setFriendsProfiles([
        {
          id: '3',
          name: 'Sophia',
          age: 12,
          color: '#8B5CF6',
          sports: [
            { name: 'Volleyball', color: '#EC4899' },
            { name: 'Tennis', color: '#8B5CF6' }
          ],
          eventCount: 4,
          isOwnProfile: false,
          ownerName: 'Sarah Johnson'
        }
      ]);
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would save to a database
    const newProfile = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      color: formData.color,
      notes: formData.notes,
      sports: selectedSports.map(sport => {
        const sportData = availableSports.find(s => s.name === sport);
        return {
          name: sport,
          color: sportData?.color || '#000000'
        };
      }),
      eventCount: 0,
      isOwnProfile: true
    };
    
    setProfiles([...profiles, newProfile]);
    setShowAddForm(false);
    setFormData({
      name: '',
      age: '',
      color: '#3B82F6',
      notes: ''
    });
    setSelectedSports([]);
  };

  const handleViewProfile = (childId: string) => {
    router.push(`/profiles/${childId}`);
  };

  // Combine all profiles (own and friends' with admin access)
  const allProfiles = [
    ...profiles.map(p => ({ ...p, isOwnProfile: true })),
    ...friendsProfiles.map(p => ({ ...p, isOwnProfile: false }))
  ];

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
          <Text style={styles.title}>Children Profiles</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Child</Text>
          </TouchableOpacity>
        </View>

        {allProfiles.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>
              Your Children {friendsProfiles.length > 0 && `& Administrator Access (${friendsProfiles.length})`}
            </Text>
            
            <View style={styles.profilesGrid}>
              {allProfiles.map(child => (
                <TouchableOpacity 
                  key={child.id} 
                  style={[
                    styles.profileCard,
                    !child.isOwnProfile && styles.friendProfileCard
                  ]}
                  onPress={() => handleViewProfile(child.id)}
                >
                  <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                      {child.photo_url ? (
                        <Image 
                          source={{ uri: child.photo_url }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View
                          style={[
                            styles.avatarPlaceholder,
                            { backgroundColor: child.color }
                          ]}
                        >
                          <Text style={styles.avatarText}>{child.name.charAt(0)}</Text>
                        </View>
                      )}
                      {!child.isOwnProfile && (
                        <View style={styles.crownBadge}>
                          <Crown size={10} color="#ffffff" />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{child.name}</Text>
                      <Text style={styles.profileAge}>Age: {child.age}</Text>
                      {!child.isOwnProfile && (
                        <Text style={styles.ownerName}>{child.ownerName}'s child</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.sportsContainer}>
                    <Text style={styles.sportsTitle}>Sports</Text>
                    <View style={styles.sportsList}>
                      {child.sports.map((sport, index) => (
                        <View
                          key={index}
                          style={[
                            styles.sportBadge,
                            { backgroundColor: sport.color + '20' }
                          ]}
                        >
                          <Text style={[styles.sportText, { color: sport.color }]}>
                            {sport.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.activityContainer}>
                    <Text style={styles.activityTitle}>Activity Summary</Text>
                    <Text style={styles.activityText}>{child.eventCount} events this week</Text>
                  </View>
                  
                  {!child.isOwnProfile && (
                    <View style={styles.adminBadgeContainer}>
                      <View style={styles.adminBadge}>
                        <Crown size={16} color="#f59e0b" style={styles.adminIcon} />
                        <Text style={styles.adminText}>Administrator Access</Text>
                      </View>
                      <Text style={styles.adminDescription}>
                        You can view and manage all aspects of this profile
                      </Text>
                    </View>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.manageButton,
                      child.isOwnProfile ? styles.ownProfileButton : styles.friendProfileButton
                    ]}
                    onPress={() => handleViewProfile(child.id)}
                  >
                    <Text style={styles.manageButtonText}>Manage Profile</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Plus size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No profiles yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Get started by adding your first child's profile or connect with friends who have granted you administrator access
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => setShowAddForm(true)}
            >
              <Text style={styles.emptyStateButtonText}>Add Your First Child</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Child</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formRow}>
                <View style={styles.photoUploadContainer}>
                  <View style={styles.photoPlaceholder}>
                    <Upload size={32} color="#d1d5db" />
                  </View>
                  <Text style={styles.photoUploadText}>Tap to upload photo</Text>
                </View>
                
                <View style={styles.formFields}>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      placeholder="Enter child's name"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Age</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.age}
                      onChangeText={(value) => handleInputChange('age', value)}
                      placeholder="Enter age"
                      placeholderTextColor="#9ca3af"
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Profile Color</Text>
                    <View style={styles.colorPickerContainer}>
                      {colorOptions.map(color => (
                        <TouchableOpacity
                          key={color.value}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color.value },
                            formData.color === color.value && styles.colorOptionSelected
                          ]}
                          onPress={() => handleInputChange('color', color.value)}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Sports & Activities</Text>
                <View style={styles.sportsGrid}>
                  {availableSports.map(sport => (
                    <TouchableOpacity
                      key={sport.name}
                      style={[
                        styles.sportOption,
                        selectedSports.includes(sport.name) && styles.sportOptionSelected
                      ]}
                      onPress={() => {
                        if (selectedSports.includes(sport.name)) {
                          setSelectedSports(selectedSports.filter(s => s !== sport.name));
                        } else {
                          setSelectedSports([...selectedSports, sport.name]);
                        }
                      }}
                    >
                      <View style={[styles.sportDot, { backgroundColor: sport.color }]} />
                      <Text style={styles.sportOptionText}>{sport.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Additional Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(value) => handleInputChange('notes', value)}
                  placeholder="Enter any important information about your child..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!formData.name || !formData.age) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!formData.name || !formData.age}
              >
                <Text style={styles.submitButtonText}>Add Child</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  profilesGrid: {
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  friendProfileCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  profileAge: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  ownerName: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    marginTop: 2,
    fontFamily: 'Inter-Medium',
  },
  sportsContainer: {
    marginBottom: 16,
  },
  sportsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  sportsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sportText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  activityContainer: {
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  activityText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  adminBadgeContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  adminIcon: {
    marginRight: 6,
  },
  adminText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400e',
    fontFamily: 'Inter-Medium',
  },
  adminDescription: {
    fontSize: 12,
    color: '#b45309',
    fontFamily: 'Inter-Regular',
  },
  manageButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  ownProfileButton: {
    backgroundColor: '#3b82f6',
  },
  friendProfileButton: {
    backgroundColor: '#f59e0b',
  },
  manageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  emptyState: {
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
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Inter-SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: '70%',
  },
  formRow: {
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
  formFields: {
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  sportOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  sportDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sportOptionText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter-Regular',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
});