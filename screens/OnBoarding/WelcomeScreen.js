import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appName} from '../../config';
import ResponsiveButton from '../../components/Button';
import AnimatedScreen from '../../components/AnimatedScreen';

const {width, height} = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('QuestionOne');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AnimatedScreen
      animation="fadeInUp"
      duration={900}
      style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.subtitle}>Your personal wardrobe assistant</Text>

      <View style={styles.buttonGroup}>
        <ResponsiveButton
          title="Get Started"
          onPress={handleGetStarted}
          buttonStyle={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
        <ResponsiveButton
          title="Login"
          onPress={handleLogin}
          buttonStyle={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />
      </View>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#222831',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: height * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFD66B',
  },
  subtitle: {
    fontSize: 16,
    color: '#EEEEEE',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  buttonGroup: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#FFD66B',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#222831',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#393E46',
    borderRadius: 12,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#FFD66B',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
