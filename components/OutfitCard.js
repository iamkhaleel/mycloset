import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const OutfitCard = ({outfit, onPress, onLongPress, isSelected}) => {
  // Ensure items array exists and has valid items
  const validItems = outfit.items?.filter(item => item && item.imageUrl) || [];

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}>
      <View style={styles.imagesContainer}>
        {validItems.length > 0 ? (
          validItems.slice(0, 4).map((item, index) => (
            <View
              key={item.id || index}
              style={[
                styles.imageWrapper,
                index >= 2 && styles.bottomImage,
                index % 2 === 1 && styles.rightImage,
              ]}>
              <Image source={{uri: item.imageUrl}} style={styles.image} />
            </View>
          ))
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="images-outline" size={40} color="#ccc" />
          </View>
        )}
        {validItems.length > 4 && (
          <View style={styles.moreItemsBadge}>
            <Text style={styles.moreItemsText}>+{validItems.length - 4}</Text>
          </View>
        )}
        {isSelected && (
          <View style={styles.selectionOverlay}>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#000" />
            </View>
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {outfit.name || 'Unnamed Outfit'}
        </Text>
        <Text style={styles.itemCount}>
          {validItems.length} {validItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#000',
  },
  imagesContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  imageWrapper: {
    position: 'absolute',
    width: '50%',
    height: '50%',
  },
  rightImage: {
    right: 0,
  },
  bottomImage: {
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreItemsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  details: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default OutfitCard;
