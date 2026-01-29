import React, {useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width} = Dimensions.get('window');

const LookbookDetails = ({route}) => {
  const {lookbook} = route.params || {};
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Set navigation options immediately to prevent white flash
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleOutfitPress = async outfit => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');

      // Fetch the complete outfit data
      const outfitDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('outfits')
        .doc(outfit.id)
        .get();

      if (!outfitDoc.exists) {
        Alert.alert('Error', 'Outfit not found');
        return;
      }

      // Navigate with complete outfit data
      navigation.navigate('OutfitDetails', {
        outfit: {
          id: outfitDoc.id,
          ...outfitDoc.data(),
        },
      });
    } catch (error) {
      console.error('Error fetching outfit details:', error);
      Alert.alert('Error', 'Failed to load outfit details');
    } finally {
      setLoading(false);
    }
  };

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
                {lookbook?.name || 'Unnamed Lookbook'}
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
              <ActivityIndicator size="large" color="#FFD66B" />
              <Text style={styles.loadingText}>Loading outfit...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={true}>
              {/* Description Section */}
              {lookbook?.description && (
                <View style={styles.descriptionContainer}>
                  <View style={styles.descriptionHeader}>
                    <Ionicons name="document-text-outline" size={20} color="#FFD66B" />
                    <Text style={styles.descriptionLabel}>Description</Text>
                  </View>
                  <View style={styles.descriptionCard}>
                    <Text style={styles.description}>{lookbook.description}</Text>
                  </View>
                </View>
              )}

              {/* Theme Section */}
              {lookbook?.theme && (
                <View style={styles.themeContainer}>
                  <View style={styles.themeHeader}>
                    <Ionicons name="color-palette-outline" size={20} color="#FFD66B" />
                    <Text style={styles.themeLabel}>Theme</Text>
                  </View>
                  <View style={styles.themeTag}>
                    <Text style={styles.themeText}>{lookbook.theme}</Text>
                  </View>
                </View>
              )}

              {/* Outfits Section */}
              <View style={styles.outfitsContainer}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <Ionicons name="shirt-outline" size={22} color="#FFD66B" />
                    <Text style={styles.sectionTitle}>
                      Outfits ({lookbook?.outfits?.length || 0})
                    </Text>
                  </View>
                </View>

                {!lookbook?.outfits || lookbook.outfits.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="shirt-outline" size={60} color="#393E46" />
                    <Text style={styles.emptyText}>No outfits in this lookbook</Text>
                  </View>
                ) : (
                  lookbook.outfits.map(outfit => (
                    <TouchableOpacity
                      key={outfit.id}
                      style={styles.outfitCard}
                      onPress={() => handleOutfitPress(outfit)}
                      activeOpacity={0.7}>
                      <View style={styles.outfitIconContainer}>
                        <Ionicons name="shirt" size={24} color="#FFD66B" />
                      </View>
                      <View style={styles.outfitInfo}>
                        <Text style={styles.outfitName} numberOfLines={1}>
                          {outfit.name || 'Unnamed Outfit'}
                        </Text>
                        <View style={styles.outfitMeta}>
                          <View style={styles.itemCountBadge}>
                            <Ionicons name="cube-outline" size={12} color="#FFD66B" />
                            <Text style={styles.itemCount}>
                              {outfit.items?.length || 0}{' '}
                              {(outfit.items?.length || 0) === 1 ? 'item' : 'items'}
                            </Text>
                          </View>
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
  themeContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  themeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD66B',
  },
  themeTag: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  themeText: {
    fontSize: 14,
    color: '#222831',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  outfitsContainer: {
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
  outfitCard: {
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
  outfitIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#393E46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#eee',
  },
  outfitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#393E46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#FFD66B',
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: 8,
    padding: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default LookbookDetails;
