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
          <Ionicons name="star" size={60} color="#FFD66B" />
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
            color="#222831"
            style={{marginRight: 6}}
          />
          <Text style={styles.topBtnText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Ionicons
            name="swap-vertical"
            size={18}
            color="#222831"
            style={{marginRight: 6}}
          />
          <Text style={styles.topBtnText}>Sort</Text>
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
                color={selectedFilter === filter ? '#222831' : '#eee'}
                style={{marginRight: 6}}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText,
                ]}>
                {filter}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Placeholder */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>
          Your Suggested Items for: {selectedFilter}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 20,
    backgroundColor: '#222831',
  },

  topButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD66B',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
  },

  topBtnText: {
    fontWeight: 'bold',
    color: '#222831',
  },

  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  filterBtn: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2D333B',
    borderRadius: 12,
    height: 35,
    justifyContent: 'center',
  },

  activeFilter: {
    backgroundColor: '#FFD66B',
  },

  filterText: {
    color: '#eee',
    fontWeight: 'bold',
  },

  activeFilterText: {
    color: '#222831',
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bodyText: {
    color: '#eee',
    fontSize: 16,
  },

  floatingBtn: {
    position: 'absolute',
    bottom: 40,
    right: 25,
    backgroundColor: '#FFD66B',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  floatingText: {
    color: '#222831',
    fontWeight: 'bold',
  },

  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222831',
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
    color: '#FFD66B',
  },
  premiumDescription: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
  },
  upgradeButtonText: {
    color: '#222831',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Suggested;
