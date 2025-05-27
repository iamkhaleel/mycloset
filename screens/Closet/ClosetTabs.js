import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MyCloset from './MyCloset';
import Suggested from './Suggested';

const ClosetTabs = () => {
  const [activeTab, setActiveTab] = useState('mycloset');

  return (
    <View style={{flex: 1}}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('mycloset')}
          style={[styles.tab, activeTab === 'mycloset' && styles.activeTab]}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'mycloset' ? {color: '#fff'} : {color: '#000'},
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
              activeTab === 'suggested' ? {color: '#fff'} : {color: '#000'},
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10%',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#222',
  },
  tabText: {
    fontWeight: 'bold',
  },
});

export default ClosetTabs;
