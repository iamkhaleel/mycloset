import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Outfits from '../screens/Outfits/Outfits';
import OutfitDetails from '../screens/Outfits/OutfitDetails';
import AddOutfit from '../screens/Outfits/AddOutfit';

const Stack = createStackNavigator();

const OutfitsStack = () => {
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
      <Stack.Screen name="OutfitsMain" component={Outfits} />
      <Stack.Screen name="OutfitDetails" component={OutfitDetails} />
      <Stack.Screen name="AddOutfit" component={AddOutfit} />
    </Stack.Navigator>
  );
};

export default OutfitsStack;
