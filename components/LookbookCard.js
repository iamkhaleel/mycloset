import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const LookbookCard = ({lookbook, onPress, onLongPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}>
      <View style={styles.imageContainer}>
        {lookbook.coverImage ? (
          <Image
            source={{uri: lookbook.coverImage}}
            style={styles.coverImage}
          />
        ) : lookbook.outfits && lookbook.outfits.length > 0 ? (
          // If no cover image, show a grid of outfit images
          <View style={styles.outfitsGrid}>
            {lookbook.outfits.slice(0, 4).map((outfit, index) => (
              <View
                key={`${outfit.id || index}`}
                style={[
                  styles.gridItem,
                  index % 2 === 1 && styles.rightItem,
                  index >= 2 && styles.bottomItem,
                ]}>
                {outfit.items && outfit.items[0]?.imageUrl ? (
                  <Image
                    source={{uri: outfit.items[0].imageUrl}}
                    style={styles.gridImage}
                  />
                ) : (
                  <View style={[styles.gridImage, styles.placeholderImage]}>
                    <Ionicons name="images-outline" size={20} color="#ccc" />
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={40} color="#ccc" />
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
          {lookbook.name}
        </Text>
        {lookbook.theme && (
          <Text style={styles.theme} numberOfLines={1}>
            {lookbook.theme}
          </Text>
        )}
        <Text style={styles.count}>
          {lookbook.outfits?.length || 0}{' '}
          {(lookbook.outfits?.length || 0) === 1 ? 'outfit' : 'outfits'}
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
  imageContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  outfitsGrid: {
    flex: 1,
    position: 'relative',
  },
  gridItem: {
    position: 'absolute',
    width: '50%',
    height: '50%',
  },
  rightItem: {
    right: 0,
  },
  bottomItem: {
    bottom: 0,
  },
  gridImage: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  theme: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: '#888',
  },
});

export default LookbookCard;
