import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { getMyAffiliation } from '../api/client';
import {
  clearAll,
  getDetectionEnabled,
  saveDetectionEnabled,
  getSensitivity,
  saveSensitivity,
  getNotificationEnabled,
  saveNotificationEnabled,
} from '../storage';
import { COLORS } from '../constants/colors';

const SENSITIVITY_OPTIONS = ['낮음', '중간', '높음'];

export default function SettingsScreen({ navigation }) {
  const { state, setMode, setAffiliation, resetApp } = useApp();
  const { mode } = state;

  const [detectionEnabled, setDetectionEnabledState] = useState(true);
  const [sensitivity, setSensitivityState] = useState('중간');
  const [notificationEnabled, setNotificationEnabledState] = useState(true);
  const [affiliation, setAffiliationState] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      const [de, sens, ne] = await Promise.all([
        getDetectionEnabled(),
        getSensitivity(),
        getNotificationEnabled(),
      ]);
      setDetectionEnabledState(de);
      setSensitivityState(sens);
      setNotificationEnabledState(ne);

      if (mode === 'MANAGED') {
        try {
          const aff = await getMyAffiliation();
          setAffiliationState(aff);
          setAffiliation(aff);
        } catch {
          // ignore affiliation fetch error
        }
      }
    } catch (error) {
      Alert.alert('오류', '설정을 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [mode, setAffiliation]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleToggleDetection(val) {
    setDetectionEnabledState(val);
    await saveDetectionEnabled(val);
  }

  async function handleSensitivity(val) {
    setSensitivityState(val);
    await saveSensitivity(val);
  }

  async function handleToggleNotification(val) {
    setNotificationEnabledState(val);
    await saveNotificationEnabled(val);
  }

  function confirmReset() {
    Alert.alert(
      '앱 초기화',
      '모든 설정이 초기화됩니다. 계속하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            resetApp();
            navigation.reset({ index: 0, routes: [{ name: 'ModeSelect' }] });
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Mode badge */}
        <View style={styles.modeBadgeRow}>
          <View style={[styles.modeBadge, mode === 'MANAGED' && styles.modeBadgeManaged]}>
            <Text style={styles.modeBadgeText}>
              {mode === 'SIMPLE' ? '심플형' : '매니저 관리형'}
            </Text>
          </View>
        </View>

        {mode === 'SIMPLE' && (
          <>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>탐지 활성화</Text>
                <Switch
                  value={detectionEnabled}
                  onValueChange={handleToggleDetection}
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
                    onPress={() => handleSensitivity(opt)}
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
                  onValueChange={handleToggleNotification}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </>
        )}

        {mode === 'MANAGED' && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>소속 정보</Text>
            {affiliation ? (
              <>
                <InfoRow label="학교" value={affiliation.schoolName || '-'} />
                <InfoRow label="학년" value={affiliation.gradeName || '-'} />
                <InfoRow label="반" value={affiliation.className || '-'} />
                <InfoRow label="번호" value={String(affiliation.studentNumber || '-')} />
                {affiliation.studentName ? (
                  <InfoRow label="이름" value={affiliation.studentName} />
                ) : null}
              </>
            ) : (
              <Text style={styles.noAffText}>소속 정보가 없습니다.</Text>
            )}
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => navigation.navigate('SchoolSelect')}
              activeOpacity={0.8}
            >
              <Text style={styles.changeBtnText}>소속 변경</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={confirmReset}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>앱 초기화</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },
  modeBadgeRow: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modeBadge: {
    backgroundColor: COLORS.GUIDE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modeBadgeManaged: {
    backgroundColor: COLORS.primary,
  },
  modeBadgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
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
    fontWeight: '600',
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
  noAffText: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
  },
  changeBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  changeBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  resetButton: {
    borderWidth: 1.5,
    borderColor: COLORS.WARNING,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: COLORS.WARNING,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
