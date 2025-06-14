import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LookbookDetails = ({route}) => {
  const {lookbook} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleOutfitPress = async outfit => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');

      // Fetch the complete outfit data
      const outfitDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('outfits')
        .doc(outfit.id)
        .get();

      if (!outfitDoc.exists) {
        Alert.alert('Error', 'Outfit not found');
        return;
      }

      // Navigate with complete outfit data
      navigation.navigate('OutfitDetails', {
        outfit: {
          id: outfitDoc.id,
          ...outfitDoc.data(),
        },
      });
    } catch (error) {
      console.error('Error fetching outfit details:', error);
      Alert.alert('Error', 'Failed to load outfit details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFD66B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{lookbook.name}</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {lookbook.description && (
            <Text style={styles.description}>{lookbook.description}</Text>
          )}

          {lookbook.theme && (
            <View style={styles.themeContainer}>
              <Text style={styles.themeLabel}>Theme:</Text>
              <View style={styles.themeTag}>
                <Text style={styles.themeText}>{lookbook.theme}</Text>
              </View>
            </View>
          )}

          <View style={styles.outfitsContainer}>
            <Text style={styles.sectionTitle}>
              Outfits ({lookbook.outfits?.length || 0})
            </Text>
            {lookbook.outfits?.map(outfit => (
              <TouchableOpacity
                key={outfit.id}
                style={styles.outfitCard}
                onPress={() => handleOutfitPress(outfit)}>
                <View style={styles.outfitInfo}>
                  <Text style={styles.outfitName} numberOfLines={1}>
                    {outfit.name || 'Unnamed Outfit'}
                  </Text>
                  <Text style={styles.itemCount}>
                    {outfit.items?.length || 0}{' '}
                    {(outfit.items?.length || 0) === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color="#ccc"
                  style={styles.chevron}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eee',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#eee',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  themeLabel: {
    fontSize: 16,
    color: '#eee',
    marginRight: 8,
  },
  themeTag: {
    backgroundColor: '#2D333B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  themeText: {
    fontSize: 14,
    color: '#eee',
  },
  outfitsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#eee',
  },
  outfitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3B4048',
  },
  outfitInfo: {
    flex: 1,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222831',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
});

export default LookbookDetails;
