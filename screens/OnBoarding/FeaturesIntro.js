import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ResponsiveButton from '../../components/Button';

const {width, height} = Dimensions.get('window');

const FeaturesIntro = () => {
  const navigation = useNavigation();

  const features = [
    {
      title: 'Organize Your Closet',
      description: 'Digitize and categorize your entire wardrobe with ease',
      icon: 'shirt',
    },
    {
      title: 'Smart Outfit Suggestions',
      description:
        'Get personalized outfit recommendations based on your style',
      icon: 'bulb',
    },
    {
      title: 'Create Lookbooks',
      description: 'Save and organize your favorite outfit combinations',
      icon: 'images',
    },
    {
      title: 'Style Analytics',
      description: 'Track your style preferences and wearing habits',
      icon: 'analytics',
    },
  ];

  const handleNext = () => {
    navigation.navigate('SubscriptionIntro');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to MyCloset</Text>
        <Text style={styles.subtitle}>
          Your personal wardrobe assistant powered by AI
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Ionicons name={feature.icon} size={32} color="#000" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <ResponsiveButton
          title="Get Started"
          onPress={handleNext}
          buttonStyle={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 20,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 12,
  },
});

export default FeaturesIntro;
