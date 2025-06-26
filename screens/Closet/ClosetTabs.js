import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MyCloset from './MyCloset';
import Suggested from './Suggested';

const ClosetTabs = () => {
  const [activeTab, setActiveTab] = useState('mycloset');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('mycloset')}
          style={[styles.tab, activeTab === 'mycloset' && styles.activeTab]}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'mycloset' ? {color: '#222831'} : {color: '#fff'},
            ]}>
            My Closet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('suggested')}
          style={[styles.tab, activeTab === 'suggested' && styles.activeTab]}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'suggested' ? {color: '#222831'} : {color: '#fff'},
            ]}>
            Suggested
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'mycloset' ? <MyCloset /> : <Suggested />}
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
});

export default ClosetTabs;
