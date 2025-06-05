import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  checkPremiumStatus,
  FREE_TIER_LIMITS,
} from '../../utils/PremiumFeatures';
import PremiumModal from '../../components/PremiumModal';

const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2; // 2 columns with 16 padding on each side

const Closet = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    checkUserPremiumStatus();
    fetchInitialItems();
  }, []);

  const checkUserPremiumStatus = async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
  };

  const fetchInitialItems = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) return;

      // Get total count first
      const totalSnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('items')
        .count()
        .get();

      setItemCount(totalSnapshot.data().count);

      // Then fetch first batch of items
      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('items')
        .orderBy('createdAt', 'desc')
        .limit(ITEMS_PER_PAGE)
        .get();

      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setItems(itemsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setAllItemsLoaded(itemsData.length < ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMoreItems = async () => {
    if (loadingMore || allItemsLoaded) return;

    try {
      setLoadingMore(true);
      const user = auth().currentUser;
      if (!user) return;

      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('items')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(ITEMS_PER_PAGE)
        .get();

      const newItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (newItems.length > 0) {
        setItems([...items, ...newItems]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      setAllItemsLoaded(newItems.length < ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching more items:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddItem = () => {
    if (!isPremium && itemCount >= FREE_TIER_LIMITS.MAX_ITEMS) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('Add');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.itemCard, {width: COLUMN_WIDTH}]}
      onPress={() => navigation.navigate('ItemDetails', {item})}>
      <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemCategory} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setAllItemsLoaded(false);
    setLastVisible(null);
    fetchInitialItems();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Closet</Text>
        {!isPremium && (
          <View style={styles.limitBadge}>
            <Text style={styles.limitText}>
              {itemCount}/{FREE_TIER_LIMITS.MAX_ITEMS}
            </Text>
          </View>
        )}
      </View>

      {!isPremium && itemCount > 0 && (
        <View style={styles.limitContainer}>
          <Text style={styles.limitInfoText}>
            {itemCount}/{FREE_TIER_LIMITS.MAX_ITEMS} Items Used
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SubscriptionIntro')}
            style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade for Unlimited</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.itemsGrid}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={fetchMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in your closet</Text>
            <Text style={styles.emptySubText}>
              Add your first item to get started
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          navigation.navigate('SubscriptionIntro');
        }}
        featureName="Unlimited Items"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  limitBadge: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  limitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  limitInfoText: {
    fontSize: 16,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  itemsGrid: {
    padding: 8,
  },
  itemCard: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemInfo: {
    padding: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default Closet;
