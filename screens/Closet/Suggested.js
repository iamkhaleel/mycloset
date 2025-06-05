import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  checkPremiumStatus,
  PREMIUM_FEATURES,
} from '../../utils/PremiumFeatures';
import PremiumModal from '../../components/PremiumModal';
// Filter labels and their icons
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

const Suggested = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    checkUserPremiumStatus();
  }, []);

  const checkUserPremiumStatus = async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
    if (!premium) {
      setShowPremiumModal(true);
    }
  };

  if (!isPremium) {
    return (
      <View style={styles.premiumContainer}>
        <View style={styles.premiumContent}>
          <Ionicons name="star" size={60} color="#000" />
          <Text style={styles.premiumTitle}>Premium Feature</Text>
          <Text style={styles.premiumDescription}>
            Get personalized outfit suggestions based on your style, weather,
            and occasions.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('SubscriptionIntro')}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>

        <PremiumModal
          visible={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onUpgrade={() => {
            setShowPremiumModal(false);
            navigation.navigate('SubscriptionIntro');
          }}
          featureName="Smart Outfit Suggestions"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter + Sort Buttons */}
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
        <Text>Your Suggested Items for: {selectedFilter}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 20,
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

  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  premiumContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Suggested;
