import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit, ShoppingBag, Heart, Clock, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const user = {
    name: 'Jessica Parker',
    email: 'jessica.parker@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    stats: {
      orders: 12,
      wishlisted: 24,
      reviews: 8
    }
  };
  
  const recentOrders = [
    {
      id: '1',
      orderNumber: '#ORD-2458',
      date: 'June 12, 2025',
      status: 'Delivered',
      amount: 129.99,
      items: 3
    },
    {
      id: '2',
      orderNumber: '#ORD-2443',
      date: 'May 28, 2025',
      status: 'Delivered',
      amount: 79.99,
      items: 2
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Edit size={16} color="#3b82f6" style={styles.editIcon} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.wishlisted}</Text>
              <Text style={styles.statLabel}>Wishlisted</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#ebf5ff' }]}>
              <ShoppingBag size={20} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#fef2f2' }]}>
              <Heart size={20} color="#ef4444" />
            </View>
            <Text style={styles.actionText}>Wishlist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#f3f4f6' }]}>
              <Clock size={20} color="#4b5563" />
            </View>
            <Text style={styles.actionText}>Recently Viewed</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentOrdersSection}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          
          {recentOrders.map(order => (
            <TouchableOpacity key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <View style={styles.orderStatusContainer}>
                  <Text style={styles.orderStatus}>{order.status}</Text>
                </View>
              </View>
              
              <View style={styles.orderDetails}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderItems}>{order.items} items</Text>
                  <Text style={styles.orderAmount}>${order.amount.toFixed(2)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Orders</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#ef4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 15,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 20,
  },
  editIcon: {
    marginRight: 8,
  },
  editProfileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3b82f6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  recentOrdersSection: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 15,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1f2937',
  },
  orderStatusContainer: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  orderStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10b981',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  orderDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4b5563',
  },
  orderAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1f2937',
  },
  viewAllButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4b5563',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingVertical: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#ef4444',
  },
});