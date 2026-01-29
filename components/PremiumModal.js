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
import ResponsiveButton from './Button';

const {width, height} = Dimensions.get('window');

const PremiumModal = ({visible, onClose, onUpgrade, featureName}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFD66B" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="star" size={40} color="#FFD66B" />
          </View>

          <Text style={styles.title}>Premium Feature</Text>
          <Text style={styles.description}>
            {featureName} is a premium feature. Upgrade to MyCloset Premium to
            unlock this and many other exclusive features!
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD66B" />
              <Text style={styles.featureText}>Unlimited Items</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD66B" />
              <Text style={styles.featureText}>Smart Outfit Suggestions</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD66B" />
              <Text style={styles.featureText}>Ad-Free Experience</Text>
            </View>
          </View>

          <ResponsiveButton
            title="Upgrade to Premium"
            onPress={onUpgrade}
            buttonStyle={styles.upgradeButton}
            textStyle={styles.upgradeButtonText}
          />

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2D333B',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFD66B',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#eee',
    marginBottom: 20,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#eee',
  },
  upgradeButton: {
    backgroundColor: '#FFD66B',
    marginBottom: 30,
    width: '70%',
  },
  upgradeButtonText: {
    color: '#222831',
  },
  cancelText: {
    textAlign: 'center',
    color: '#eee',
    padding: 10,
  },
});

export default PremiumModal;
