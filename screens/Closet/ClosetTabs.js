import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MyCloset from './MyCloset';

const ClosetTabs = () => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <View style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>My Closet</Text>
        </View>
      </View>
      <MyCloset />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '15%',
    backgroundColor: '#222831',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#2D333B',
  },
  activeTab: {
    backgroundColor: '#FFD66B',
  },
  tabText: {
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#222831',
  },
});

export default ClosetTabs;
