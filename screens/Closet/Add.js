import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ResponsiveButton from '../../components/Button';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import ModalDropdown from 'react-native-modal-dropdown';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {removeBackground} from '../../utils/ImageProcessing';
import PhotoGuide from '../../components/PhotoGuide';

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Undergarments',
  'Bags',
  'Accessories',
];

const COLORS = [
  {name: 'Black', hex: '#000000'},
  {name: 'White', hex: '#FFFFFF'},
  {name: 'Gray', hex: '#808080'},
  {name: 'Navy', hex: '#000080'},
  {name: 'Blue', hex: '#0000FF'},
  {name: 'Light Blue', hex: '#ADD8E6'},
  {name: 'Red', hex: '#FF0000'},
  {name: 'Burgundy', hex: '#800020'},
  {name: 'Pink', hex: '#FFC0CB'},
  {name: 'Hot Pink', hex: '#FF69B4'},
  {name: 'Purple', hex: '#800080'},
  {name: 'Lavender', hex: '#E6E6FA'},
  {name: 'Green', hex: '#008000'},
  {name: 'Olive', hex: '#808000'},
  {name: 'Teal', hex: '#008080'},
  {name: 'Yellow', hex: '#FFFF00'},
  {name: 'Gold', hex: '#FFD700'},
  {name: 'Orange', hex: '#FFA500'},
  {name: 'Brown', hex: '#A52A2A'},
  {name: 'Beige', hex: '#F5F5DC'},
  {name: 'Khaki', hex: '#C3B091'},
  {
    name: 'Multicolor',
    hex: 'linear-gradient(45deg, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF)',
  },
];

const MATERIALS = [
  'Cotton',
  'Polyester',
  'Silk',
  'Wool',
  'Linen',
  'Denim',
  'Leather',
  'Suede',
  'Cashmere',
  'Velvet',
  'Spandex',
  'Nylon',
  'Rayon',
  'Acrylic',
  'Fleece',
  'Flannel',
  'Chiffon',
  'Satin',
  'Taffeta',
  'Organza',
  'Tulle',
  'Lace',
  'Corduroy',
  'Tweed',
  'Chambray',
  'Jersey',
  'Poplin',
  'Oxford',
  'Canvas',
  'Twill',
  'Gabardine',
  'Seersucker',
  'Bamboo',
  'Hemp',
  'Modal',
  'Viscose',
  'Lyocell',
  'Neoprene',
  'Faux Fur',
  'PVC',
  'Rubber',
  'Latex',
  'Mesh',
  'Net',
  'Terrycloth',
];

