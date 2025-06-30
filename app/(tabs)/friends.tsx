import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Users, UserPlus, Search, Mail, Clock, Check, X, Trash2, Shield, Eye, MessageCircle, CreditCard as Edit2, Save, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function FriendsScreen() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingFriend, setEditingFriend] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<'none' | 'viewer' | 'administrator'>('none');

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setFriends([
        {
          id: '1',
          friend_id: 'user1',
          role: 'administrator',
          friend: {
            id: 'user1',
            full_name: 'Sarah Johnson',
            profile_photo_url: null
          },
          unreadCount: 2
        },
        {
          id: '2',
          friend_id: 'user2',
          role: 'viewer',
          friend: {
            id: 'user2',
            full_name: 'Michael Brown',
            profile_photo_url: null
          },
          unreadCount: 0
        }
      ]);
      
      setIncomingRequests([
        {
          id: '3',
          requester_id: 'user3',
          requested_id: 'currentUser',
          status: 'pending',
          role: 'none',
          message: 'Hey, I would like to connect and share our kids\' schedules!',
          requester: {
            id: 'user3',
            full_name: 'Jessica Williams',
            profile_photo_url: null
          }
        }
      ]);
      
      setOutgoingRequests([
        {
          id: '4',
          requester_id: 'currentUser',
          requested_id: 'user4',
          status: 'pending',
          role: 'none',
          requested: {
            id: 'user4',
            full_name: 'David Miller',
            profile_photo_url: null
          }
        }
      ]);
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const searchUsers = () => {
    if (!searchEmail.trim() || searchEmail.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError(null);

    // Simulate search delay
    setTimeout(() => {
      // Mock search results
      const results = [
        {
          id: 'user5',
          email: 'emily.davis@example.com',
          full_name: 'Emily Davis',
          profile_photo_url: null
        }
      ];
      
      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchEmail.trim().length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchEmail]);

  const sendFriendRequest = (userId: string) => {
    setError(null);
    
    // Simulate sending friend request
    setTimeout(() => {
      setSuccess('Friend request sent successfully!');
      setSearchResults([]);
      setSearchEmail('');
      setRequestMessage('');
      
      // Add to outgoing requests
      setOutgoingRequests([
        ...outgoingRequests,
        {
          id: Date.now().toString(),
          requester_id: 'currentUser',
          requested_id: userId,
          status: 'pending',
          role: 'none',
          requested: {
            id: userId,
            full_name: 'Emily Davis',
            profile_photo_url: null
          }
        }
      ]);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const respondToRequest = (requestId: string, status: 'accepted' | 'declined') => {
    setError(null);
    
    // Simulate responding to request
    setTimeout(() => {
      if (status === 'accepted') {
        // Find the request
        const request = incomingRequests.find(r => r.id === requestId);
        
        // Add to friends
        if (request) {
          setFriends([
            ...friends,
            {
              id: Date.now().toString(),
              friend_id: request.requester_id,
              role: 'none',
              friend: request.requester,
              unreadCount: 0
            }
          ]);
        }
        
        setSuccess('Friend request accepted!');
      } else {
        setSuccess('Friend request declined');
      }
      
      // Remove from incoming requests
      setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const removeFriend = (friendshipId: string) => {
    setError(null);
    
    // Simulate removing friend
    setTimeout(() => {
      setFriends(friends.filter(f => f.id !== friendshipId));
      setSuccess('Friend removed successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const cancelRequest = (requestId: string) => {
    setError(null);
    
    // Simulate cancelling request
    setTimeout(() => {
      setOutgoingRequests(outgoingRequests.filter(r => r.id !== requestId));
      setSuccess('Friend request cancelled');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const updateFriendRole = (friendshipId: string, newRole: 'none' | 'viewer' | 'administrator') => {
    setError(null);
    
    // Simulate updating role
    setTimeout(() => {
      setFriends(friends.map(f => 
        f.id === friendshipId 
          ? { ...f, role: newRole }
          : f
      ));
      
      setSuccess(`Friend access level updated to ${getRoleLabel(newRole)}`);
      setEditingFriend(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }, 1000);
  };

  const startEditingRole = (friendshipId: string, currentRole: 'none' | 'viewer' | 'administrator') => {
    setEditingFriend(friendshipId);
    setEditingRole(currentRole);
  };

  const cancelEditingRole = () => {
    setEditingFriend(null);
    setEditingRole('none');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Shield size={16} color="#ef4444" />;
      case 'viewer':
        return <Eye size={16} color="#3b82f6" />;
      case 'none':
      default:
        return <MessageCircle size={16} color="#10b981" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Administrator';
      case 'viewer':
        return 'Viewer';
      case 'none':
      default:
        return 'Friend';
    }
  };

  const getAccessLevelDescription = (role: string) => {
    switch (role) {
      case 'administrator':
        return 'Can view and manage all schedules, events, and profiles';
      case 'viewer':
        return 'Can view schedules and events in dashboard and calendar';
      case 'none':
      default:
        return 'Can chat and send messages only';
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
            <Users size={24} color="#3b82f6" style={styles.titleIcon} />
            <View>
              <Text style={styles.title}>Friends</Text>
              <Text style={styles.subtitle}>
                Manage your friends and share your children's schedules and events
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          {error && (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color="#ef4444" style={styles.errorIcon} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={styles.successContainer}>
              <Check size={20} color="#10b981" style={styles.successIcon} />
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}
          
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Access Levels Explained</Text>
            <View style={styles.infoBoxContent}>
              <View style={styles.accessLevelRow}>
                <Text style={styles.accessLevelLabel}>💬 Friend:</Text>
                <Text style={styles.accessLevelDescription}>Can chat and send messages only</Text>
              </View>
              <View style={styles.accessLevelRow}>
                <Text style={styles.accessLevelLabel}>👁️ Viewer:</Text>
                <Text style={styles.accessLevelDescription}>Can view schedules and events in dashboard and calendar</Text>
              </View>
              <View style={styles.accessLevelRow}>
                <Text style={styles.accessLevelLabel}>👑 Administrator:</Text>
                <Text style={styles.accessLevelDescription}>Can view and manage all schedules, events, and profiles</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserPlus size={16} color="#6b7280" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Add Friend</Text>
            </View>
            
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={16} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  value={searchEmail}
                  onChangeText={setSearchEmail}
                  placeholder="Start typing a user's name..."
                  placeholderTextColor="#9ca3af"
                />
                {searching && (
                  <ActivityIndicator size="small" color="#3b82f6" style={styles.searchingIndicator} />
                )}
              </View>
              
              <Text style={styles.searchHint}>
                Search results will appear as you type (minimum 2 characters). Search is by user name only.
              </Text>
              
              {searchResults.length > 0 && (
                <View style={styles.searchResultsContainer}>
                  <TextInput
                    style={styles.messageInput}
                    value={requestMessage}
                    onChangeText={setRequestMessage}
                    placeholder="Optional message with your friend request"
                    placeholderTextColor="#9ca3af"
                    multiline
                  />
                  
                  <View style={styles.searchResults}>
                    <View style={styles.searchResultsHeader}>
                      <Text style={styles.searchResultsHeaderText}>
                        ✅ Found {searchResults.length} user(s) matching "{searchEmail.trim()}"
                      </Text>
                    </View>
                    
                    {searchResults.map(user => (
                      <View key={user.id} style={styles.searchResultItem}>
                        <View style={styles.userInfo}>
                          <View style={styles.userAvatar}>
                            {user.profile_photo_url ? (
                              <Image 
                                source={{ uri: user.profile_photo_url }}
                                style={styles.avatarImage}
                              />
                            ) : (
                              <Text style={styles.avatarText}>
                                {(user.full_name || 'U').charAt(0).toUpperCase()}
                              </Text>
                            )}
                          </View>
                          <View style={styles.userDetails}>
                            <Text style={styles.userName}>{user.full_name || 'No name set'}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.sendRequestButton}
                          onPress={() => sendFriendRequest(user.id)}
                        >
                          <UserPlus size={12} color="#ffffff" style={styles.sendRequestIcon} />
                          <Text style={styles.sendRequestText}>Send Request</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {searchEmail.trim().length >= 2 && !searching && searchResults.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Search size={24} color="#d1d5db" style={styles.noResultsIcon} />
                  <Text style={styles.noResultsText}>No available users found for "{searchEmail.trim()}"</Text>
                  <Text style={styles.noResultsSubtext}>They may already be your friend, have a pending request, or don't exist</Text>
                </View>
              )}
            </View>
          </View>
          
          {incomingRequests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Mail size={16} color="#6b7280" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Incoming Requests ({incomingRequests.length})</Text>
              </View>
              
              <View style={styles.requestsList}>
                {incomingRequests.map(request => (
                  <View key={request.id} style={styles.incomingRequestItem}>
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        {request.requester?.profile_photo_url ? (
                          <Image 
                            source={{ uri: request.requester.profile_photo_url }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Text style={styles.avatarText}>
                            {(request.requester?.full_name || 'U').charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{request.requester?.full_name || 'No name set'}</Text>
                        <Text style={styles.userEmail}>{request.requester?.email || `ID: ${request.requester_id.slice(0, 8)}...`}</Text>
                        <Text style={styles.requestMessage}>Wants to be your friend</Text>
                        {request.message && (
                          <View style={styles.requestMessageBox}>
                            <Text style={styles.requestMessageText}>"{request.message}"</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => respondToRequest(request.id, 'accepted')}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.declineButton}
                        onPress={() => respondToRequest(request.id, 'declined')}
                      >
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {outgoingRequests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={16} color="#6b7280" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Pending Requests ({outgoingRequests.length})</Text>
              </View>
              
              <View style={styles.requestsList}>
                {outgoingRequests.map(request => (
                  <View key={request.id} style={styles.outgoingRequestItem}>
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        {request.requested?.profile_photo_url ? (
                          <Image 
                            source={{ uri: request.requested.profile_photo_url }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Text style={styles.avatarText}>
                            {(request.requested?.full_name || 'U').charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{request.requested?.full_name || 'No name set'}</Text>
                        <Text style={styles.userEmail}>{request.requested?.email || `ID: ${request.requested_id.slice(0, 8)}...`}</Text>
                        <Text style={styles.requestMessage}>Friend request sent</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => cancelRequest(request.id)}
                    >
                      <X size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={16} color="#6b7280" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Friends ({friends.length})</Text>
            </View>
            
            {friends.length > 0 ? (
              <View style={styles.friendsList}>
                {friends.map(friend => (
                  <View key={friend.id} style={styles.friendItem}>
                    <View style={styles.userInfo}>
                      <View style={styles.userAvatar}>
                        {friend.friend.profile_photo_url ? (
                          <Image 
                            source={{ uri: friend.friend.profile_photo_url }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Text style={styles.avatarText}>
                            {(friend.friend.full_name || 'U').charAt(0).toUpperCase()}
                          </Text>
                        )}
                        {friend.unreadCount > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>
                              {friend.unreadCount > 9 ? '9+' : friend.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={[
                          styles.userName,
                          friend.unreadCount > 0 && styles.unreadUserName
                        ]}>
                          {friend.friend.full_name || 'No name set'}
                        </Text>
                        <Text style={styles.userEmail}>{friend.friend.email || `ID: ${friend.friend_id.slice(0, 8)}...`}</Text>
                        
                        {editingFriend === friend.id ? (
                          <View style={styles.roleEditContainer}>
                            <View style={styles.roleSelector}>
                              <TouchableOpacity
                                style={[
                                  styles.roleSelectorOption,
                                  editingRole === 'none' && styles.roleSelectorOptionSelected
                                ]}
                                onPress={() => setEditingRole('none')}
                              >
                                <Text style={[
                                  styles.roleSelectorOptionText,
                                  editingRole === 'none' && styles.roleSelectorOptionTextSelected
                                ]}>
                                  Friend
                                </Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity
                                style={[
                                  styles.roleSelectorOption,
                                  editingRole === 'viewer' && styles.roleSelectorOptionSelected
                                ]}
                                onPress={() => setEditingRole('viewer')}
                              >
                                <Text style={[
                                  styles.roleSelectorOptionText,
                                  editingRole === 'viewer' && styles.roleSelectorOptionTextSelected
                                ]}>
                                  Viewer
                                </Text>
                              </TouchableOpacity>
                              
                              <TouchableOpacity
                                style={[
                                  styles.roleSelectorOption,
                                  editingRole === 'administrator' && styles.roleSelectorOptionSelected
                                ]}
                                onPress={() => setEditingRole('administrator')}
                              >
                                <Text style={[
                                  styles.roleSelectorOptionText,
                                  editingRole === 'administrator' && styles.roleSelectorOptionTextSelected
                                ]}>
                                  Admin
                                </Text>
                              </TouchableOpacity>
                            </View>
                            
                            <View style={styles.roleEditActions}>
                              <TouchableOpacity
                                style={styles.saveRoleButton}
                                onPress={() => updateFriendRole(friend.id, editingRole)}
                              >
                                <Save size={14} color="#10b981" />
                              </TouchableOpacity>
                              
                              <TouchableOpacity
                                style={styles.cancelEditButton}
                                onPress={cancelEditingRole}
                              >
                                <X size={14} color="#6b7280" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.roleContainer}>
                            <View style={styles.roleInfo}>
                              {getRoleIcon(friend.role)}
                              <View style={styles.roleTextContainer}>
                                <Text style={styles.roleLabel}>{getRoleLabel(friend.role)}</Text>
                                <Text style={styles.roleDescription}>{getAccessLevelDescription(friend.role)}</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.editRoleButton}
                              onPress={() => startEditingRole(friend.id, friend.role)}
                            >
                              <Edit2 size={12} color="#6b7280" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.removeFriendButton}
                      onPress={() => removeFriend(friend.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyFriendsContainer}>
                <Users size={32} color="#d1d5db" style={styles.emptyFriendsIcon} />
                <Text style={styles.emptyFriendsText}>No friends added yet</Text>
                <Text style={styles.emptyFriendsSubtext}>Search for users by name to send friend requests</Text>
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
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    flex: 1,
    fontFamily: 'Inter-Regular',
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
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  infoBoxContent: {
    gap: 6,
  },
  accessLevelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  accessLevelLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e40af',
    width: 100,
    fontFamily: 'Inter-Medium',
  },
  accessLevelDescription: {
    fontSize: 13,
    color: '#1e40af',
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'Inter-Regular',
  },
  searchingIndicator: {
    marginLeft: 8,
  },
  searchHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  searchResultsContainer: {
    marginTop: 12,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  searchResults: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  searchResultsHeader: {
    padding: 8,
    backgroundColor: '#ecfdf5',
    borderBottomWidth: 1,
    borderBottomColor: '#a7f3d0',
  },
  searchResultsHeaderText: {
    fontSize: 12,
    color: '#047857',
    fontFamily: 'Inter-Medium',
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    fontFamily: 'Inter-Medium',
  },
  unreadUserName: {
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  sendRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sendRequestIcon: {
    marginRight: 4,
  },
  sendRequestText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 24,
  },
  noResultsIcon: {
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  noResultsSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  requestsList: {
    gap: 8,
  },
  incomingRequestItem: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
  },
  requestMessage: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  requestMessageBox: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  requestMessageText: {
    fontSize: 12,
    color: '#4b5563',
    fontStyle: 'italic',
    fontFamily: 'Inter-Regular',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  acceptButtonText: {
    fontSize: 12,
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  declineButton: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  declineButtonText: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  outgoingRequestItem: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 8,
  },
  friendsList: {
    gap: 8,
  },
  friendItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleTextContainer: {
    marginLeft: 4,
  },
  roleLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  roleDescription: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  editRoleButton: {
    padding: 4,
  },
  roleEditContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
  },
  roleSelectorOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
  },
  roleSelectorOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  roleSelectorOptionText: {
    fontSize: 12,
    color: '#4b5563',
    fontFamily: 'Inter-Medium',
  },
  roleSelectorOptionTextSelected: {
    color: '#ffffff',
  },
  roleEditActions: {
    flexDirection: 'row',
    gap: 4,
  },
  saveRoleButton: {
    padding: 4,
  },
  cancelEditButton: {
    padding: 4,
  },
  removeFriendButton: {
    padding: 8,
  },
  emptyFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyFriendsIcon: {
    marginBottom: 8,
  },
  emptyFriendsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  emptyFriendsSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});