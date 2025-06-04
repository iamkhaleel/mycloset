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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ResponsiveButton from '../../components/Button';
import {useState} from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';

const SignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const {width, height} = Dimensions.get('window');

  const handleGoback = () => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Failed to create account';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email address is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }

      Alert.alert('Error', errorMessage);
      console.error('SignUp Error:', error);
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
          }}
        />
      </View>
      <Text style={styles.title}>Welcome to MyCloset</Text>
      <Text style={styles.subtitle}>Manage your wardrobe smartly</Text>

      <Text style={styles.title}>Create An Account</Text>

      {/* Email */}
      <View style={{marginTop: 5, width: '95%'}}>
        <Text style={{margin: 2, fontSize: 16, color: '#333'}}>Email</Text>
        <View style={styles.inputBox}>
          <Image
            source={require('../../assets/images/email.png')}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Enter your Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Password */}
      <View style={{marginTop: 5, width: '95%'}}>
        <Text style={{margin: 5, fontSize: 16, color: '#333'}}>Password</Text>
        <View style={styles.inputBox}>
          <Image
            source={require('../../assets/images/padlock-fill.png')}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {/* Confirm Password */}
      <View style={{marginTop: 5, width: '95%'}}>
        <Text style={{margin: 5, fontSize: 16, color: '#333'}}>
          Re-Enter Password
        </Text>
        <View style={styles.inputBox}>
          <Image
            source={require('../../assets/images/padlock-fill.png')}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Confirm your password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          <Text style={{fontWeight: 'bold', marginStart: 40}}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{marginTop: 6}} />
      ) : (
        <ResponsiveButton title="Sign Up" onPress={handleSignUp} />
      )}

      {/* Divider */}
      <View style={{marginTop: 6}}>
        <Text style={styles.orText}>or continue with</Text>

        <View style={{flexDirection: 'row', justifyContent: 'center', gap: 15}}>
          {/* Google */}
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../assets/images/google-logo.png')}
              style={{width: 18, height: 18}}
            />
            <Text style={{color: '#333'}}>Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../assets/images/apple-logo.png')}
              style={{width: 16, height: 16}}
              resizeMode="contain"
            />
            <Text style={{color: '#333'}}>Apple</Text>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#fff',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#888',
    resizeMode: 'contain',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
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
    backgroundColor: '#333',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    marginTop: 12,
    marginBottom: 12,
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 5,
    marginTop: 5,
  },
  socialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default SignUp;
