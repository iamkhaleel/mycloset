import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const {width} = Dimensions.get('window');

const getAlertType = title => {
  const normalized = (title || '').toLowerCase();
  if (normalized === 'error') {
    return 'error';
  }
  if (normalized === 'success') {
    return 'success';
  }
  if (normalized === 'partial success') {
    return 'warning';
  }
  return 'default';
};

const TYPE_CONFIG = {
  error: {icon: 'alert-circle', color: '#FF6B6B'},
  success: {icon: 'checkmark-circle', color: '#4ECB71'},
  warning: {icon: 'warning', color: '#FFD66B'},
  default: {icon: 'information-circle', color: '#FFD66B'},
};

const CustomAlert = ({visible, title, message, buttons, onDismiss}) => {
  const alertType = getAlertType(title);
  const typeConfig = TYPE_CONFIG[alertType];

  const resolvedButtons =
    buttons && buttons.length > 0
      ? buttons
      : [{text: 'OK', style: 'default'}];

  const handlePress = button => {
    onDismiss();
    button.onPress?.();
  };

  const isMultiButton = resolvedButtons.length > 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, {backgroundColor: `${typeConfig.color}22`}]}>
            <Ionicons name={typeConfig.icon} size={32} color={typeConfig.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View
            style={[
              styles.buttonRow,
              isMultiButton && styles.buttonRowMulti,
            ]}>
            {resolvedButtons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';

              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  style={[
                    styles.button,
                    isMultiButton && styles.buttonMulti,
                    isDestructive && styles.destructiveButton,
                    isCancel && styles.cancelButton,
                    !isDestructive && !isCancel && styles.primaryButton,
                  ]}
                  onPress={() => handlePress(button)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.buttonText,
                      isDestructive && styles.destructiveButtonText,
                      isCancel && styles.cancelButtonText,
                      !isDestructive && !isCancel && styles.primaryButtonText,
                    ]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: '#2D333B',
    borderRadius: 20,
    padding: 24,
    width: width * 0.88,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#B0B8C1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonRow: {
    width: '100%',
    gap: 10,
  },
  buttonRowMulti: {
    flexDirection: 'row',
  },
  button: {
    minHeight: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonMulti: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#FFD66B',
  },
  primaryButtonText: {
    color: '#222831',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#3A424C',
  },
  cancelButtonText: {
    color: '#B0B8C1',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButton: {
    backgroundColor: '#FF6B6B',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default CustomAlert;
