import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {LottieLoader} from './LottieLoader';

export const LoadingOverlay = ({visible, message, size = 80}) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}>
      <View style={styles.container}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={Platform.OS === 'ios' ? 12 : 18}
          reducedTransparencyFallbackColor="rgba(34, 40, 49, 0.92)"
        />
        <View style={styles.content}>
          <LottieLoader size={size} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD66B',
    textAlign: 'center',
  },
});

export default LoadingOverlay;
