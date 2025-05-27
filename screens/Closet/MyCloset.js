import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AppNavigator from '../../navigation/AppNaviagtor';
import {useNavigation} from '@react-navigation/native';

// Filter names and their corresponding icons
const FILTERS = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Undergarments',
  'Bags',
  'Accessories',
];

const FILTER_ICONS = {
  All: 'apps',
  Tops: 'shirt',
  Bottoms: 'walk',
  Dresses: 'woman',
  Outerwear: 'cloudy-night',
  Shoes: 'footsteps',
  Undergarments: 'body',
  Bags: 'bag',
  Accessories: 'watch',
};

const MyCloset = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const navigation = useNavigation();

  const additem = () => {
    navigation.navigate('Add');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.topBtn}>
          <Ionicons
            name="filter"
            size={18}
            color="#000"
            style={{marginRight: 6}}
          />
          <Text style={{fontWeight: 'bold'}}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Ionicons
            name="swap-vertical"
            size={18}
            color="#000"
            style={{marginRight: 6}}
          />
          <Text style={{fontWeight: 'bold'}}>Sort</Text>
        </TouchableOpacity>
      </View>
      {/* Filter Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}>
        {FILTERS.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterBtn,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                name={FILTER_ICONS[filter]}
                size={16}
                color={selectedFilter === filter ? '#fff' : '#000'}
                style={{marginRight: 6}}
              />
              <Text
                style={{
                  color: selectedFilter === filter ? '#fff' : '#000',
                  fontWeight: 'bold',
                }}>
                {filter}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Placeholder */}
      <View style={styles.body}>
        <Text>Your Closet Items for: {selectedFilter}</Text>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingBtn} onPress={additem}>
        <Text style={styles.floatingText}>+ Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: '20',
  },
  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  filterBtn: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 12,
    height: 35,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#000',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  floatingText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 10,
  },
});

export default MyCloset;
