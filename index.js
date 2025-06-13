/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firebase from '@react-native-firebase/app';
import {Buffer} from 'buffer';
global.Buffer = Buffer;

// Firebase configuration (replace with your values from Firebase Console)
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized'); // Debug log to confirm
} else {
  firebase.app(); // Use existing app if already initialized
}

AppRegistry.registerComponent(appName, () => App);
