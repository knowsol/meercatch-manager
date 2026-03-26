import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { getToken, getDeviceId, saveToken, saveDeviceId } from '../storage';
import { registerDevice, getMyDevice, setToken } from '../api/client';
import { COLORS } from '../constants/colors';

export default function SplashScreen({ navigation }) {
  const { setDeviceInfo } = useApp();

  useEffect(() => {
    async function initialize() {
      try {
        const storedToken = await getToken();

        if (storedToken) {
          setToken(storedToken);
          try {
            await getMyDevice();
            const storedDeviceId = await getDeviceId();
            setDeviceInfo(storedToken, storedDeviceId);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          } catch (verifyError) {
            // Token invalid, re-register
            await registerNewDevice();
          }
        } else {
          await registerNewDevice();
        }
      } catch (error) {
        Alert.alert('오류', '초기화 중 오류가 발생했습니다: ' + error.message);
      }
    }

    async function registerNewDevice() {
      const result = await registerDevice();
      const { deviceId, deviceToken } = result;
      await saveToken(deviceToken);
      await saveDeviceId(deviceId);
      setToken(deviceToken);
      setDeviceInfo(deviceToken, deviceId);
      navigation.reset({ index: 0, routes: [{ name: 'ModeSelect' }] });
    }

    initialize();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🔍 Meercatch</Text>
        <Text style={styles.subtitle}>유해 콘텐츠 차단 서비스</Text>
        <ActivityIndicator size="large" color="#ffffff" style={styles.spinner} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 48,
  },
  spinner: {
    marginTop: 16,
  },
});
