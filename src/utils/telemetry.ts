import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const getClientMeta = async (): Promise<{ device?: string; ipAddress?: string }> => {
  let ipAddress: string | undefined = undefined;
  
  // Best effort IP fetch
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (response.ok) {
        const data = await response.json();
        ipAddress = data.ip;
    }
  } catch (e) {
    console.log('Failed to fetch public IP (this is normal if offline or adblocked)', e);
  }

  let deviceName = 'Unknown Device';
  
  if (Platform.OS === 'web') {
      deviceName = 'Web Browser';
  } else {
      if (Device.modelName) {
          deviceName = Device.modelName;
      } else if (Device.brand) {
          deviceName = `${Device.brand} Device`;
      } else {
          deviceName = `${Platform.OS} Device`;
      }
  }

  return { device: deviceName, ipAddress };
};
