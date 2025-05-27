import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import OnboardingStack from './OnboardingStack';
import MainTabNavigator from './MainTabNavigator';
import Additem from '../screens/Closet/Add';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* First screen is Onboarding */}
        <Stack.Screen name="Onboarding" component={OnboardingStack} />

        {/* After login, navigate to MainApp */}
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* ADD Items Screen */}
        <Stack.Screen name="Add" component={Additem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