const AddItem = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [removeBgEnabled, setRemoveBgEnabled] = useState(false);
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState(null);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');

  const handleGoback = () => {
    navigation.goBack();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setBase64Image(null);
  };

  const handleImageResponse = async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to select image');
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      console.log('Selected Image: ', asset);
      if (asset.uri) {
        if (removeBgEnabled) {
          setProcessingImage(true);
          try {
            const result = await removeBackground(asset.uri);
            if (result.success) {
              setSelectedImage(result.uri);
              setBase64Image(result.base64);
            } else {
              Alert.alert(
                'Error',
                'Failed to remove background. Using original image.',
              );
              setSelectedImage(asset.uri);
              const base64 = await RNFS.readFile(asset.uri, 'base64');
              setBase64Image(base64);
            }
          } catch (error) {
            console.error('Background removal error:', error);
            Alert.alert(
              'Error',
              'Failed to remove background. Using original image.',
            );
            setSelectedImage(asset.uri);
            const base64 = await RNFS.readFile(asset.uri, 'base64');
            setBase64Image(base64);
          } finally {
            setProcessingImage(false);
          }
        } else {
          setSelectedImage(asset.uri);
          try {
            const base64 = await RNFS.readFile(asset.uri, 'base64');
            setBase64Image(base64);
          } catch (error) {
            console.error('Base64 conversion error:', error);
            Alert.alert('Error', 'Failed to process image');
          }
        }
      }
    }
  };

  // Defensive wrappers for image picker
  const handleLaunchCamera = () => {
    if (!isFocused) return;
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      handleImageResponse,
    );
  };

  const handleLaunchImageLibrary = () => {
    if (!isFocused) return;
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      handleImageResponse,
    );
  };

  const uploadToFirestore = async () => {
    if (!selectedImage || !base64Image) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!name) {
      Alert.alert('Error', 'Please enter a name for the item');
      return;
    }

    setLoading(true);
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Save to Firestore with all the item data
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('items')
        .add({
          name,
          category,
          subCategory: subCategory || '',
          brand: brand || '',
          size: size || '',
          material: material || '',
          color: color || '',
          price: price ? parseFloat(price) : null,
          note: note || '',
          imageBase64: base64Image,
          timestamp: firestore.FieldValue.serverTimestamp(),
          userId: currentUser.uid,
        });

      Alert.alert('Success', 'Item saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderColorItem = colorItem => {
    if (colorItem.name === 'Multicolor') {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[
              styles.colorIndicator,
              {
                backgroundImage: colorItem.hex,
                borderWidth: 1,
                borderColor: '#ccc',
              },
            ]}
          />
          <Text>{colorItem.name}</Text>
        </View>
      );
    }
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={[styles.colorIndicator, {backgroundColor: colorItem.hex}]}
        />
        <Text>{colorItem.name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: '#222831', flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <TouchableOpacity onPress={handleGoback} style={{marginStart: '3%'}}>
            <Image
              source={require('../../assets/images/arrow-left.png')}
              resizeMode="contain"
              style={{width: 32, height: 32, tintColor: '#FFD66B'}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              flex: 1,
              textAlign: 'center',
              marginRight: 32,
              color: '#eee',
            }}>
            New Item
          </Text>
        </View>

        {!selectedImage ? (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              Take a photo or choose one from your gallery to add
            </Text>
            <View style={styles.divider} />
            <Text style={styles.placeholderText}>
              Need Tips on taking a good picture?
            </Text>
            <TouchableOpacity
              style={styles.guideButton}
              onPress={() => setShowPhotoGuide(true)}>
              <Text style={{color: '#eee'}}>Photo Guide</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePreview}>
            <Image
              source={{uri: selectedImage}}
              style={styles.previewImage}
              resizeMode="cover"
            />
            {processingImage && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.processingText}>
                  Removing background...
                </Text>
              </View>
            )}
          </View>
        )}

        {!selectedImage ? (
          <View>
            <TouchableOpacity
              onPress={handleLaunchCamera}
              style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="camera" size={30} color="#eee" />
                <Text style={{marginStart: 10, color: '#eee'}}>
                  Take a Photo
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLaunchImageLibrary}
              style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="images" size={30} color="#eee" />
                <Text style={{marginStart: 10, color: '#eee'}}>
                  Choose from gallery
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.orDivider}>
              <View style={styles.orCircle}>
                <Text style={{color: 'white'}}>OR</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                removeBgEnabled && styles.activeButton,
              ]}
              onPress={() => setRemoveBgEnabled(!removeBgEnabled)}>
              <View style={styles.actionContent}>
                <Ionicons
                  name={removeBgEnabled ? 'checkmark-circle' : 'cut-outline'}
                  size={30}
                  color={removeBgEnabled ? '#222831' : '#eee'}
                />
                <Text
                  style={[
                    {marginStart: 10},
                    {color: removeBgEnabled ? '#222831' : '#eee'},
                  ]}>
                  Remove Background
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.proButton}>
              <View style={styles.actionContent}>
                <Ionicons name="images-outline" size={30} color="#222831" />
                <Text style={{marginStart: 10, color: '#222831'}}>
                  Add Multiple Photos (up to 15)
                </Text>
              </View>
              <View style={styles.proBadge}>
                <Ionicons name="star" size={23} color="#222831" />
                <Text style={{color: '#222831'}}>Pro</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginBottom: 40, marginHorizontal: 20}}>
            {/* item name Input */}
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={CATEGORIES}
                defaultValue="Select Category"
                onSelect={(index, value) => setCategory(value)}
                dropdownStyle={styles.dropdown}
                dropdownTextStyle={styles.dropdownText}
                style={styles.dropdownButton}
                textStyle={styles.dropdownButtonText}
              />
            </View>

            {/* Sub Category Input */}
            <TextInput
              placeholder="Sub Category"
              value={subCategory}
              onChangeText={setSubCategory}
              style={styles.input}
            />

            {/* Brand Input */}
            <TextInput
              placeholder="Brand"
              value={brand}
              onChangeText={setBrand}
              style={styles.input}
            />

            {/* Size Input */}
            <TextInput
              placeholder="Size"
              value={size}
              onChangeText={setSize}
              style={styles.input}
            />

            {/* Material Dropdown */}
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={MATERIALS}
                defaultValue="Select Material"
                onSelect={(index, value) => setMaterial(value)}
                dropdownStyle={styles.dropdown}
                dropdownTextStyle={styles.dropdownText}
                style={styles.dropdownButton}
                textStyle={styles.dropdownButtonText}
              />
            </View>

            {/* Color Dropdown */}
            <View style={styles.dropdownContainer}>
              <ModalDropdown
                options={COLORS}
                defaultValue="Select Color"
                renderRow={renderColorItem}
                onSelect={(index, value) => setColor(value)}
                textStyle={styles.dropdownText}
                dropdownStyle={styles.dropdown}
                renderButtonText={rowData => rowData.name}
              />
            </View>

            {/* Price Input */}
            <TextInput
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            {/* Note Input */}
            <TextInput
              placeholder="Note"
              value={note}
              onChangeText={setNote}
              multiline
              style={[styles.input, {minHeight: 60}]}
            />

            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}>
              <Ionicons name="remove-circle" size={20} color="black" />
              <Text style={styles.removeImageText}>Remove image</Text>
            </TouchableOpacity>

            <ResponsiveButton
              title={loading ? 'Uploading...' : 'Create Item'}
              onPress={uploadToFirestore}
              disabled={loading || !selectedImage || !category}
            />

            {loading && (
              <ActivityIndicator size="large" style={{marginVertical: 20}} />
            )}
          </View>
        )}

        <PhotoGuide
          visible={showPhotoGuide}
          onClose={() => setShowPhotoGuide(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imagePlaceholder: {
    borderWidth: 0.3,
    borderColor: '#FFD66B',
    borderRadius: 30,
    height: 320,
    margin: 15,
    backgroundColor: '#222831',
  },
  placeholderText: {
    padding: 20,
    marginTop: 30,
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 18,
    color: '#eee',
  },
  divider: {
    height: 0.4,
    backgroundColor: '#FFD66B',
    marginStart: 70,
    marginEnd: 70,
  },
  guideButton: {
    alignSelf: 'center',
    margin: 10,
    borderColor: '#FFD66B',
    borderRadius: 5,
    borderWidth: 0.3,
    padding: 10,
  },
  imagePreview: {
    height: 320,
    margin: 15,
    borderRadius: 30,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  actionButton: {
    alignSelf: 'center',
    margin: 10,
    borderColor: '#FFD66B',
    borderRadius: 25,
    borderWidth: 0.3,
    padding: 10,
    width: '60%',
    backgroundColor: '#2D333B',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  proButton: {
    alignSelf: 'center',
    backgroundColor: '#FFD66B',
    borderColor: '#FFD66B',
    borderRadius: 25,
    borderWidth: 0.3,
    padding: 10,
    width: '80%',
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: -15,
    right: 10,
    width: 67,
    height: 36,
    backgroundColor: '#FFD66B',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orDivider: {
    height: 0.4,
    backgroundColor: '#FFD66B',
    marginStart: 70,
    marginEnd: 70,
    margin: 50,
  },
  orCircle: {
    width: 36,
    height: 36,
    backgroundColor: '#FFD66B',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    marginTop: -15,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  dropdown: {
    width: '50%',
    borderColor: '#FFD66B',
    borderWidth: 2,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#eee',
  },
  dropdownButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD66B',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#eee',
  },
  input: {
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 8,
    borderBottomColor: '#FFD66B',
    color: '#eee',
  },
  removeImageButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10,
    borderColor: '#FFD66B',
    borderRadius: 5,
    borderWidth: 0.3,
    padding: 10,
  },
  removeImageText: {
    paddingStart: 10,
    color: '#eee',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(34, 40, 49, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFD66B',
    marginTop: 10,
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: '#FFD66B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoGuideButton: {
    backgroundColor: '#FFD66B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  photoGuideButtonText: {
    color: '#222831',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddItem;
