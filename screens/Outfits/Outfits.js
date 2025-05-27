import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const Outfits = () => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text>Your Outfits</Text>
      </View>

      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingBtn}>
        <Text style={styles.floatingText}> + Add Outfits</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Ensure absolute positioning works
  },

  filterBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  filterBtn: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 12,
    height: 35,
  },

  activeFilter: {
    backgroundColor: "#000",
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  floatingBtn: {
    position: "absolute",
    bottom: 40,
    right: 25, // Position at the bottom-left
    backgroundColor: "#000",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  floatingText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Outfits;
