import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import OnboardingStack from './OnboardingStack';
import MainTabNavigator from './MainTabNavigator';
import Additem from '../screens/Closet/Add';
import ItemDetails from '../screens/Closet/itemdetails';
import AddOutfit from '../screens/Outfits/AddOutfit';
import AddLookbook from '../screens/Lookbooks/AddLookbook';

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

        {/* Items Details Screen */}
        <Stack.Screen name="ItemDetails" component={ItemDetails} />

        {/* Add Outfit Screen */}
        <Stack.Screen name="AddOutfit" component={AddOutfit} />

        {/* Add Lookbook Screen */}
        <Stack.Screen name="AddLookbook" component={AddLookbook} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
