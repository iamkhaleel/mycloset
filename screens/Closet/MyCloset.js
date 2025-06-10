import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

// Filter names and their corresponding icons
const FILTERS = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Undergarments',
  'Bags',
  'Accessories',
];

const FILTER_ICONS = {
  All: 'apps',
  Tops: 'shirt',
  Bottoms: 'walk',
  Dresses: 'woman',
  Outerwear: 'cloudy-night',
  Shoes: 'footsteps',
  Undergarments: 'body',
  Bags: 'bag',
  Accessories: 'watch',
};

// Sorting options
const SORT_OPTIONS = [
  {label: 'Name (A-Z)', value: 'nameAsc'},
  {label: 'Name (Z-A)', value: 'nameDesc'},
  {label: 'Price (Low to High)', value: 'priceAsc'},
  {label: 'Price (High to Low)', value: 'priceDesc'},
  {label: 'Date Added (Newest)', value: 'dateDesc'},
  {label: 'Date Added (Oldest)', value: 'dateAsc'},
];

const MyCloset = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [closetItems, setClosetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState('dateDesc'); // Default sorting by newest
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation();

  const fetchClosetItems = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');
      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('items')
        .get();

      let items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt or timestamp (descending)
      items.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || a.timestamp?.toDate?.() || 0;
        const bDate = b.createdAt?.toDate?.() || b.timestamp?.toDate?.() || 0;
        return bDate - aDate;
      });

      setClosetItems(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load closet items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClosetItems();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClosetItems();
  };

  // Filter items based on selected category
  const filteredItems =
    selectedFilter === 'All'
      ? closetItems
      : closetItems.filter(item => item.category === selectedFilter);

  // Sort items based on selected option
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'nameAsc':
        return a.name?.localeCompare(b.name) || 0;
      case 'nameDesc':
        return b.name?.localeCompare(a.name) || 0;
      case 'priceAsc':
        return (a.price || 0) - (b.price || 0);
      case 'priceDesc':
        return (b.price || 0) - (a.price || 0);
      case 'dateAsc':
        return (
          (a.timestamp?.toDate() || new Date()) -
          (b.timestamp?.toDate() || new Date())
        );
      case 'dateDesc':
        return (
          (b.timestamp?.toDate() || new Date()) -
          (a.timestamp?.toDate() || new Date())
        );
      default:
        return 0;
    }
  });

  const addItem = () => {
    navigation.navigate('Add');
  };

  const handleItemPress = item => {
    if (isSelectionMode) {
      toggleItemSelection(item);
    } else {
      navigation.navigate('ItemDetails', {item});
    }
  };

  const toggleItemSelection = item => {
    if (selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter(selected => selected.id !== item.id),
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleLongPress = item => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedItems([item]);
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Items',
      `Are you sure you want to delete ${selectedItems.length} item${
        selectedItems.length > 1 ? 's' : ''
      }?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (!user) throw new Error('No authenticated user');
              await Promise.all(
                selectedItems.map(item =>
                  firestore()
                    .collection('users')
                    .doc(user.uid)
                    .collection('items')
                    .doc(item.id)
                    .delete(),
                ),
              );

              // Refresh the list
              fetchClosetItems();
              setIsSelectionMode(false);
              setSelectedItems([]);
              Alert.alert('Success', 'Items deleted successfully');
            } catch (error) {
              console.error('Error deleting items:', error);
              Alert.alert('Error', 'Failed to delete items');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItems.some(selected => selected.id === item.id) &&
          styles.selectedItemContainer,
      ]}
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}>
      {item.imageUrl ? (
        <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
      ) : item.imageBase64 ? (
        <Image
          source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
          style={styles.itemImage}
        />
      ) : item.selectedImage ? (
        <Image source={{uri: item.selectedImage}} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Ionicons name="image" size={40} color="#ccc" />
        </View>
      )}
      {selectedItems.some(selected => selected.id === item.id) && (
        <View style={styles.selectionOverlay}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#000" />
          </View>
        </View>
      )}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name || 'Unnamed Item'}
        </Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.color && (
          <Text style={styles.itemAttribute}>
            Color: {item.color.name || item.color}
          </Text>
        )}
        {item.brand && (
          <Text style={styles.itemAttribute}>Brand: {item.brand}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSortOption = ({item}) => (
    <Pressable
      style={styles.sortOption}
      onPress={() => {
        setSortOption(item.value);
        setIsSortVisible(false);
      }}>
      <Text style={styles.sortOptionText}>{item.label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isSelectionMode ? (
          <View style={styles.selectionHeader}>
            <View style={styles.selectionLeft}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedItems([]);
                }}>
                <View style={styles.iconButton}>
                  <Ionicons name="close" size={22} color="#000" />
                </View>
              </TouchableOpacity>
              <View style={styles.selectionInfo}>
                <Text style={styles.selectionCount}>
                  {selectedItems.length}
                </Text>
                <Text style={styles.selectionText}>selected</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.headerButton, styles.deleteButton]}
              onPress={handleDeleteSelected}>
              <View style={[styles.iconButton, styles.deleteButtonInner]}>
                <Ionicons name="trash-outline" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.topButtons}>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setIsFilterVisible(true)}>
              <Ionicons
                name="filter"
                size={18}
                color="#000"
                style={{marginRight: 6}}
              />
              <Text style={{fontWeight: 'bold'}}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setIsSortVisible(true)}>
              <Ionicons
                name="swap-vertical"
                size={18}
                color="#000"
                style={{marginRight: 6}}
              />
              <Text style={{fontWeight: 'bold'}}>Sort</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setMenuVisible(true)}>
              <Ionicons
                name="ellipsis-vertical"
                size={18}
                color="#000"
                style={{marginRight: 6}}
              />
              <Text style={{fontWeight: 'bold'}}>More</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filter Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}>
        {FILTERS.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name={FILTER_ICONS[filter]}
                size={16}
                color={selectedFilter === filter ? '#fff' : '#000'}
                style={{marginRight: 6}}
              />
              <Text
                style={{
                  color: selectedFilter === filter ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}>
                {filter}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={sortedItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.itemsGrid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubText}>
                {selectedFilter === 'All'
                  ? 'Add your first item to your closet'
                  : `No ${selectedFilter.toLowerCase()} in your closet`}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingBtn} onPress={addItem}>
        <Text style={styles.floatingText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={isFilterVisible}
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsFilterVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filter</Text>
            <FlatList
              data={FILTERS}
              renderItem={({item}) => (
                <Pressable
                  style={styles.modalFilterOption}
                  onPress={() => {
                    setSelectedFilter(item);
                    setIsFilterVisible(false);
                  }}>
                  <Ionicons
                    name={FILTER_ICONS[item]}
                    size={20}
                    color={selectedFilter === item ? '#000' : '#666'}
                  />
                  <Text
                    style={[
                      styles.modalFilterText,
                      selectedFilter === item && styles.modalFilterActive,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              )}
              keyExtractor={item => item}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Sort Modal */}
      <Modal
        transparent={true}
        visible={isSortVisible}
        animationType="slide"
        onRequestClose={() => setIsSortVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsSortVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sort Option</Text>
            <FlatList
              data={SORT_OPTIONS}
              renderItem={renderSortOption}
              keyExtractor={item => item.value}
            />
          </View>
        </Pressable>
      </Modal>

      {/* More Options Modal */}
      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                setIsSelectionMode(true);
              }}>
              <Ionicons name="checkbox-outline" size={24} color="#000" />
              <Text style={styles.menuText}>Select Multiple</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  filterBtn: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 12,
    height: 35,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 5,
  },
  floatingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 10,
  },
  itemsGrid: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    maxWidth: '46%', // Approximately half width minus margins
  },
  itemImage: {
    width: '200',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    padding: 10,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  itemCategory: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  itemAttribute: {
    color: '#888',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalFilterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalFilterText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  modalFilterActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#000',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteButtonInner: {
    backgroundColor: '#FF3B30',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  selectionCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#000',
  },
  selectionText: {
    fontSize: 17,
    color: '#666',
  },
  menuContent: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default MyCloset;
