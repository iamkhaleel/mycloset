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
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#222831',
          borderTopColor: '#3B4048',
          height: 100,
          paddingBottom: '15%',
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FFD66B',
        tabBarInactiveTintColor: '#eee',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Closets"
        component={ClosetTabs}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="shirt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Outfits"
        component={Outfits}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lookbooks"
        component={Lookbooks}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
