import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Share,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert} from '../../contexts/AlertContext';
import {LottieLoader} from '../../components/LottieLoader';

const {width, height} = Dimensions.get('window');

const ItemDetails = ({route}) => {
  const navigation = useNavigation();
  const [item, setItem] = useState(route.params.item);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchItem = async () => {
        try {
          const user = auth().currentUser;
          if (!user || !route.params?.item?.id) {
            return;
          }
          const doc = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('items')
            .doc(route.params.item.id)
            .get();
          if (doc.exists) {
            setItem({id: doc.id, ...doc.data()});
          }
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };

      fetchItem();
    }, [route.params?.item?.id]),
  );

  const formatDate = timestamp => {
    if (!timestamp) {
      return 'N/A';
    }
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getColorName = color => {
    if (!color) {
      return '';
    }
    return color.name || color;
  };

  const handleShare = async () => {
    try {
      const lines = [
        item.name || 'Closet Item',
        item.category ? `Category: ${item.category}` : null,
        item.brand ? `Brand: ${item.brand}` : null,
        getColorName(item.color) ? `Color: ${getColorName(item.color)}` : null,
        item.size ? `Size: ${item.size}` : null,
        item.material ? `Material: ${item.material}` : null,
        item.price ? `Price: $${item.price}` : null,
      ].filter(Boolean);

      const shareContent = {
        message: lines.join('\n'),
        title: item.name || 'MyCloset Item',
      };

      if (item.imageUrl) {
        shareContent.url = item.imageUrl;
      }

      await Share.share(shareContent);
    } catch (error) {
      console.error('Error sharing item:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      setFavoriteLoading(true);
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      const newFavoriteValue = !item.isFavorite;
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('items')
        .doc(item.id)
        .update({isFavorite: newFavoriteValue});

      setItem(prev => ({...prev, isFavorite: newFavoriteValue}));
    } catch (error) {
      console.error('Error updating favorite:', error);
      Alert.alert('Error', 'Failed to update favorite');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('Add', {item, mode: 'edit'});
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name || 'this item'}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleteLoading(true);
              const user = auth().currentUser;
              if (!user) {
                throw new Error('No authenticated user');
              }

              await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('items')
                .doc(item.id)
                .delete();

              navigation.goBack();
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            } finally {
              setDeleteLoading(false);
            }
          },
        },
      ],
    );
  };

  const itemNote = item.note || item.notes;

  const InfoCard = ({icon, label, value, iconColor = '#FFD66B'}) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <View style={styles.backButtonContainer}>
              <Ionicons name="arrow-back" size={24} color="#222831" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#FFD66B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleToggleFavorite}
              disabled={favoriteLoading}>
              {favoriteLoading ? (
                <LottieLoader size={28} />
              ) : (
                <Ionicons
                  name={item.isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={item.isFavorite ? '#FF3B30' : '#FFD66B'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Item Image with Gradient Overlay */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
          ) : item.imageBase64 ? (
            <Image
              source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
              style={styles.itemImage}
            />
          ) : (
            <View style={[styles.itemImage, styles.placeholderImage]}>
              <Ionicons name="image" size={80} color="#FFD66B" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>

        {/* Item Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={14} color="#222831" />
            <Text style={styles.categoryText}>
              {item.category || 'Uncategorized'}
            </Text>
          </View>
          <Text style={styles.itemName}>{item.name || 'Unnamed Item'}</Text>
        </View>

        {/* Quick Info Grid */}
        <View style={styles.quickInfoGrid}>
          {item.price && (
            <View style={styles.quickInfoCard}>
              <Ionicons name="cash-outline" size={20} color="#FFD66B" />
              <Text style={styles.quickInfoValue}>${item.price}</Text>
              <Text style={styles.quickInfoLabel}>Price</Text>
            </View>
          )}
          {item.size && (
            <View style={styles.quickInfoCard}>
              <Ionicons name="resize-outline" size={20} color="#FFD66B" />
              <Text style={styles.quickInfoValue}>{item.size}</Text>
              <Text style={styles.quickInfoLabel}>Size</Text>
            </View>
          )}
          {item.timestamp && (
            <View style={styles.quickInfoCard}>
              <Ionicons name="calendar-outline" size={20} color="#FFD66B" />
              <Text style={styles.quickInfoValue} numberOfLines={1}>
                {formatDate(item.timestamp).split(' ')[0]}
              </Text>
              <Text style={styles.quickInfoLabel}>Added</Text>
            </View>
          )}
        </View>

        {/* Detailed Information Cards */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>

          {item.brand && (
            <InfoCard
              icon="storefront-outline"
              label="Brand"
              value={item.brand}
            />
          )}

          {item.color && (
            <InfoCard
              icon="color-palette-outline"
              label="Color"
              value={item.color.name || item.color}
            />
          )}

          {item.material && (
            <InfoCard
              icon="cube-outline"
              label="Material"
              value={item.material}
            />
          )}

          {item.timestamp && (
            <InfoCard
              icon="time-outline"
              label="Date Added"
              value={formatDate(item.timestamp)}
            />
          )}
        </View>

        {/* Notes Section */}
        {itemNote ? (
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#FFD66B"
              />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{itemNote}</Text>
            </View>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#222831" />
            <Text style={styles.primaryButtonText}>Edit Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDelete}
            disabled={deleteLoading}>
            {deleteLoading ? (
              <LottieLoader size={28} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                <Text style={styles.secondaryButtonText}>Delete</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222831',
  },
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    zIndex: 10,
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
  imageContainer: {
    width: width,
    height: height * 0.45,
    position: 'relative',
    marginBottom: 20,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#2D333B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFD66B',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFD66B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  categoryText: {
    color: '#222831',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 4,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: '#2D333B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#393E46',
  },
  quickInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
    marginTop: 8,
    marginBottom: 4,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD66B',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#2D333B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#393E46',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#393E46',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#eee',
    fontWeight: '600',
  },
  notesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  notesCard: {
    backgroundColor: '#2D333B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#393E46',
  },
  notesText: {
    fontSize: 15,
    color: '#eee',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFD66B',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#222831',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2D333B',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  secondaryButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ItemDetails;
