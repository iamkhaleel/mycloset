import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

// Function to upload an image to Firebase Storage
export const uploadImage = async (userId, collectionName, localPath) => {
  try {
    const fileName = localPath.split('/').pop();
    const path = `images/${userId}/${collectionName}/${fileName}`;

    let imageUri = localPath;
    if (Platform.OS === 'ios' && !localPath.startsWith('file://')) {
      imageUri = `file://${localPath}`;
    }

    // To handle base64 images or other formats, additional checks can be added here
    const reference = storage().ref(path);
    await reference.putFile(imageUri);
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Get the current user's document reference
export const getUserRef = () => {
  const user = auth().currentUser;
  if (!user) throw new Error('No authenticated user');
  return firestore().collection('users').doc(user.uid);
};

// Get a user's document data
export const getUserDoc = async () => {
  const doc = await getUserRef().get();
  if (!doc.exists) {
    return null;
  }
  return {
    id: doc.id,
    ...doc.data(),
  };
};

// Get reference to a user's collection (items, outfits, or lookbooks)
export const getUserCollection = collectionName => {
  return getUserRef().collection(collectionName);
};

// Get all documents from a user's collection
export const getUserDocs = async (collectionName, options = {}) => {
  let query = getUserCollection(collectionName).orderBy('createdAt', 'desc');

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.startAfter) {
    query = query.startAfter(options.startAfter);
  }

  const snapshot = await query.get();

  const docs = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    docs,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
  };
};

// Add a document to a user's collection
export const addUserDoc = async (collectionName, data) => {
  const user = auth().currentUser;
  if (!user) throw new Error('No authenticated user');

  const collection = getUserCollection(collectionName);
  const docData = {...data, userId: user.uid};

  // If there's an image, upload it first
  if (docData.image) {
    const imageUrl = await uploadImage(user.uid, collectionName, docData.image);
    docData.imageUrl = imageUrl;
    delete docData.image; // Remove local path
  }

  // Add the document
  const docRef = await collection.add({
    ...docData,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  // Update the metadata count
  const metadataRef = collection.doc('metadata');
  await firestore().runTransaction(async transaction => {
    const metadata = await transaction.get(metadataRef);
    const newCount = (metadata.data()?.totalCount || 0) + 1;
    transaction.update(metadataRef, {
      totalCount: newCount,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });
  });

  return docRef;
};

// Delete a document from a user's collection
export const deleteUserDoc = async (collectionName, docId) => {
  const collection = getUserCollection(collectionName);

  // Delete the document
  await collection.doc(docId).delete();

  // Update the metadata count
  const metadataRef = collection.doc('metadata');
  await firestore().runTransaction(async transaction => {
    const metadata = await transaction.get(metadataRef);
    const newCount = Math.max((metadata.data()?.totalCount || 0) - 1, 0);
    transaction.update(metadataRef, {
      totalCount: newCount,
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    });
  });
};

// Update a document in a user's collection
export const updateUserDoc = async (collectionName, docId, data) => {
  await getUserCollection(collectionName)
    .doc(docId)
    .update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
};

// Get metadata for a user's collection
export const getCollectionMetadata = async collectionName => {
  const doc = await getUserCollection(collectionName).doc('metadata').get();
  return doc.data();
};
