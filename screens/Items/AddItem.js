import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import ImagePicker from 'react-native-image-picker';
import {addUserDoc} from '../../utils/FirestoreService';

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Other',
];

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'All Seasons'];

const AddItem = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = () => {
    ImagePicker.showImagePicker(
      {
        title: 'Select Item Image',
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          Alert.alert('Error', 'Failed to select image');
          return;
        }
        setImage(response.uri);
      },
    );
  };

  const toggleSeason = season => {
    if (seasons.includes(season)) {
      setSeasons(seasons.filter(s => s !== season));
    } else {
      setSeasons([...seasons, season]);
    }
  };

  const handleCreateItem = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select an item image');
      return;
    }

    try {
      setLoading(true);

      const itemData = {
        name: name.trim(),
        description: description.trim(),
        category,
        seasons: seasons.length > 0 ? seasons : ['All Seasons'],
        brand: brand.trim(),
        color: color.trim(),
        image,
        createdAt: new Date().toISOString(),
      };

      await addUserDoc('items', itemData);

      Alert.alert('Success', 'Item added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error creating item:', error);
      Alert.alert('Error', 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleCreateItem}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Add Item</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.imageSelector}
            onPress={handleSelectImage}>
            {image ? (
              <Image source={{uri: image}} style={styles.selectedImage} />
            ) : (
              <Text style={styles.imageSelectorText}>Select Item Image</Text>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Item Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategory,
                ]}
                onPress={() => setCategory(cat)}>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.selectedCategoryText,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Seasons</Text>
          <View style={styles.seasonsGrid}>
            {SEASONS.map(season => (
              <TouchableOpacity
                key={season}
                style={[
                  styles.seasonButton,
                  seasons.includes(season) && styles.selectedSeason,
                ]}
                onPress={() => toggleSeason(season)}>
                <Text
                  style={[
                    styles.seasonText,
                    seasons.includes(season) && styles.selectedSeasonText,
                  ]}>
                  {season}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Brand (optional)"
            value={brand}
            onChangeText={setBrand}
          />

          <TextInput
            style={styles.input}
            placeholder="Color (optional)"
            value={color}
            onChangeText={setColor}
          />
        </View>
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
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  imageSelector: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageSelectorText: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  seasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  seasonButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSeason: {
    backgroundColor: '#000',
  },
  seasonText: {
    fontSize: 14,
    color: '#000',
  },
  selectedSeasonText: {
    color: '#fff',
  },
});

export default AddItem;
