import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import ClosetTabs from '../screens/Closet/ClosetTabs';
import Outfits from '../screens/Outfits/Outfits';
import Lookbooks from '../screens/Lookbooks/Lookbooks';
import Settings from '../screens/Settings/Settings';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Closet"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Closet') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Outfits') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          } else if (route.name === 'Lookbooks') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Closet" component={ClosetTabs} />
      <Tab.Screen name="Outfits" component={Outfits} />
      <Tab.Screen name="Lookbooks" component={Lookbooks} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
