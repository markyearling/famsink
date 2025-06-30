import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Bell, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const featuredItems = [
    {
      id: '1',
      title: 'Summer Collection',
      description: 'Discover our latest summer styles',
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '2',
      title: 'New Arrivals',
      description: 'Check out what just landed',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: '3',
      title: 'Trending Now',
      description: 'See what everyone is wearing',
      image: 'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const categories = [
    { id: '1', name: 'Women', count: 152 },
    { id: '2', name: 'Men', count: 142 },
    { id: '3', name: 'Kids', count: 92 },
    { id: '4', name: 'Accessories', count: 56 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.username}>Jessica</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredItems.map(item => (
              <TouchableOpacity key={item.id} style={styles.featuredItem}>
                <Image 
                  source={{ uri: item.image }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.promotionSection}>
          <View style={styles.promotion}>
            <View style={styles.promotionContent}>
              <Text style={styles.promotionTitle}>Summer Sale</Text>
              <Text style={styles.promotionDescription}>Get up to 50% off on selected items</Text>
              <TouchableOpacity style={styles.promotionButton}>
                <Text style={styles.promotionButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  username: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#1f2937',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  featuredSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3b82f6',
    marginRight: 4,
  },
  featuredList: {
    paddingRight: 20,
  },
  featuredItem: {
    width: 280,
    height: 180,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredContent: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  featuredDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#f3f4f6',
  },
  categoriesSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  promotionSection: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  promotion: {
    height: 150,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    padding: 20,
    justifyContent: 'center',
  },
  promotionContent: {
    maxWidth: '70%',
  },
  promotionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 8,
  },
  promotionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#e0e7ff',
    marginBottom: 16,
  },
  promotionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3b82f6',
  },
});