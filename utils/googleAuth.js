import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Alert} from '../contexts/AlertContext';
import {saveUser} from './AuthStorage';

const GOOGLE_SIGN_IN_CONFIG = {
  webClientId:
    '738710187136-m02ql9s8s2pb54kd68tc26dqlo2n3493.apps.googleusercontent.com',
  iosClientId:
    '738710187136-f6vi2871puki8q6lc50fs3rur95t2fvj.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
};

let isConfigured = false;

export async function configureGoogleSign() {
  if (isConfigured) {
    return;
  }
  await GoogleSignin.configure(GOOGLE_SIGN_IN_CONFIG);
  isConfigured = true;
}

function confirmGoogleSignIn() {
  return new Promise(resolve => {
    Alert.alert(
      'Continue with Google',
      'You will sign in using your Google account. A secure Google sign-in window will open next.',
      [
        {text: 'Cancel', style: 'cancel', onPress: () => resolve(false)},
        {text: 'Continue', onPress: () => resolve(true)},
      ],
    );
  });
}

async function ensureUserDocument(user) {
  const userDoc = await firestore().collection('users').doc(user.uid).get();
  if (!userDoc.exists) {
    await firestore().collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isPremium: false,
      premiumExpiryDate: null,
    });
  }
}

export async function signInWithGoogle() {
  await configureGoogleSign();

  const confirmed = await confirmGoogleSignIn();
  if (!confirmed) {
    return {cancelled: true};
  }

  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const signInResponse = await GoogleSignin.signIn();

    if (signInResponse.type !== 'success') {
      return {cancelled: true};
    }

    const {idToken} = signInResponse.data;
    if (!idToken) {
      throw new Error('Failed to get Google ID token. Please try again.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);

    await ensureUserDocument(userCredential.user);
    await saveUser(userCredential.user);

    return {success: true, user: userCredential.user};
  } catch (error) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      return {cancelled: true};
    }
    if (error?.code === statusCodes.IN_PROGRESS) {
      throw new Error('Sign in is already in progress');
    }
    if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Play services not available or outdated');
    }
    throw error;
  }
}
