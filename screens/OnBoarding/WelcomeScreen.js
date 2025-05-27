import React from 'react';
import {View, Text, StyleSheet, Button, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appName} from '../../config';
import ResponsiveButton from '../../components/Button';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('QuestionOne');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.title}>{appName}</Text>
      <Text style={styles.subtitle}>Your personal wardrobe assistant</Text>

      <ResponsiveButton title="Get started" onPress={handleGetStarted} />
      <ResponsiveButton title="Login" onPress={handleLogin} />
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
});

export default WelcomeScreen;
