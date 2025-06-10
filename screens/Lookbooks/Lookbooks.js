import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getUserDocs, deleteUserDoc} from '../../utils/FirestoreService';
import LookbookCard from '../../components/LookbookCard';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  checkPremiumStatus,
  FREE_TIER_LIMITS,
} from '../../utils/PremiumFeatures';
import PremiumModal from '../../components/PremiumModal';

const Lookbooks = () => {
  const navigation = useNavigation();
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedLookbooks, setSelectedLookbooks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const fetchLookbooks = async () => {
    try {
      const {docs} = await getUserDocs('lookbooks');
      setLookbooks(docs);
    } catch (error) {
      console.error('Error fetching lookbooks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkUserPremiumStatus();
    fetchLookbooks();
  }, []);

  const checkUserPremiumStatus = async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLookbooks();
  };

  const handleAddLookbook = () => {
    if (!isPremium && lookbooks.length >= FREE_TIER_LIMITS.MAX_LOOKBOOKS) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('AddLookbook');
    }
  };

  const handleLookbookPress = lookbook => {
    if (isSelectionMode) {
      toggleLookbookSelection(lookbook);
    } else {
      // TODO: Navigate to lookbook details screen
      console.log('Lookbook pressed:', lookbook);
    }
  };

  const toggleLookbookSelection = lookbook => {
    if (selectedLookbooks.find(selected => selected.id === lookbook.id)) {
      setSelectedLookbooks(
        selectedLookbooks.filter(item => item.id !== lookbook.id),
      );
    } else {
      setSelectedLookbooks([...selectedLookbooks, lookbook]);
    }
  };

  const handleLongPress = lookbook => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedLookbooks([lookbook]);
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Lookbooks',
      `Are you sure you want to delete ${selectedLookbooks.length} lookbook${
        selectedLookbooks.length > 1 ? 's' : ''
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
              await Promise.all(
                selectedLookbooks.map(lookbook =>
                  deleteUserDoc('lookbooks', lookbook.id),
                ),
              );

              // Refresh the list
              fetchLookbooks();
              setIsSelectionMode(false);
              setSelectedLookbooks([]);
              Alert.alert('Success', 'Lookbooks deleted successfully');
            } catch (error) {
              console.error('Error deleting lookbooks:', error);
              Alert.alert('Error', 'Failed to delete lookbooks');
            }
          },
        },
      ],
    );
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
        {isSelectionMode ? (
          <>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedLookbooks([]);
              }}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {selectedLookbooks.length} selected
            </Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleDeleteSelected}>
              <Ionicons name="trash-outline" size={24} color="#000" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.headerTitle}>Lookbooks</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {lookbooks.length > 0 ? (
          lookbooks.map(lookbook => (
            <LookbookCard
              key={lookbook.id}
              lookbook={lookbook}
              onPress={() => handleLookbookPress(lookbook)}
              onLongPress={() => handleLongPress(lookbook)}
              isSelected={selectedLookbooks.some(
                selected => selected.id === lookbook.id,
              )}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lookbooks yet</Text>
            <Text style={styles.emptySubText}>
              Create your first lookbook by combining your favorite outfits
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingBtn} onPress={handleAddLookbook}>
        <Text style={styles.floatingText}>+ Add Lookbook</Text>
      </TouchableOpacity>

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

      {!isPremium && lookbooks.length > 0 && (
        <View style={styles.limitContainer}>
          <Text style={styles.limitText}>
            {lookbooks.length}/{FREE_TIER_LIMITS.MAX_LOOKBOOKS} Lookbooks Used
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SubscriptionIntro')}
            style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade for Unlimited</Text>
          </TouchableOpacity>
        </View>
      )}

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          navigation.navigate('SubscriptionIntro');
        }}
        featureName="Unlimited Lookbooks"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  limitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  limitText: {
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
});

export default Lookbooks;
