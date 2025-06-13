import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNaviagtor';
import RootStackNavigator from './navigation/RootStackNavigator';
import {AuthProvider, useAuth} from './contexts/AuthContext';

function RootNavigation() {
  const {user, loading} = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <RootStackNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
