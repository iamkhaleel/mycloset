import React from 'react';
import * as Animatable from 'react-native-animatable';
import {ViewStyle} from 'react-native';

/**
 * AnimatedScreen
 *
 * Props:
 * - animation: string (Animatable animation name, e.g. 'fadeInUp')
 * - duration: number (ms)
 * - style: ViewStyle
 * - children: React.ReactNode
 */
const AnimatedScreen = ({
  animation = 'fadeInUp',
  duration = 800,
  style = {},
  children,
  ...rest
}) => {
  return (
    <Animatable.View
      animation={animation}
      duration={duration}
      style={[{flex: 1}, style]}
      useNativeDriver
      {...rest}>
      {children}
    </Animatable.View>
  );
};

export default AnimatedScreen;
