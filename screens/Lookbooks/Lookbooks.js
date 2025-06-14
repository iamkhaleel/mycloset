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
      navigation.navigate('LookbookDetails', {lookbook});
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
                  setSelectedLookbooks([]);
                }}>
                <Ionicons name="close" size={24} color="#FFD66B" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedLookbooks.length} selected
              </Text>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleDeleteSelected}>
                <Ionicons name="trash-outline" size={24} color="#FFD66B" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.headerTitle}>Lookbooks</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setMenuVisible(true)}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color="#FFD66B"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {!isPremium && lookbooks.length > 0 && (
          <View style={styles.limitBanner}>
            <View style={styles.limitInfo}>
              <Text style={styles.limitTitle}>Free Plan</Text>
              <Text style={styles.limitText}>
                {lookbooks.length}/{FREE_TIER_LIMITS.MAX_LOOKBOOKS} Lookbooks
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (lookbooks.length / FREE_TIER_LIMITS.MAX_LOOKBOOKS) *
                        100
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
              <Ionicons name="book-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No lookbooks yet</Text>
              <Text style={styles.emptySubText}>
                Create your first lookbook by combining your favorite outfits
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleAddLookbook}>
                <Text style={styles.createButtonText}>Create Lookbook</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {lookbooks.length > 0 && (
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={handleAddLookbook}>
            <Text style={styles.floatingText}>+ Add Lookbook</Text>
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
                <Ionicons name="checkbox-outline" size={24} color="#FFD66B" />
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
          featureName="Unlimited Lookbooks"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    alignSelf: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#eee',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  themeLabel: {
    fontSize: 16,
    color: '#eee',
    marginRight: 8,
  },
  themeTag: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  themeText: {
    fontSize: 14,
    color: '#222831',
  },
  outfitsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#eee',
  },
  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3B4048',
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222831',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
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
    color: '#222831',
    marginBottom: 4,
  },
  limitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222831',
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
    backgroundColor: '#FFD66B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  upgradeButtonText: {
    color: '#222831',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: '40%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#eee',
  },
  emptySubText: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: '#222831',
    fontWeight: '600',
    fontSize: 16,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    backgroundColor: '#FFD66B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 5,
  },
  floatingText: {
    color: '#222831',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 40, 49, 0.9)',
  },
  menuContent: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#2D333B',
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
    color: '#eee',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
});

export default Lookbooks;
