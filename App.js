import React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AppNavigator from './navigation/AppNaviagtor';
import RootStackNavigator from './navigation/RootStackNavigator';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import {AlertProvider} from './contexts/AlertContext';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#222831',
  },
};

function RootNavigation() {
  const {user, loading} = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <RootStackNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <RootNavigation />
      </AlertProvider>
    </AuthProvider>
  );
}
