import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDetections } from '../api/client';
import { COLORS } from '../constants/colors';
import NotificationModal from '../components/NotificationModal';

const LEVEL_ORDER = ['NONE', 'GUIDE', 'CAUTION', 'WARNING'];

function calculateLevel(weekCount) {
  if (weekCount === 0) return 'NONE';
  if (weekCount === 1) return 'GUIDE';
  if (weekCount <= 4) return 'CAUTION';
  return 'WARNING';
}

function isThisWeek(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}

function isToday(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const LEVEL_STATUS = {
  NONE: { bg: COLORS.NONE, message: '안전한 상태입니다', icon: '✅' },
  GUIDE: { bg: COLORS.GUIDE, message: '주의가 필요합니다', icon: '⚠️' },
  CAUTION: { bg: COLORS.CAUTION, message: '사용을 줄여주세요', icon: '🔶' },
  WARNING: { bg: COLORS.WARNING, message: '즉시 중단하세요', icon: '🚨' },
};

const LEVEL_LABEL = {
  NONE: '안전',
  GUIDE: '주의',
  CAUTION: '경고',
  WARNING: '위험',
};

export default function HomeScreen({ navigation }) {
  const [detections, setDetections] = useState([]);
  const [level, setLevel] = useState('NONE');
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  const loadDetections = useCallback(async () => {
    try {
      const data = await getDetections();
      const list = Array.isArray(data) ? data : data.detections || [];
      setDetections(list);

      const weekItems = list.filter((d) => isThisWeek(d.detectedAt || d.createdAt));
      const todayItems = list.filter((d) => isToday(d.detectedAt || d.createdAt));

      const newLevel = calculateLevel(weekItems.length);
      setLevel(newLevel);
      setTodayCount(todayItems.length);
      setTotalCount(list.length);

      if (newLevel !== 'NONE' && !modalDismissed) {
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('오류', '탐지 기록을 불러오지 못했습니다: ' + error.message);
    }
  }, [modalDismissed]);

  useEffect(() => {
    loadDetections();
  }, [loadDetections]);

  async function onRefresh() {
    setRefreshing(true);
    await loadDetections();
    setRefreshing(false);
  }

  function handleDismissModal() {
    setModalVisible(false);
    setModalDismissed(true);
  }

  const statusConfig = LEVEL_STATUS[level];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.topBar, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.appTitle}>🔍 Meercatch</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: statusConfig.bg }]}>
          <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
          <Text style={styles.statusMessage}>{statusConfig.message}</Text>
        </View>

        {/* Main Status Card */}
        <View style={styles.mainCard}>
          <View style={[styles.levelBadgeLarge, { backgroundColor: statusConfig.bg }]}>
            <Text style={styles.levelBadgeLargeText}>{LEVEL_LABEL[level]}</Text>
          </View>
          <Text style={styles.totalCountLabel}>누적 탐지</Text>
          <Text style={styles.totalCountValue}>{totalCount}건</Text>
          <View style={styles.divider} />
          <Text style={styles.todayText}>오늘 탐지: {todayCount}건</Text>
        </View>

        {/* Level Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>탐지 레벨 기준 (이번 주)</Text>
          {LEVEL_ORDER.map((lv) => (
            <View key={lv} style={styles.infoRow}>
              <View style={[styles.infoColorDot, { backgroundColor: COLORS[lv] }]} />
              <Text style={[styles.infoLv, lv === level && styles.infoLvActive]}>
                {LEVEL_LABEL[lv]}
              </Text>
              <Text style={styles.infoDesc}>
                {lv === 'NONE' && '0건'}
                {lv === 'GUIDE' && '1건'}
                {lv === 'CAUTION' && '2~4건'}
                {lv === 'WARNING' && '5건 이상'}
              </Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DetectionList')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>탐지 기록</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={[styles.actionText, styles.actionTextSecondary]}>설정</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NotificationModal
        visible={modalVisible}
        level={level}
        onDismiss={handleDismissModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshBtn: {
    padding: 4,
  },
  refreshIcon: {
    fontSize: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  statusMessage: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mainCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  levelBadgeLarge: {
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginBottom: 16,
  },
  levelBadgeLargeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalCountLabel: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  totalCountValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  todayText: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  infoLv: {
    fontSize: 14,
    color: COLORS.subtext,
    width: 40,
  },
  infoLvActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  infoDesc: {
    fontSize: 13,
    color: COLORS.subtext,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionTextSecondary: {
    color: COLORS.text,
  },
});
