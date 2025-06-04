import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ResponsiveButton from '../../components/Button';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import ModalDropdown from 'react-native-modal-dropdown';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await firestore()
        .collection('items')
        .add({
          imageBase64: base64Image,
          name,
          category,
          subCategory,
          brand,
          size,
          material,
          color,
          price: price ? parseFloat(price) : null,
          note,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Success', 'Item saved Successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Firestore error:', error);
      Alert.alert('Error', 'Failed to upload item');
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
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <TouchableOpacity onPress={handleGoback} style={{marginStart: '3%'}}>
            <Image
              source={require('../../assets/images/arrow-left.png')}
              resizeMode="contain"
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              flex: 1,
              textAlign: 'center',
              marginRight: 32,
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
            <TouchableOpacity style={styles.guideButton}>
              <Text>Photo Guide</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePreview}>
            <Image
              source={{uri: selectedImage}}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}

        {!selectedImage ? (
          <View>
            <TouchableOpacity
              onPress={() =>
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
                )
              }
              style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="camera" size={30} color="#000" />
                <Text style={{marginStart: 10}}>Take a Photo</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                launchImageLibrary(
                  {
                    mediaType: 'photo',
                    quality: 0.7,
                    maxWidth: 800,
                    maxHeight: 800,
                  },
                  handleImageResponse,
                )
              }
              style={styles.actionButton}>
              <View style={styles.actionContent}>
                <Ionicons name="images" size={30} color="#000" />
                <Text style={{marginStart: 10}}>Choose from gallery</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.orDivider}>
              <View style={styles.orCircle}>
                <Text style={{color: 'white'}}>OR</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.proButton}>
              <View style={styles.actionContent}>
                <Ionicons name="images-outline" size={30} color="#fff" />
                <Text style={{marginStart: 10, color: 'white'}}>
                  Add Multiple Photos (up to 15)
                </Text>
              </View>
              <View style={styles.proBadge}>
                <Ionicons name="star" size={23} color="#fff" />
                <Text style={{color: 'white'}}>Pro</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imagePlaceholder: {
    borderWidth: 0.3,
    borderColor: 'black',
    borderRadius: 30,
    height: 320,
    margin: 15,
    backgroundColor: 'white',
  },
  placeholderText: {
    padding: 20,
    marginTop: 30,
    fontWeight: '300',
    textAlign: 'center',
    fontSize: 18,
  },
  divider: {
    height: 0.4,
    backgroundColor: '#000',
    marginStart: 70,
    marginEnd: 70,
  },
  guideButton: {
    alignSelf: 'center',
    margin: 10,
    borderColor: 'black',
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
    borderColor: 'black',
    borderRadius: 25,
    borderWidth: 0.3,
    padding: 10,
    width: '60%',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  proButton: {
    alignSelf: 'center',
    backgroundColor: 'black',
    borderColor: 'black',
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
    backgroundColor: 'black',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orDivider: {
    height: 0.4,
    backgroundColor: '#000',
    marginStart: 70,
    marginEnd: 70,
    margin: 50,
  },
  orCircle: {
    width: 36,
    height: 36,
    backgroundColor: 'black',
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
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownButton: {
    padding: 10,
    borderBottomWidth: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
  removeImageButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    margin: 10,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 0.3,
    padding: 10,
  },
  removeImageText: {
    paddingStart: 10,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default AddItem;
