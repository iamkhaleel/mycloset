import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ResponsiveButton from '../../components/Button';

const Additem = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleGoback = () => {
    navigation.goBack();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleImageResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const asset = response.assets[0];
      console.log('Selected Image: ', asset);
      setSelectedImage(asset.uri);
    }
  };

  return (
    <SafeAreaView showsVerticalScrollIndicator={false}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <TouchableOpacity onPress={handleGoback} style={{marginStart: '3%'}}>
          <Image
            source={require('../../assets/images/arrow-left.png')}
            resizeMode="contain"
            style={{
              width: 32,
              height: 32,
            }}
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

      {/* Conditionally Render Content */}
      {!selectedImage ? (
        <View
          style={{
            borderWidth: 0.3,
            borderColor: 'black',
            borderRadius: 30,
            height: 320,
            margin: 15,
            backgroundColor: 'white',
          }}>
          <Text
            style={{
              padding: 20,
              marginTop: 60,
              fontWeight: 300,
              textAlign: 'center',
              fontSize: 18,
            }}>
            Take a photo or choose one from your gallery to add
          </Text>

          <View
            style={{
              height: 0.4,
              backgroundColor: '#000',
              marginStart: 70,
              marginEnd: 70,
            }}></View>

          <Text
            style={{
              marginTop: 40,
              fontWeight: 300,
              textAlign: 'center',
              fontSize: 18,
            }}>
            Need Tips on taking a good picture ?
          </Text>
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              margin: 10,
              borderColor: 'black',
              borderRadius: 5,
              borderWidth: 0.3,
              padding: 10,
            }}>
            <Text>Photo Guide</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            height: 320,
            margin: 15,
            borderRadius: 30,
            overflow: 'hidden',
          }}>
          <Image
            source={{uri: selectedImage}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 30,
            }}
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

          <View
            style={{
              height: 0.4,
              backgroundColor: '#000',
              marginStart: 70,
              marginEnd: 70,
              margin: 50,
            }}>
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: 'black',
                alignItems: 'center',
                alignSelf: 'center',
                borderRadius: 50,
                marginTop: -15,
              }}>
              <Text style={{color: 'white', textAlign: 'center', padding: 6}}>
                OR
              </Text>
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
              <Text style={{color: 'white', textAlign: 'center', padding: 6}}>
                Pro
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{marginBottom: 40, marginHorizontal: 20}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              margin: 10,
              borderColor: 'black',
              borderRadius: 5,
              borderWidth: 0.3,
              padding: 10,
            }}
            onPress={handleRemoveImage}>
            <Ionicons name="remove-circle" size={20} color="black" />
            <Text style={{paddingStart: 10}}>Remove image</Text>
          </TouchableOpacity>

          <ResponsiveButton
            title="Create Item"
            onPress={() => {
              console.log({
                category,
                subCategory,
                brand,
                size,
                material,
                color,
                price,
                note,
                selectedImage,
              });
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
});

export default Additem;
