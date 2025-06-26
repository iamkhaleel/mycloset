import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';

// Upload item function using only @react-native-firebase modules
const uploadItem = async ({
  imageUri,
  category,
  subCategory,
  brand,
  size,
  material,
  color,
  price,
  note,
}) => {
  try {
    // Step 1: Upload to Firebase Storage
    const filename = `${uuid.v4()}.jpg`;
    const reference = storage().ref(`/closetItems/${filename}`);

    await reference.putFile(imageUri);
    const downloadURL = await reference.getDownloadURL();

    // Step 2: Save to Firestore
    await firestore().collection('closetItems').add({
      image: downloadURL,
      category,
      subCategory,
      brand,
      size,
      material,
      color,
      price,
      note,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return {success: true};
  } catch (error) {
    console.error('Upload error:', error);
    return {success: false, error};
  }
};

export {auth, firestore, storage, uploadItem};
