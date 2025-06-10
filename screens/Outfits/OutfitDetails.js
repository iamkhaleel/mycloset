import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const OutfitDetails = ({route}) => {
  const {outfit} = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOutfitItems();
  }, []);

  const fetchOutfitItems = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');

      // Fetch all items in parallel
      const itemPromises = outfit.items.map(itemId =>
        firestore()
          .collection('users')
          .doc(user.uid)
          .collection('items')
          .doc(itemId)
          .get(),
      );

      const itemDocs = await Promise.all(itemPromises);
      const loadedItems = itemDocs
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

      setItems(loadedItems);
    } catch (error) {
      console.error('Error fetching outfit items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = item => {
    navigation.navigate('ItemDetails', {item});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {outfit.name || 'Unnamed Outfit'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {outfit.description && (
          <Text style={styles.description}>{outfit.description}</Text>
        )}

        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Items ({items.length})</Text>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => handleItemPress(item)}>
              {item.imageUrl ? (
                <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
              ) : item.imageBase64 ? (
                <Image
                  source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
                  style={styles.itemImage}
                />
              ) : item.selectedImage ? (
                <Image
                  source={{uri: item.selectedImage}}
                  style={styles.itemImage}
                />
              ) : (
                <View style={[styles.itemImage, styles.placeholderImage]}>
                  <Ionicons name="image" size={40} color="#ccc" />
                </View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name || 'Unnamed Item'}
                </Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#666',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  chevron: {
    marginLeft: 8,
  },
});

export default OutfitDetails;
