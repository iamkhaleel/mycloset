import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import Additem from '../screens/Closet/Add';
import ItemDetails from '../screens/Closet/itemdetails';
import AddOutfit from '../screens/Outfits/AddOutfit';
import OutfitDetails from '../screens/Outfits/OutfitDetails';
import AddLookbook from '../screens/Lookbooks/AddLookbook';
import LookbookDetails from '../screens/Lookbooks/LookbookDetails';

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Add" component={Additem} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="AddOutfit" component={AddOutfit} />
      <Stack.Screen name="OutfitDetails" component={OutfitDetails} />
      <Stack.Screen name="AddLookbook" component={AddLookbook} />
      <Stack.Screen name="LookbookDetails" component={LookbookDetails} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
