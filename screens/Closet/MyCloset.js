import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {Alert} from '../../contexts/AlertContext';
import {LottieLoader} from '../../components/LottieLoader';

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
  const hasCompletedInitialFetchRef = useRef(false);
  const filterScrollRef = useRef(null);
  const filterViewportWidth = useRef(0);
  const filterContentWidth = useRef(0);
  const filterHintActiveRef = useRef(false);
  const filterHintTimeoutRef = useRef(null);

  const stopFilterScrollHint = useCallback(() => {
    filterHintActiveRef.current = false;
    if (filterHintTimeoutRef.current) {
      clearTimeout(filterHintTimeoutRef.current);
      filterHintTimeoutRef.current = null;
    }
  }, []);

  const startFilterScrollHint = useCallback(() => {
    stopFilterScrollHint();

    const isScrollable =
      filterContentWidth.current > filterViewportWidth.current + 8;
    if (!isScrollable) {
      return;
    }

    filterHintActiveRef.current = true;
    let direction = 1;
    let completedCycles = 0;
    const scrollOffset = 26;

    const pulse = () => {
      if (!filterHintActiveRef.current || completedCycles >= 3) {
        stopFilterScrollHint();
        return;
      }

      filterScrollRef.current?.scrollTo({
        x: direction > 0 ? scrollOffset : 0,
        animated: true,
      });

      direction *= -1;
      if (direction === 1) {
        completedCycles += 1;
      }

      filterHintTimeoutRef.current = setTimeout(pulse, 850);
    };

    filterHintTimeoutRef.current = setTimeout(pulse, 700);
  }, [stopFilterScrollHint]);

  useEffect(() => {
    return () => {
      stopFilterScrollHint();
    };
  }, [stopFilterScrollHint]);

  const fetchClosetItems = useCallback(async (options = {}) => {
    const {isPullRefresh = false, cancelledRef} = options;
    try {
      if (!hasCompletedInitialFetchRef.current && !isPullRefresh) {
        setLoading(true);
      }
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

      items.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || a.timestamp?.toDate?.() || 0;
        const bDate = b.createdAt?.toDate?.() || b.timestamp?.toDate?.() || 0;
        return bDate - aDate;
      });

      if (cancelledRef?.current) {
        return;
      }

      setClosetItems(items);
    } catch (error) {
      if (!cancelledRef?.current) {
        console.error('Error fetching items:', error);
        Alert.alert('Error', 'Failed to load closet items');
      }
    } finally {
      if (!cancelledRef?.current) {
        setLoading(false);
        setRefreshing(false);
        hasCompletedInitialFetchRef.current = true;
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const cancelledRef = {current: false};
      fetchClosetItems({cancelledRef});

      const hintTimer = setTimeout(() => {
        if (!cancelledRef.current) {
          startFilterScrollHint();
        }
      }, 600);

      return () => {
        cancelledRef.current = true;
        clearTimeout(hintTimer);
        stopFilterScrollHint();
      };
    }, [fetchClosetItems, startFilterScrollHint, stopFilterScrollHint]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchClosetItems({isPullRefresh: true});
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

  const renderItem = ({item}) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    const colorName =
      item.color?.name || (typeof item.color === 'string' ? item.color : null);
    const colorHex =
      typeof item.color === 'object' && item.color?.hex ? item.color.hex : null;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isSelected && styles.selectedItemContainer,
        ]}
        onPress={() => handleItemPress(item)}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500}
        activeOpacity={0.88}>
        <View style={styles.imageWrapper}>
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
              <Ionicons name="shirt-outline" size={36} color="#5c6370" />
            </View>
          )}

          <View style={styles.imageOverlay} />

          {item.category ? (
            <View style={styles.categoryBadge}>
              <Ionicons
                name={FILTER_ICONS[item.category] || 'pricetag'}
                size={11}
                color="#222831"
                style={styles.categoryBadgeIcon}
              />
              <Text style={styles.categoryBadgeText} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          ) : null}

          {item.isFavorite ? (
            <View style={styles.favoriteBadge}>
              <Ionicons name="heart" size={13} color="#FF3B30" />
            </View>
          ) : null}

          {isSelected ? (
            <View style={styles.selectionOverlay}>
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={28} color="#FFD66B" />
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name || 'Unnamed Item'}
          </Text>

          {(colorName || item.brand) && (
            <View style={styles.metaRow}>
              {colorName ? (
                <View style={styles.colorChip}>
                  {colorHex && colorHex.startsWith('#') ? (
                    <View
                      style={[styles.colorDot, {backgroundColor: colorHex}]}
                    />
                  ) : null}
                  <Text style={styles.metaText} numberOfLines={1}>
                    {colorName}
                  </Text>
                </View>
              ) : null}
              {item.brand ? (
                <Text style={styles.brandText} numberOfLines={1}>
                  {item.brand}
                </Text>
              ) : null}
            </View>
          )}

          {item.price != null && item.price !== '' ? (
            <Text style={styles.priceText}>${item.price}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

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
                  <Ionicons name="close" size={22} color="#FFD66B" />
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
        ref={filterScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsContent}
        style={styles.filterTabsScroll}
        onLayout={event => {
          filterViewportWidth.current = event.nativeEvent.layout.width;
        }}
        onContentSizeChange={width => {
          filterContentWidth.current = width;
        }}
        onScrollBeginDrag={stopFilterScrollHint}
        onTouchStart={stopFilterScrollHint}>
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
                color={selectedFilter === filter ? '#222831' : '#eee'}
                style={{marginRight: 6}}
              />
              <Text
                style={{
                  color: selectedFilter === filter ? '#222831' : '#eee',
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
          <LottieLoader size={72} />
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
    backgroundColor: '#222831',
  },
  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  filterTabsScroll: {
    flexGrow: 0,
    marginTop: 10,
    height: 50,
  },
  filterTabsContent: {
    flexGrow: 0,
    paddingStart: 10,
  },
  filterBtn: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2D333B',
    borderRadius: 12,
    height: 35,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#FFD66B',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFD66B',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 5,
  },
  floatingText: {
    color: '#222831',
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
    backgroundColor: '#FFD66B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  itemsGrid: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 100,
  },
  itemContainer: {
    flex: 1,
    margin: 6,
    backgroundColor: '#2D333B',
    borderRadius: 18,
    overflow: 'hidden',
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: '#393E46',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#1a1f26',
  },
  itemImage: {
    width: '100%',
    height: 168,
    resizeMode: 'cover',
    backgroundColor: '#1a1f26',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD66B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    maxWidth: '75%',
  },
  categoryBadgeIcon: {
    marginRight: 4,
  },
  categoryBadgeText: {
    color: '#222831',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  favoriteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(34, 40, 49, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  itemDetails: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  itemName: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#393E46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    maxWidth: '55%',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  metaText: {
    color: '#B0B8C1',
    fontSize: 11,
    fontWeight: '500',
  },
  brandText: {
    color: '#8d97a3',
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 1,
  },
  priceText: {
    color: '#FFD66B',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
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
    color: '#eee',
  },
  emptySubText: {
    fontSize: 14,
    color: '#eee',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2D333B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  modalFilterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  modalFilterText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#ccc',
  },
  modalFilterActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#ccc',
  },
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#FFD66B',
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    backgroundColor: 'rgba(34, 40, 49, 0.95)',
    borderRadius: 20,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFD66B',
  },
  header: {
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
    backgroundColor: '#2D333B',
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
    color: '#fff',
  },
  selectionText: {
    fontSize: 17,
    color: '#ccc',
  },
  menuContent: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#2D333B',
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
    color: '#fff',
  },
});

export default MyCloset;
