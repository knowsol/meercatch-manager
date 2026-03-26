import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { startInstallation, selectMode } from '../api/client';
import { saveMode } from '../storage';
import { COLORS } from '../constants/colors';

export default function ModeSelectScreen({ navigation }) {
  const { setMode } = useApp();
  const [loading, setLoading] = useState(false);

  async function handleSelect(mode) {
    setLoading(true);
    try {
      await startInstallation();
      await selectMode(mode);
      await saveMode(mode);
      setMode(mode);

      if (mode === 'SIMPLE') {
        navigation.navigate('PolicySetup');
      } else {
        navigation.navigate('SchoolSelect');
      }
    } catch (error) {
      Alert.alert('오류', '설정 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>미어캐치 시작하기</Text>
        <Text style={styles.subtitle}>사용 방식을 선택해 주세요</Text>

        <TouchableOpacity
          style={[styles.card, loading && styles.cardDisabled]}
          onPress={() => handleSelect('SIMPLE')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>👤</Text>
          <Text style={styles.cardTitle}>심플형 시작</Text>
          <Text style={styles.cardDesc}>개인 사용 · 직접 설정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardManaged, loading && styles.cardDisabled]}
          onPress={() => handleSelect('MANAGED')}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>🏫</Text>
          <Text style={[styles.cardTitle, styles.cardTitleManaged]}>매니저 관리형 시작</Text>
          <Text style={[styles.cardDesc, styles.cardDescManaged]}>
            학교/기관 관리 · 자동 정책 적용
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.subtext,
    marginBottom: 48,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 28,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardManaged: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardTitleManaged: {
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
  },
  cardDescManaged: {
    color: 'rgba(255,255,255,0.8)',
  },
  spinner: {
    marginTop: 24,
  },
});
