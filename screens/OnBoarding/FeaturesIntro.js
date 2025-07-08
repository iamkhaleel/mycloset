import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ResponsiveButton from '../../components/Button';
import AnimatedScreen from '../../components/AnimatedScreen';

const {width, height} = Dimensions.get('window');
const scale = size => (width / 375) * size;

const FeaturesIntro = () => {
  const navigation = useNavigation();

  const features = [
    {
      title: 'Organize Your Closet',
      description: 'Digitize and categorize your entire wardrobe with ease',
      icon: 'shirt-outline',
    },
    {
      title: 'Smart Outfit Suggestions',
      description:
        'Get personalized outfit recommendations based on your style',
      icon: 'bulb-outline',
    },
    {
      title: 'Create Lookbooks',
      description: 'Save and organize your favorite outfit combinations',
      icon: 'images-outline',
    },
    {
      title: 'Style Analytics',
      description: 'Track your style preferences and wearing habits',
      icon: 'analytics-outline',
    },
  ];

  const handleNext = () => {
    navigation.navigate('SubscriptionIntro');
  };

  return (
    <AnimatedScreen animation="fadeInUp" duration={900} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Ionicons name={feature.icon} size={28} color="#FFD66B" />
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
            textStyle={styles.nextButtonText}
          />
        </View>
      </ScrollView>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#222831',
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.04,
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 20,
    borderRadius: 100,
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD66B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: scale(14),
    color: '#EEEEEE',
    textAlign: 'center',
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#393E46',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222831',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#FFD66B',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: scale(13),
    color: '#EEEEEE',
    lineHeight: 18,
  },
  footer: {
    marginTop: 30,
  },
  nextButton: {
    backgroundColor: '#FFD66B',
    borderRadius: 12,
    paddingVertical: 14,
  },
  nextButtonText: {
    color: '#222831',
    fontWeight: 'bold',
    fontSize: scale(16),
    textAlign: 'center',
  },
});

export default FeaturesIntro;
