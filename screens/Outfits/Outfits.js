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
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {getUserDocs, deleteUserDoc} from '../../utils/FirestoreService';
import OutfitCard from '../../components/OutfitCard';
import {
  checkPremiumStatus,
  FREE_TIER_LIMITS,
} from '../../utils/PremiumFeatures';
import PremiumModal from '../../components/PremiumModal';

const Outfits = () => {
  const navigation = useNavigation();
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const fetchOutfits = async () => {
    try {
      const {docs} = await getUserDocs('outfits');
      setOutfits(docs);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkUserPremiumStatus();
    fetchOutfits();
  }, []);

  const checkUserPremiumStatus = async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOutfits();
  };

  const handleAddOutfit = () => {
    if (!isPremium && outfits.length >= FREE_TIER_LIMITS.MAX_OUTFITS) {
      setShowPremiumModal(true);
    } else {
      navigation.navigate('AddOutfit');
    }
  };

  const handleOutfitPress = outfit => {
    if (isSelectionMode) {
      toggleOutfitSelection(outfit);
    } else {
      navigation.navigate('OutfitDetails', {outfit});
    }
  };

  const toggleOutfitSelection = outfit => {
    if (selectedOutfits.find(selected => selected.id === outfit.id)) {
      setSelectedOutfits(selectedOutfits.filter(item => item.id !== outfit.id));
    } else {
      setSelectedOutfits([...selectedOutfits, outfit]);
    }
  };

  const handleLongPress = outfit => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedOutfits([outfit]);
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Delete Outfits',
      `Are you sure you want to delete ${selectedOutfits.length} outfit${
        selectedOutfits.length > 1 ? 's' : ''
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
                selectedOutfits.map(outfit =>
                  deleteUserDoc('outfits', outfit.id),
                ),
              );

              // Refresh the list
              fetchOutfits();
              setIsSelectionMode(false);
              setSelectedOutfits([]);
              Alert.alert('Success', 'Outfits deleted successfully');
            } catch (error) {
              console.error('Error deleting outfits:', error);
              Alert.alert('Error', 'Failed to delete outfits');
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
          <View style={styles.selectionHeader}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedOutfits([]);
              }}>
              <View style={styles.iconButton}>
                <Ionicons name="close" size={22} color="#000" />
              </View>
            </TouchableOpacity>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionCount}>
                {selectedOutfits.length}
              </Text>
              <Text style={styles.selectionText}>selected</Text>
            </View>
            <TouchableOpacity
              style={[styles.headerButton, styles.deleteButton]}
              onPress={handleDeleteSelected}>
              <View style={styles.iconButton}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Outfits</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {!isPremium && outfits.length > 0 && (
        <View style={styles.limitContainer}>
          <Text style={styles.limitText}>
            {outfits.length}/{FREE_TIER_LIMITS.MAX_OUTFITS} Outfits Used
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SubscriptionIntro')}
            style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade for Unlimited</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {outfits.length > 0 ? (
          outfits.map(outfit => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onPress={() => handleOutfitPress(outfit)}
              onLongPress={() => handleLongPress(outfit)}
              isSelected={selectedOutfits.some(
                selected => selected.id === outfit.id,
              )}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No outfits yet</Text>
            <Text style={styles.emptySubText}>
              Create your first outfit by combining items from your closet
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.floatingBtn} onPress={handleAddOutfit}>
        <Text style={styles.floatingText}>+ Add Outfit</Text>
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

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={() => {
          setShowPremiumModal(false);
          navigation.navigate('SubscriptionIntro');
        }}
        featureName="Unlimited Outfits"
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
  selectionHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerButton: {
    padding: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  selectionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectionText: {
    fontSize: 16,
    color: '#666',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#f8f8f8',
    margin: 16,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default Outfits;
