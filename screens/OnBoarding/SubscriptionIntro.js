import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ResponsiveButton from '../../components/Button';

const {width, height} = Dimensions.get('window');

const SubscriptionIntro = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const features = [
    {
      title: 'Unlimited Items',
      description: 'Add unlimited items to your closet',
      icon: 'infinite',
    },
    {
      title: 'Smart Suggestions',
      description: 'Get AI-powered outfit suggestions',
      icon: 'bulb',
    },
    {
      title: 'Priority Support',
      description: '24/7 priority customer support',
      icon: 'headset',
    },
    {
      title: 'Ad-Free Experience',
      description: 'Enjoy the app without ads',
      icon: 'shield-checkmark',
    },
    {
      title: 'Style Analytics',
      description: 'Get insights about your style',
      icon: 'analytics',
    },
  ];

  const plans = [
    {
      id: 'monthly',
      title: 'Monthly',
      price: '$4.99',
      period: 'month',
      popular: false,
    },
    {
      id: 'yearly',
      title: 'Yearly',
      price: '$50',
      period: 'year',
      popular: true,
      savings: 'Save 16%',
    },
  ];

  const handleContinue = () => {
    navigation.navigate('Welcome');
  };

  const handleSkip = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.subtitle}>Take your style to the next level</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={24} color="#000" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
                plan.popular && styles.popularPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id)}>
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>Best Value</Text>
                </View>
              )}
              <Text style={styles.planTitle}>{plan.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>/{plan.period}</Text>
              </View>
              {plan.savings && (
                <Text style={styles.savingsText}>{plan.savings}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <ResponsiveButton
          title="Proceed with Premium"
          onPress={handleContinue}
          buttonStyle={styles.continueButton}
        />
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: height * 0.03,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.03,
  },
  planCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  popularPlan: {
    backgroundColor: '#f0f7ff',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 16,
    color: '#666',
  },
  savingsText: {
    marginTop: 8,
    color: '#00a651',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    marginBottom: 10,
  },
  skipText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingVertical: 10,
  },
});

export default SubscriptionIntro;
