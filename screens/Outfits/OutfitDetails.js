import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {LottieLoader} from '../../components/LottieLoader';

const {width} = Dimensions.get('window');

const OutfitDetails = ({route}) => {
  const {outfit} = route.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  // Set navigation options immediately to prevent white flash
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    if (outfit && outfit.items) {
      fetchOutfitItems();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOutfitItems = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');

      // Fetch all items in parallel
      const itemPromises = outfit.items.map(itemId =>
        firestore()
          .collection('users')
          .doc(user.uid)
          .collection('items')
          .doc(itemId)
          .get(),
      );

      const itemDocs = await Promise.all(itemPromises);
      const loadedItems = itemDocs
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

      setItems(loadedItems);
    } catch (error) {
      console.error('Error fetching outfit items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = item => {
    navigation.navigate('ItemDetails', {item});
  };

  // Always render dark background immediately
  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#222831" translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
        {/* Header - Always visible */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <View style={styles.backButtonContainer}>
              <Ionicons name="arrow-back" size={24} color="#222831" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {outfit.name || 'Unnamed Outfit'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={22} color="#FFD66B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart-outline" size={22} color="#FFD66B" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <LottieLoader size={72} />
            <Text style={styles.loadingText}>Loading items...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={true}>
            {/* Description Section */}
            {outfit.description && (
              <View style={styles.descriptionContainer}>
                <View style={styles.descriptionHeader}>
                  <Ionicons name="document-text-outline" size={20} color="#FFD66B" />
                  <Text style={styles.descriptionLabel}>Description</Text>
                </View>
                <View style={styles.descriptionCard}>
                  <Text style={styles.description}>{outfit.description}</Text>
                </View>
              </View>
            )}

            {/* Items Section */}
            <View style={styles.itemsContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Ionicons name="shirt-outline" size={22} color="#FFD66B" />
                  <Text style={styles.sectionTitle}>
                    Items ({items.length})
                  </Text>
                </View>
              </View>

              {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="shirt-outline" size={60} color="#393E46" />
                  <Text style={styles.emptyText}>No items in this outfit</Text>
                </View>
              ) : (
                items.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}>
                    {item.imageUrl ? (
                      <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
                    ) : item.imageBase64 ? (
                      <Image
                        source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
                        style={styles.itemImage}
                      />
                    ) : item.selectedImage ? (
                      <Image
                        source={{uri: item.selectedImage}}
                        style={styles.itemImage}
                      />
                    ) : (
                      <View style={[styles.itemImage, styles.placeholderImage]}>
                        <Ionicons name="image" size={32} color="#FFD66B" />
                      </View>
                    )}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name || 'Unnamed Item'}
                      </Text>
                      <View style={styles.itemMeta}>
                        <View style={styles.categoryBadge}>
                          <Ionicons name="pricetag" size={12} color="#FFD66B" />
                          <Text style={styles.itemCategory}>{item.category}</Text>
                        </View>
                        {item.brand && (
                          <Text style={styles.itemBrand}>{item.brand}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.chevronContainer}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#FFD66B"
                      />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
        )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#222831',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#222831',
  },
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222831',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#FFD66B',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#393E46',
  },
  backButton: {
    zIndex: 10,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD66B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD66B',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D333B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD66B',
  },
  descriptionCard: {
    backgroundColor: '#2D333B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#393E46',
  },
  description: {
    fontSize: 15,
    color: '#eee',
    lineHeight: 22,
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD66B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D333B',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#393E46',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#393E46',
    resizeMode: 'cover',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#393E46',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#eee',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#393E46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#FFD66B',
    fontWeight: '600',
  },
  itemBrand: {
    fontSize: 12,
    color: '#999',
  },
  chevronContainer: {
    marginLeft: 8,
    padding: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default OutfitDetails;
