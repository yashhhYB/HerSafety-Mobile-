import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
  apple: 'appl_YOUR_APPLE_API_KEY_HERE',
  google: 'goog_YOUR_GOOGLE_API_KEY_HERE',
};

export const initializeRevenueCat = async () => {
  if (Platform.OS === 'web') return; // RevenueCat does not support web via RN sdk
  
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  
  try {
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: API_KEYS.apple });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: API_KEYS.google });
    }
    console.log('RevenueCat initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
};
