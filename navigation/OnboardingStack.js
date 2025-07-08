import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FeaturesIntro from '../screens/OnBoarding/FeaturesIntro';
import SubscriptionIntro from '../screens/OnBoarding/SubscriptionIntro';
import WelcomeScreen from '../screens/OnBoarding/WelcomeScreen';
import Login from '../screens/OnBoarding/Login';
import QuestionOne from '../screens/OnBoarding/QuestionOne';
import QuestionThree from '../screens/OnBoarding/Questionthree';
import SignUp from '../screens/OnBoarding/SignUp';
import {getUser} from '../utils/AuthStorage';
import {useNavigation} from '@react-navigation/native';
import {View, ActivityIndicator} from 'react-native';

const Stack = createStackNavigator();

const springTransition = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const cardStyleInterpolator = ({current, layouts}) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
      opacity: current.progress,
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
      }),
    },
  };
};

const OnboardingStack = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        navigation.reset({index: 0, routes: [{name: 'Main'}]});
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="FeaturesIntro"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#222831'},
        transitionSpec: {
          open: springTransition,
          close: springTransition,
        },
        cardStyleInterpolator,
      }}>
      <Stack.Screen name="FeaturesIntro" component={FeaturesIntro} />
      <Stack.Screen name="SubscriptionIntro" component={SubscriptionIntro} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="QuestionOne" component={QuestionOne} />
      <Stack.Screen name="QuestionThree" component={QuestionThree} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
