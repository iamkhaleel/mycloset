import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';

const DEFAULT_LOADING = require('../assets/animations/Materialwaveloading.json');

export const LottieLoader = ({size = 64, source = DEFAULT_LOADING, style}) => (
  <View style={[styles.container, {width: size, height: size}, style]}>
    <LottieView source={source} autoPlay loop style={styles.animation} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export {DEFAULT_LOADING};
