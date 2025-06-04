import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const AddOutfit = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [closetItems, setClosetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClosetItems();
  }, []);

  const fetchClosetItems = async () => {
    try {
      const querySnapshot = await firestore().collection('items').get();
      const items = await Promise.all(
        querySnapshot.docs.map(async doc => {
          const data = doc.data();
          let imageUrl = null;

          if (data.imageBase64) {
            imageUrl = `data:image/jpeg;base64,${data.imageBase64}`;
          } else if (data.imagePath) {
            try {
              imageUrl = await storage().ref(data.imagePath).getDownloadURL();
            } catch (error) {
              console.error('Error fetching image URL:', error);
            }
          }

          return {
            id: doc.id,
            ...data,
            imageUrl,
          };
        }),
      );
      setClosetItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load closet items');
      setLoading(false);
    }
  };

  const toggleItemSelection = item => {
    if (selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems(
        selectedItems.filter(selected => selected.id !== item.id),
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSave = async () => {
    if (selectedItems.length < 2) {
      Alert.alert('Error', 'Please select at least 2 items for the outfit');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the outfit');
      return;
    }

    try {
      setSaving(true);

      // Clean and validate items data before saving
      const cleanedItems = selectedItems.map(item => ({
        id: item.id || '',
        name: item.name || 'Unnamed Item',
        category: item.category || 'Uncategorized',
        imageUrl: item.imageUrl || null,
      }));

      await firestore()
        .collection('outfits')
        .add({
          name: name.trim() || '',
          description: description.trim() || '',
          items: cleanedItems,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      navigation.goBack();
    } catch (error) {
      console.error('Error saving outfit:', error);
      Alert.alert('Error', 'Failed to save outfit');
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItems.find(selected => selected.id === item.id) &&
          styles.selectedItem,
      ]}
      onPress={() => toggleItemSelection(item)}>
      {item.imageUrl ? (
        <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
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
      {selectedItems.find(selected => selected.id === item.id) && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color="#000" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Outfit</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.savingButton]}
          onPress={handleSave}
          disabled={saving}>
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Outfit Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descriptionInput]}
            multiline
          />
        </View>

        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>
            Selected Items ({selectedItems.length})
          </Text>
          {selectedItems.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedItems.map(item => (
                <View key={item.id} style={styles.selectedItemPreview}>
                  <Image
                    source={{uri: item.imageUrl}}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => toggleItemSelection(item)}>
                    <Ionicons name="close-circle" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Select at least 2 items</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Closet Items</Text>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <FlatList
            data={closetItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  savingButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectedSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  selectedItemPreview: {
    marginRight: 12,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    maxWidth: '46%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedItem: {
    borderColor: '#000',
    borderWidth: 2,
  },
  itemImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    padding: 10,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  itemCategory: {
    color: '#666',
    fontSize: 12,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  loader: {
    marginTop: 20,
  },
});

export default AddOutfit;
