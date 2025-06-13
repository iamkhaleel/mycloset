import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@auth_user';

export const saveUser = async user => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString(),
    };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error removing user:', error);
    return false;
  }
};

export const updateUserData = async updates => {
  try {
    const currentUser = await getUser();
    if (currentUser) {
      const updatedUser = {...currentUser, ...updates};
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};
