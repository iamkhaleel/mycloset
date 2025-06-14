import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Share,
  Platform,
  RefreshControl,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation, StackActions} from '@react-navigation/native';
import {checkPremiumStatus} from '../../utils/PremiumFeatures';
import {removeUser} from '../../utils/AuthStorage';

const Settings = () => {
  const navigation = useNavigation();
  const [counts, setCounts] = useState({
    outfits: 0,
    lookbooks: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchCounts();
    checkUserPremiumStatus();
  }, []);

  const fetchCounts = async () => {
    try {
      // Check if user is authenticated
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No authenticated user');
        return;
      }

      // Fetch counts from user subcollections
      const outfitsSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('outfits')
        .get();
      const lookbooksSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('lookbooks')
        .get();
      const itemsSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('items')
        .get();

      setCounts({
        outfits: outfitsSnapshot.size,
        lookbooks: lookbooksSnapshot.size,
        items: itemsSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Error',
          'You do not have permission to access this data. Please sign in again.',
        );
        handleLogout();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkUserPremiumStatus = async () => {
    const premium = await checkPremiumStatus();
    setIsPremium(premium);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
            await removeUser();
          } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const handleRateApp = () => {
    // Replace with your app's App Store/Play Store URL
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/your-app-id',
      android: 'https://play.google.com/store/apps/details?id=your.app.id',
    });
    Linking.openURL(storeUrl).catch(err => {
      console.error('Error opening store URL:', err);
      Alert.alert('Error', 'Could not open app store');
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Check out MyCloset app - The perfect way to organize your wardrobe!',
        // Add your app's store URL here
        url: 'https://your-app-store-url',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSupport = () => {
    if (isPremium) {
      // Priority support email for premium users
      Linking.openURL(
        'mailto:priority-support@mycloset.app?subject=Premium Support Request',
      ).catch(err => {
        console.error('Error opening mail:', err);
        Alert.alert('Error', 'Could not open email client');
      });
    } else {
      // Regular support for free users
      Linking.openURL('mailto:support@mycloset.app').catch(err => {
        console.error('Error opening mail:', err);
        Alert.alert('Error', 'Could not open email client');
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCounts();
    checkUserPremiumStatus();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.accountButton}>
            <Ionicons name="person-outline" size={28} color="##FFD66B" />
            <View style={styles.accountInfo}>
              <Text style={styles.accountEmail}>
                {user?.email || 'Not signed in'}
              </Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={14} color="##FFD66B" />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Pro Box - Only show for non-premium users */}
        {!isPremium && (
          <View style={styles.proBox}>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => navigation.navigate('SubscriptionIntro')}>
              <Text style={styles.joinButtonText}>UPGRADE</Text>
            </TouchableOpacity>
            <Text style={styles.proTitle}>MyCloset Premium</Text>
            <Text style={styles.proSubtitle}>
              Take your style to the next level
            </Text>
            <Text style={styles.proPrice}>Starting at $4.99/month</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.outfits}</Text>
            <Text style={styles.statLabel}>Outfits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.lookbooks}</Text>
            <Text style={styles.statLabel}>Lookbooks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{counts.items}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Options</Text>
          {[
            {
              icon: 'share-outline',
              label: 'Share App',
              onPress: handleShare,
              color: '#FFD66B',
            },
            {
              icon: 'information-circle-outline',
              label: 'About',
              onPress: () => {},
              color: '#FFD66B',
            },
            {
              icon: 'shield-checkmark-outline',
              label: 'Privacy Policy',
              onPress: () => Linking.openURL('https://mycloset.app/privacy'),
              color: '#FFD66B',
            },
            {
              icon: 'help-circle-outline',
              label: isPremium ? 'Priority Support' : 'Help & Support',
              onPress: handleSupport,
              badge: isPremium ? 'Premium' : null,
              color: '#FFD66B',
            },
            {
              icon: 'settings-outline',
              label: 'App Settings',
              onPress: () => {},
              color: '#FFD66B',
            },
            {
              icon: 'star-outline',
              label: 'Rate Us',
              onPress: handleRateApp,
              color: '#FFD66B',
            },
            {
              icon: 'log-out-outline',
              label: 'Logout',
              onPress: handleLogout,
              color: '#FF3B30',
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={item.onPress}>
              <View style={styles.optionLeft}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.color || '#444'}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    item.color && {color: item.color},
                  ]}>
                  {item.label}
                </Text>
                {item.badge && (
                  <View style={styles.optionBadge}>
                    <Text style={styles.optionBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFD66B" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#eee',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFD66B',
  },
  accountInfo: {
    flex: 1,
    marginLeft: 10,
  },
  accountEmail: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  proBox: {
    backgroundColor: '#FFD66B',
    width: '98%',
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 20,
    padding: 20,
  },
  joinButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginBottom: -30,
  },
  joinButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  proTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
  proSubtitle: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
    opacity: 0.8,
  },
  proPrice: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#FFD66B',
    marginVertical: 20,
    borderRadius: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2D333B',
    borderRadius: 12,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#eee',
  },
  version: {
    textAlign: 'center',
    color: '#eee',
    marginTop: 24,
    marginBottom: 32,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  optionBadge: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  optionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222831',
  },
});

export default Settings;
