import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {addUserDoc, getUserDocs} from '../../utils/FirestoreService';
import OutfitCard from '../../components/OutfitCard';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const THEMES = [
  'Casual',
  'Formal',
  'Work',
  'Party',
  'Vacation',
  'Sports',
  'Seasonal',
  'Special Occasion',
];

const AddLookbook = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [selectedOutfits, setSelectedOutfits] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      const {docs} = await getUserDocs('outfits');
      setOutfits(docs);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      Alert.alert('Error', 'Failed to load outfits');
    } finally {
      setLoading(false);
    }
  };

  const toggleOutfitSelection = outfit => {
    if (selectedOutfits.find(selected => selected.id === outfit.id)) {
      setSelectedOutfits(
        selectedOutfits.filter(selected => selected.id !== outfit.id),
      );
    } else {
      setSelectedOutfits([...selectedOutfits, outfit]);
    }
  };

  const sanitizeOutfit = outfit => {
    // Only keep serializable, valid fields
    return {
      id: outfit.id,
      name: outfit.name || '',
      // Only store item IDs, not objects
      items: Array.isArray(outfit.items)
        ? outfit.items.filter(id => typeof id === 'string')
        : [],
    };
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for the lookbook');
      return;
    }

    if (selectedOutfits.length === 0) {
      Alert.alert('Error', 'Please select at least one outfit');
      return;
    }

    try {
      setSaving(true);
      const user = auth().currentUser;
      if (!user) throw new Error('No authenticated user');

      // Sanitize all outfits before saving
      const sanitizedOutfits = selectedOutfits.map(sanitizeOutfit);

      const lookbookData = {
        name: name.trim(),
        description: description.trim() || null,
        theme: theme || null,
        outfits: sanitizedOutfits,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Save lookbook directly to user's subcollection to avoid potential issues with shared util
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('lookbooks')
        .add(lookbookData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving lookbook:', error);
      Alert.alert('Error', 'Failed to save lookbook');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFD66B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Lookbook</Text>
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
            placeholder="Lookbook Name"
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.themesContainer}>
            {THEMES.map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.themeButton,
                  theme === t && styles.selectedTheme,
                ]}
                onPress={() => setTheme(t)}>
                <Text
                  style={[
                    styles.themeText,
                    theme === t && styles.selectedThemeText,
                  ]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>
            Selected Outfits ({selectedOutfits.length})
          </Text>
          {selectedOutfits.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {selectedOutfits.map(outfit => (
                <View key={outfit.id} style={styles.selectedOutfitPreview}>
                  {outfit.items && outfit.items[0]?.imageUrl && (
                    <Image
                      source={{uri: outfit.items[0].imageUrl}}
                      style={styles.previewImage}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => toggleOutfitSelection(outfit)}>
                    <Ionicons name="close-circle" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Select outfits to include</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Outfits</Text>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : outfits.length > 0 ? (
          outfits.map(outfit => (
            <View
              key={outfit.id}
              style={[
                styles.outfitContainer,
                selectedOutfits.find(selected => selected.id === outfit.id) &&
                  styles.selectedOutfit,
              ]}>
              <Image
                source={{uri: outfit.items[0]?.imageUrl}}
                style={styles.outfitImage}
                resizeMode="cover"
              />
              <View style={styles.outfitDetails}>
                <Text style={styles.outfitName}>{outfit.name}</Text>
                <Text style={styles.outfitCategory}>{outfit.category}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkmark}
                onPress={() => toggleOutfitSelection(outfit)}>
                {selectedOutfits.find(
                  selected => selected.id === outfit.id,
                ) && <Ionicons name="checkmark" size={20} color="#FFD66B" />}
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No outfits available</Text>
            <Text style={styles.emptySubText}>
              Create some outfits first to add them to your lookbook
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
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
  saveButton: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  savingButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#222831',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    backgroundColor: '#2D333B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: '#eee',
    borderWidth: 1,
    borderColor: '#FFD66B',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  themesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedTheme: {
    backgroundColor: '#000',
  },
  themeText: {
    color: '#666',
  },
  selectedThemeText: {
    color: '#fff',
  },
  selectedSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3B4048',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: '#eee',
  },
  selectedOutfitPreview: {
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
    backgroundColor: '#222831',
    borderRadius: 12,
  },
  emptyText: {
    color: '#eee',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptySubText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  outfitContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: '#2D333B',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    maxWidth: '46%',
    borderWidth: 1,
    borderColor: '#3B4048',
  },
  selectedOutfit: {
    borderColor: '#FFD66B',
    borderWidth: 2,
  },
  outfitImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#3B4048',
  },
  outfitDetails: {
    padding: 10,
  },
  outfitName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: '#eee',
  },
  outfitCategory: {
    color: '#eee',
    fontSize: 12,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#222831',
    borderRadius: 12,
  },
  loader: {
    marginTop: 20,
  },
});

export default AddLookbook;
