import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const ResponsiveButton = ({title, onPress, buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[styles.buttonText, textStyle]}
        adjustsFontSizeToFit
        numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    width: width * 0.9, // 90% of screen width
    minHeight: Platform.select({
      ios: 50,
      android: 50,
      default: 50,
    }),
    backgroundColor: '#272727',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    alignSelf: 'center', // center button horizontally
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.select({
      ios: 18,
      android: 16,
      default: 18,
    }),
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false, // removes extra padding on Android
  },
});

export default ResponsiveButton;
