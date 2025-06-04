import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getAuth, signInWithEmailAndPassword} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleGoback = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const db = getFirestore();

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Store the user token
      const token = userCredential.user.uid;
      await AsyncStorage.setItem('userToken', token);

      // Create or update user document in Firestore
      const userRef = doc(collection(db, 'users'), userCredential.user.uid);
      await setDoc(
        userRef,
        {
          email: userCredential.user.email,
          lastLogin: serverTimestamp(),
        },
        {merge: true},
      );

      setLoading(false);
      navigation.replace('Main');
    } catch (error) {
      setLoading(false);
      console.error('Login Error:', error);

      let errorMessage = 'Failed to login. Please check your credentials.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      }

      Alert.alert('Error', errorMessage);
    }
  };

  const webClientId =
    '738710187136-m02ql9s8s2pb54kd68tc26dqlo2n3493.apps.googleusercontent.com';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
    });
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Success:', userInfo);
      navigation.replace('Main');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoback} style={{marginLeft: -310}}>
        <Image
          source={require('../../assets/images/arrow-left.png')}
          resizeMode="contain"
          style={{
            width: 32,
            height: 32,
            margin: 10,
          }}
        />
      </TouchableOpacity>

      <View styles={styles.logo}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={{
            width: 120,
            height: 120,
          }}
        />
      </View>
      <Text style={styles.title}>Welcome to MyCloset</Text>
      <Text style={styles.subtitle}>Manage your wardrobe smartly</Text>

      <View style={{marginTop: 20, width: '95%'}}>
        <Text style={{margin: 5, fontSize: 16, color: '#333'}}>Email</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 5,
            paddingVertical: 2,
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('../../assets/images/email.png')}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: '#888', // Optional: tint the icon
              resizeMode: 'contain',
            }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: '#000',
            }}
            placeholder="Enter your Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>

      <View style={{marginTop: 20, width: '95%'}}>
        <Text style={{margin: 5, fontSize: 16, color: '#333'}}>Password</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 5,
            paddingVertical: 2,
            backgroundColor: '#fff',
          }}>
          <Image
            source={require('../../assets/images/padlock-fill.png')}
            style={{
              width: 20,
              height: 20,
              marginRight: 10,
              tintColor: '#888', // Optional: tint the icon
              resizeMode: 'contain',
            }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: '#000',
            }}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
          }}>
          {rememberMe && (
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#333',
                borderRadius: 2,
              }}
            />
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 14,
            color: '#333',
            marginTop: 12,
            marginBottom: 12,
          }}>
          Remember Me
        </Text>
        <TouchableOpacity>
          <Text style={{fontWeight: 'bold', marginStart: 40}}>
            {' '}
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <ResponsiveButton title="LogIn" onPress={handleLogin} />

      <View style={{marginTop: 30}}>
        <Text
          style={{
            textAlign: 'center',
            color: '#999',
            marginBottom: 12,
            marginTop: 12,
          }}>
          or continue with
        </Text>

        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
            onPress={googleLogin}>
            <Image
              source={require('../../assets/images/google-logo.png')}
              style={{width: 18, height: 18}}
            />
            <Text style={{color: '#333'}}>Google</Text>
          </TouchableOpacity>

          {/*  <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image
              source={require("../../assets/images/apple-logo.png")}
              style={{ width: 18, height: 18 }}
            />
            <Text style={{ color: "#333" }}>Apple</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 5,
    alignItems: 'center',
    width: '80%',
    height: '20%',
  },
  inputLogo: {
    width: 10,
    height: 10,
    margin: 0,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // Adjust the color as needed
  },
  inputField: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default Login;
