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
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation, StackActions} from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();
  const [counts, setCounts] = useState({
    outfits: 0,
    lookbooks: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      // Check if user is authenticated
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No authenticated user');
        return;
      }

      const outfitsSnapshot = await firestore().collection('outfits').get();
      const lookbooksSnapshot = await firestore().collection('lookbooks').get();
      const itemsSnapshot = await firestore().collection('items').get();
      const closetItemsSnapshot = await firestore()
        .collection('closetItems')
        .get();

      setCounts({
        outfits: outfitsSnapshot.size,
        lookbooks: lookbooksSnapshot.size,
        items: itemsSnapshot.size + closetItemsSnapshot.size,
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
    }
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
            // Navigate to Onboarding stack which contains Welcome screen
            navigation.reset({
              index: 0,
              routes: [{name: 'Onboarding'}],
            });
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
    Linking.openURL('mailto:support@mycloset.app').catch(err => {
      console.error('Error opening mail:', err);
      Alert.alert('Error', 'Could not open email client');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.accountButton}>
          <Ionicons name="person-outline" size={28} color="#333" />
          <Text style={styles.accountEmail}>
            {user?.email || 'Not signed in'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pro Box */}
      <View style={styles.proBox}>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>JOIN</Text>
        </TouchableOpacity>
        <Text style={styles.proTitle}>MyCloset Pro</Text>
        <Text style={styles.proSubtitle}>Unlock the full experience</Text>
        <Text style={styles.proPrice}>$4.99/month</Text>
      </View>

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
          },
          {
            icon: 'information-circle-outline',
            label: 'About',
            onPress: () => {},
          },
          {
            icon: 'shield-checkmark-outline',
            label: 'Privacy Policy',
            onPress: () => Linking.openURL('https://mycloset.app/privacy'),
          },
          {
            icon: 'help-circle-outline',
            label: 'Help & Support',
            onPress: handleSupport,
          },
          {
            icon: 'settings-outline',
            label: 'App Settings',
            onPress: () => {},
          },
          {
            icon: 'star-outline',
            label: 'Rate Us',
            onPress: handleRateApp,
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
                style={[styles.optionLabel, item.color && {color: item.color}]}>
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    margin: 20,
    marginTop: 25,
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  accountEmail: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  proBox: {
    backgroundColor: '#000',
    width: '90%',
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
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 10,
  },
  proSubtitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
    opacity: 0.8,
  },
  proPrice: {
    color: '#fff',
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
    backgroundColor: '#f9f9f9',
    marginVertical: 20,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});

export default Settings;
