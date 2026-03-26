import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@meercatch/deviceToken',
  DEVICE_ID: '@meercatch/deviceId',
  MODE: '@meercatch/mode',
  DETECTION_ENABLED: '@meercatch/detectionEnabled',
  SENSITIVITY: '@meercatch/sensitivity',
  NOTIFICATION_ENABLED: '@meercatch/notificationEnabled',
};

export async function saveToken(token) {
  await AsyncStorage.setItem(KEYS.TOKEN, token);
}

export async function getToken() {
  return AsyncStorage.getItem(KEYS.TOKEN);
}

export async function saveDeviceId(id) {
  await AsyncStorage.setItem(KEYS.DEVICE_ID, String(id));
}

export async function getDeviceId() {
  return AsyncStorage.getItem(KEYS.DEVICE_ID);
}

export async function saveMode(mode) {
  await AsyncStorage.setItem(KEYS.MODE, mode);
}

export async function getMode() {
  return AsyncStorage.getItem(KEYS.MODE);
}

export async function saveDetectionEnabled(enabled) {
  await AsyncStorage.setItem(KEYS.DETECTION_ENABLED, JSON.stringify(enabled));
}

export async function getDetectionEnabled() {
  const val = await AsyncStorage.getItem(KEYS.DETECTION_ENABLED);
  return val === null ? true : JSON.parse(val);
}

export async function saveSensitivity(sensitivity) {
  await AsyncStorage.setItem(KEYS.SENSITIVITY, sensitivity);
}

export async function getSensitivity() {
  const val = await AsyncStorage.getItem(KEYS.SENSITIVITY);
  return val === null ? '중간' : val;
}

export async function saveNotificationEnabled(enabled) {
  await AsyncStorage.setItem(KEYS.NOTIFICATION_ENABLED, JSON.stringify(enabled));
}

export async function getNotificationEnabled() {
  const val = await AsyncStorage.getItem(KEYS.NOTIFICATION_ENABLED);
  return val === null ? true : JSON.parse(val);
}

export async function clearAll() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
