import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {saveUser} from '../../utils/AuthStorage';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '738710187136-m02ql9s8s2pb54kd68tc26dqlo2n3493.apps.googleusercontent.com',
    });
  }, []);

  const handleGoback = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      // Check user document exists
      const userDoc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();
      if (!userDoc.exists) {
        throw new Error('User data not found. Please sign up.');
      }

      await saveUser(userCredential.user);

      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      // Create user document if it doesn't exist
      const userDoc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();
      if (!userDoc.exists) {
        await firestore().collection('users').doc(userCredential.user.uid).set({
          email: userCredential.user.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
          isPremium: false,
          premiumExpiryDate: null,
        });
      }

      await saveUser(userCredential.user);

      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      console.error('Google Sign-in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleGoback}
        style={{marginLeft: width * -0.88}}>
        <Image
          source={require('../../assets/images/arrow-left.png')}
          resizeMode="contain"
          style={{
            width: 32,
            height: 32,
            marginStart: '3%',
            marginTop: '0%',
            tintColor: '#FFD66B',
          }}
        />
      </TouchableOpacity>

      <View style={styles.logo}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={{
            width: 120,
            height: 120,
            borderRadius: 100,
          }}
        />
      </View>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to manage your wardrobe</Text>

      <Text style={styles.title}>Log In</Text>

      {/* Email */}
      <View style={{marginTop: 5, width: '95%'}}>
        <Text style={{margin: 2, fontSize: 16, color: '#FFD66B'}}>Email</Text>
        <View style={styles.inputBox}>
          <Image
            source={require('../../assets/images/email.png')}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Enter your Email Address"
            placeholderTextColor="black"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password */}
      <View style={{marginTop: 5, width: '95%'}}>
        <Text style={{margin: 5, fontSize: 16, color: '#FFD66B'}}>
          Password
        </Text>
        <View style={styles.inputBox}>
          <Image
            source={require('../../assets/images/padlock-fill.png')}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Enter your password"
            placeholderTextColor="black"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Remember Me */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={styles.checkbox}>
          {rememberMe && <View style={styles.checkedBox} />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>Remember Me</Text>
        <TouchableOpacity>
          <Text style={{fontWeight: 'bold', marginStart: 40, color: '#FFD66B'}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFD66B"
          style={{marginTop: 6}}
        />
      ) : (
        <ResponsiveButton
          title="Log In"
          onPress={handleLogin}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginButtonText}
        />
      )}

      {/* Divider */}
      <View style={{marginTop: 6}}>
        <Text style={styles.orText}>or continue with</Text>

        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
          {/* Google */}
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}>
            <Image
              source={require('../../assets/images/google-logo.png')}
              style={{width: 18, height: 18}}
            />
            <Text style={{color: '#222831'}}>Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../assets/images/apple-logo.png')}
              style={{width: 16, height: 16}}
              resizeMode="contain"
            />
            <Text style={{color: '#222831'}}>Apple</Text>
          </TouchableOpacity>
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
    backgroundColor: '#222831',
  },
  logo: {
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#FFD66B',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD66B',
    marginBottom: 6,
    textAlign: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#f2faff',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: 'black',
    resizeMode: 'contain',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#222831',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedBox: {
    width: 12,
    height: 12,
    backgroundColor: '#28a745',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 14,
    color: '#FFD66B',
    marginTop: 12,
    marginBottom: 12,
  },
  orText: {
    textAlign: 'center',
    color: '#FFD66B',
    marginBottom: 5,
    marginTop: 5,
  },
  socialButton: {
    backgroundColor: '#f2faff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButton: {
    height: height * 0.05,
    minHeight: 50,
    backgroundColor: '#FFD66B',
    borderRadius: 10,
    margin: 5,
    alignSelf: 'center',
    width: width * 0.8,
  },
  loginButtonText: {
    color: '#222831',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Login;
