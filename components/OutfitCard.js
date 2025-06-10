import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const OutfitCard = ({outfit, onPress, onLongPress, isSelected}) => {
  // Ensure items array exists
  const itemCount = outfit.items?.length || 0;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {outfit.name || 'Unnamed Outfit'}
        </Text>
        <Text style={styles.itemCount}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#000" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#000',
  },
  content: {
    padding: 16,
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{translateY: -12}],
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
  },
});

export default OutfitCard;
