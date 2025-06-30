import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Heart } from 'lucide-react-native';
import { useState } from 'react';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const popularCategories = [
    { id: '1', name: 'Dresses', icon: '👗' },
    { id: '2', name: 'Shoes', icon: '👟' },
    { id: '3', name: 'Bags', icon: '👜' },
    { id: '4', name: 'Jewelry', icon: '💍' },
    { id: '5', name: 'Beauty', icon: '💄' },
    { id: '6', name: 'Home', icon: '🏠' },
  ];
  
  const trendingItems = [
    {
      id: '1',
      name: 'Summer Dress',
      price: 49.99,
      image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false
    },
    {
      id: '2',
      name: 'Casual Shirt',
      price: 29.99,
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: true
    },
    {
      id: '3',
      name: 'Denim Jacket',
      price: 79.99,
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false
    },
    {
      id: '4',
      name: 'Leather Bag',
      price: 129.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false
    },
    {
      id: '5',
      name: 'Sneakers',
      price: 89.99,
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: true
    },
    {
      id: '6',
      name: 'Sunglasses',
      price: 19.99,
      image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {popularCategories.map(category => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          
          <View style={styles.productsGrid}>
            {trendingItems.map(item => (
              <TouchableOpacity key={item.id} style={styles.productItem}>
                <View style={styles.productImageContainer}>
                  <Image 
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Heart 
                      size={18} 
                      color={item.isFavorite ? "#ef4444" : "#ffffff"} 
                      fill={item.isFavorite ? "#ef4444" : "none"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>${item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    height: 46,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#1f2937',
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  categoriesSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#1f2937',
  },
  categoriesList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#4b5563',
  },
  trendingSection: {
    marginBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  productItem: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  productImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    marginTop: 8,
  },
  productName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#3b82f6',
  },
});