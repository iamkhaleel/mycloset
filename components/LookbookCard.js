import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const LookbookCard = ({lookbook, onPress, onLongPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}>
      <View style={styles.content}>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {lookbook.name}
          </Text>
          {lookbook.theme && (
            <View style={styles.themeContainer}>
              <Text style={styles.theme}>{lookbook.theme}</Text>
            </View>
          )}
          <Text style={styles.count}>
            {lookbook.outfits?.length || 0}{' '}
            {(lookbook.outfits?.length || 0) === 1 ? 'outfit' : 'outfits'}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          {isSelected ? (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#000" />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedContainer: {
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  themeContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  theme: {
    fontSize: 14,
    color: '#666',
  },
  count: {
    fontSize: 14,
    color: '#888',
  },
  iconContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  checkmarkContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
});

export default LookbookCard;
