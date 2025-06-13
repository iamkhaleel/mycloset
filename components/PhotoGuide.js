import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const PhotoGuide = ({visible, onClose}) => {
  const tips = [
    {
      title: 'Good Lighting',
      description:
        'Take photos in a well-lit area, preferably with natural light. Avoid harsh shadows and direct sunlight.',
      icon: 'sunny-outline',
    },
    {
      title: 'Clean Background',
      description:
        'Use a plain, neutral background. A white wall or clean surface works best. This helps the background removal feature work better.',
      icon: 'image-outline',
    },
    {
      title: 'Proper Distance',
      description:
        'Keep the camera at a good distance to capture the entire item. For clothing, stand about 3-4 feet away.',
      icon: 'resize-outline',
    },
    {
      title: 'Item Position',
      description:
        'Lay clothes flat or hang them neatly. For shoes, place them side by side. For accessories, arrange them clearly.',
      icon: 'git-network-outline',
    },
    {
      title: 'Multiple Angles',
      description:
        'Take photos from different angles to show details, patterns, and textures clearly.',
      icon: 'camera-outline',
    },
    {
      title: 'Focus',
      description:
        'Ensure the item is in focus and the image is sharp. Tap on the screen to focus on the item.',
      icon: 'scan-outline',
    },
    {
      title: 'Avoid Blur',
      description:
        'Hold the camera steady or use a tripod. Avoid taking photos while moving.',
      icon: 'hand-left-outline',
    },
    {
      title: 'Color Accuracy',
      description:
        'Make sure the colors in the photo match the actual item. Avoid using filters or effects.',
      icon: 'color-palette-outline',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Photo Guide</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            <View style={styles.introSection}>
              <Text style={styles.introText}>
                Follow these tips to take the best photos of your clothing
                items:
              </Text>
            </View>

            {tips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <View style={styles.tipHeader}>
                  <Ionicons name={tip.icon} size={24} color="#000" />
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            ))}

            <View style={styles.exampleSection}>
              <Text style={styles.exampleTitle}>Example Photos</Text>
              <View style={styles.exampleContainer}>
                <View style={styles.exampleItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.exampleText}>Good Example</Text>
                  <Text style={styles.exampleDescription}>
                    Well-lit, clean background, proper distance
                  </Text>
                </View>
                <View style={styles.exampleItem}>
                  <Ionicons name="close-circle" size={20} color="#F44336" />
                  <Text style={styles.exampleText}>Poor Example</Text>
                  <Text style={styles.exampleDescription}>
                    Poor lighting, cluttered background, blurry
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tipSection}>
              <Text style={styles.tipTitle}>Pro Tips</Text>
              <View style={styles.proTips}>
                <Text style={styles.proTipText}>
                  • Use the "Remove Background" feature for cleaner results
                </Text>
                <Text style={styles.proTipText}>
                  • Take photos in the morning or evening for softer lighting
                </Text>
                <Text style={styles.proTipText}>
                  • Clean the item before taking photos
                </Text>
                <Text style={styles.proTipText}>
                  • Use a white or light-colored background for better results
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  introSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tipContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  tipDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginLeft: 36,
  },
  exampleSection: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  exampleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exampleItem: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#666',
  },
  tipSection: {
    padding: 16,
  },
  proTips: {
    marginTop: 8,
  },
  proTipText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default PhotoGuide;
