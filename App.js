import React from 'react';
import {StatusBar} from 'react-native-bars';
import AppNavigator from './navigation/AppNaviagtor';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
