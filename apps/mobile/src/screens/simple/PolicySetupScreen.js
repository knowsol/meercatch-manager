import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeInstallation } from '../../api/client';
import {
  saveDetectionEnabled,
  saveSensitivity,
  saveNotificationEnabled,
} from '../../storage';
import { COLORS } from '../../constants/colors';

const SENSITIVITY_OPTIONS = ['낮음', '중간', '높음'];

export default function PolicySetupScreen({ navigation }) {
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState('중간');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try {
      await saveDetectionEnabled(detectionEnabled);
      await saveSensitivity(sensitivity);
      await saveNotificationEnabled(notificationEnabled);
      await completeInstallation();
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      Alert.alert('오류', '설치 완료 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>정책 설정</Text>
        <Text style={styles.subtitle}>탐지 방식을 설정해 주세요</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>탐지 활성화</Text>
            <Switch
              value={detectionEnabled}
              onValueChange={setDetectionEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>민감도</Text>
          <View style={styles.segmented}>
            {SENSITIVITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.segmentButton,
                  sensitivity === opt && styles.segmentButtonActive,
                ]}
                onPress={() => setSensitivity(opt)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    sensitivity === opt && styles.segmentTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>알림 켜기</Text>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>시작하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.subtext,
    marginBottom: 32,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
    fontWeight: '500',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 14,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
