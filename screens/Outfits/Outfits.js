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
  SafeAreaView,
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
      Alert.alert('Error', 'Failed to load outfits');
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {isSelectionMode ? (
            <>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedOutfits([]);
                }}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedOutfits.length} selected
              </Text>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDeleteSelected}>
                <Ionicons name="trash-outline" size={24} color="#000" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.headerTitle}>Outfits</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setMenuVisible(true)}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {!isPremium && outfits.length > 0 && (
          <View style={styles.limitBanner}>
            <View style={styles.limitInfo}>
              <Text style={styles.limitTitle}>Free Plan</Text>
              <Text style={styles.limitText}>
                {outfits.length}/{FREE_TIER_LIMITS.MAX_OUTFITS} Outfits
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (outfits.length / FREE_TIER_LIMITS.MAX_OUTFITS) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('SubscriptionIntro')}
              style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
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
              <Ionicons name="shirt-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No outfits yet</Text>
              <Text style={styles.emptySubText}>
                Create your first outfit by combining items from your closet
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleAddOutfit}>
                <Text style={styles.createButtonText}>Create Outfit</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {outfits.length > 0 && (
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={handleAddOutfit}>
            <Text style={styles.floatingText}>+ Add Outfit</Text>
          </TouchableOpacity>
        )}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 16,
  },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },

  limitInfo: {
    flex: 1,
  },
  limitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  limitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: '40%',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Outfits;
