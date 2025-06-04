import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCuZWO3UV8fTfJbJDGbU1stlvUqMcUGo6M',
  authDomain: 'mycloset-3e5c0.firebaseapp.com',
  projectId: 'mycloset-3e5c0',
  storageBucket: 'mycloset-3e5c0.firebasestorage.app',
  messagingSenderId: '738710187136',
  appId: '1:738710187136:web:f6b2bb16949e5cf67dca65',
  measurementId: 'G-MHGW74828S',
};

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

// Firebase Auth
export const auth = getAuth(app);
