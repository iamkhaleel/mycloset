import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);

// Firebase Auth
export const auth = getAuth(app);
