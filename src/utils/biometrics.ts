import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SECURE_STORE_KEYS = {
  EMAIL: 'auth_email',
  PASSWORD: 'auth_password',
  BIOMETRIC_ENABLED: 'auth_biometric_enabled',
};

export const biometrics = {
  /**
   * Check if the device has biometric hardware and if it's enrolled
   */
  async checkAvailability() {
    if (Platform.OS === 'web') return { available: false, enrolled: false };

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    return {
      available: hasHardware,
      enrolled: isEnrolled,
    };
  },

  /**
   * Authenticate the user with biometrics
   */
  async authenticate(promptMessage: string = 'Authenticate to login') {
    if (Platform.OS === 'web') throw new Error('Biometrics not supported on web');

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });

    return result.success;
  },

  /**
   * Save credentials securely
   */
  async saveCredentials(email: string, password: string) {
    if (Platform.OS === 'web') return;

    await SecureStore.setItemAsync(SECURE_STORE_KEYS.EMAIL, email);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.PASSWORD, password);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.BIOMETRIC_ENABLED, 'true');
  },

  /**
   * Get saved credentials
   */
  async getCredentials() {
    if (Platform.OS === 'web') return null;

    const email = await SecureStore.getItemAsync(SECURE_STORE_KEYS.EMAIL);
    const password = await SecureStore.getItemAsync(SECURE_STORE_KEYS.PASSWORD);
    const enabled = await SecureStore.getItemAsync(SECURE_STORE_KEYS.BIOMETRIC_ENABLED);

    if (email && password && enabled === 'true') {
      return { email, password };
    }

    return null;
  },

  /**
   * Clear saved credentials
   */
  async clearCredentials() {
    if (Platform.OS === 'web') return;

    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.EMAIL);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.PASSWORD);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.BIOMETRIC_ENABLED);
  },

  /**
   * Check if biometrics is enabled in app settings
   */
  async isEnabled() {
    if (Platform.OS === 'web') return false;
    const enabled = await SecureStore.getItemAsync(SECURE_STORE_KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  }
};
