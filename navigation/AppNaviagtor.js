import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import OnboardingStack from './OnboardingStack';
import MainTabNavigator from './MainTabNavigator';
import Additem from '../screens/Closet/Add';
import ItemDetails from '../screens/Closet/itemdetails';
import AddOutfit from '../screens/Outfits/AddOutfit';
import OutfitDetails from '../screens/Outfits/OutfitDetails';
import AddLookbook from '../screens/Lookbooks/AddLookbook';
import LookbookDetails from '../screens/Lookbooks/LookbookDetails';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{headerShown: false}}>
      {/* Onboarding Stack contains Welcome, Login, SignUp screens */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingStack}
        options={{
          gestureEnabled: false, // Prevent swipe back
        }}
      />

      {/* Main App Stack */}
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{
          gestureEnabled: false, // Prevent swipe back to login
        }}
      />

      {/* ADD Items Screen */}
      <Stack.Screen name="Add" component={Additem} />

      {/* Items Details Screen */}
      <Stack.Screen name="ItemDetails" component={ItemDetails} />

      {/* Add Outfit Screen */}
      <Stack.Screen name="AddOutfit" component={AddOutfit} />

      {/* Outfit Details Screen */}
      <Stack.Screen name="OutfitDetails" component={OutfitDetails} />

      {/* Add Lookbook Screen */}
      <Stack.Screen name="AddLookbook" component={AddLookbook} />

      {/* Lookbook Details Screen */}
      <Stack.Screen name="LookbookDetails" component={LookbookDetails} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
