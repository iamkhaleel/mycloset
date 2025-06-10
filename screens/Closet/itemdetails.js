import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';

const ItemDetails = ({route}) => {
  const {item} = route.params; // Extract the item from navigation params
  const navigation = useNavigation();

  // Format the timestamp to a readable date
  const formatDate = timestamp => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date();
    return date.toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Item Image */}
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
        ) : item.imageBase64 ? (
          <Image
            source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
            style={styles.itemImage}
          />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <Ionicons name="image" size={60} color="#ccc" />
          </View>
        )}
      </View>

      {/* Item Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.name || 'Unnamed Item'}</Text>
        <Text style={styles.itemCategory}>
          Category: {item.category || 'N/A'}
        </Text>

        {item.color && (
          <Text style={styles.itemAttribute}>
            Color: {item.color.name || item.color}
          </Text>
        )}
        {item.brand && (
          <Text style={styles.itemAttribute}>Brand: {item.brand}</Text>
        )}
        {item.price && (
          <Text style={styles.itemAttribute}>Price: ${item.price}</Text>
        )}
        {item.size && (
          <Text style={styles.itemAttribute}>Size: {item.size}</Text>
        )}
        {item.material && (
          <Text style={styles.itemAttribute}>Material: {item.material}</Text>
        )}
        {item.notes && (
          <Text style={styles.itemAttribute}>Notes: {item.notes}</Text>
        )}
        {item.timestamp && (
          <Text style={styles.itemAttribute}>
            Date Added: {formatDate(item.timestamp)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  itemImage: {
    width: '90%',
    height: 300,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCategory: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  itemAttribute: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
});

export default ItemDetails;
