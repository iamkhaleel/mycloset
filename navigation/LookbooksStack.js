import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Lookbooks from '../screens/Lookbooks/Lookbooks';
import LookbookDetails from '../screens/Lookbooks/LookbookDetails';
import AddLookbook from '../screens/Lookbooks/AddLookbook';

const Stack = createStackNavigator();

const LookbooksStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#222831'},
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        },
        cardStyleInterpolator: ({current, next, layouts}) => {
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
              backgroundColor: '#222831', // Ensure dark background during transition
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          };
        },
      }}>
      <Stack.Screen name="LookbooksMain" component={Lookbooks} />
      <Stack.Screen 
        name="LookbookDetails" 
        component={LookbookDetails}
        options={{
          cardStyle: {backgroundColor: '#222831'},
          cardStyleInterpolator: ({current, layouts}) => {
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
                backgroundColor: '#222831', // Ensure dark background during transition
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
        }}
      />
      <Stack.Screen name="AddLookbook" component={AddLookbook} />
    </Stack.Navigator>
  );
};

export default LookbooksStack;
