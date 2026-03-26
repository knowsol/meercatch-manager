import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDetection, reportFalsePositive } from '../api/client';
import { COLORS } from '../constants/colors';

const LEVEL_LABEL = {
  NONE: '없음',
  GUIDE: '주의',
  CAUTION: '경고',
  WARNING: '위험',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function DetectionDetailScreen({ navigation, route }) {
  const { detectionId } = route.params;
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [reporting, setReporting] = useState(false);

  const loadDetection = useCallback(async () => {
    try {
      const data = await getDetection(detectionId);
      setDetection(data);
    } catch (error) {
      Alert.alert('오류', '탐지 상세를 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [detectionId]);

  useEffect(() => {
    loadDetection();
  }, [loadDetection]);

  async function handleReport() {
    if (!reportReason.trim()) {
      Alert.alert('알림', '신고 이유를 입력해 주세요.');
      return;
    }
    setReporting(true);
    try {
      await reportFalsePositive(detectionId, {
        reportReason: reportReason.trim(),
        note: reportNote.trim() || undefined,
      });
      setReportModalVisible(false);
      Alert.alert('완료', '오탐 신고가 접수되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      if (error.status === 409) {
        Alert.alert('알림', '이미 신고된 탐지입니다.');
      } else {
        Alert.alert('오류', '신고 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setReporting(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      </SafeAreaView>
    );
  }

  if (!detection) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>탐지 정보를 불러올 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const level = detection.notificationLevel || 'NONE';
  const levelColor = COLORS[level] || COLORS.subtext;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Level Badge */}
        <View style={[styles.levelBanner, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBannerText}>{LEVEL_LABEL[level]} 레벨</Text>
        </View>

        {/* Detail Fields */}
        <View style={styles.card}>
          <DetailRow label="탐지 유형" value={detection.detectionType || '-'} />
          {detection.appName ? (
            <DetailRow label="앱 이름" value={detection.appName} />
          ) : null}
          {detection.url ? (
            <DetailRow label="URL" value={detection.url} />
          ) : null}
          <DetailRow
            label="탐지 시각"
            value={formatDate(detection.detectedAt || detection.createdAt)}
          />
          <DetailRow label="레벨" value={LEVEL_LABEL[level]} valueColor={levelColor} />
        </View>

        {detection.description ? (
          <View style={styles.card}>
            <Text style={styles.descLabel}>설명</Text>
            <Text style={styles.descText}>{detection.description}</Text>
          </View>
        ) : null}

        {/* Report Button */}
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => setReportModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.reportButtonText}>오탐 신고</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>오탐 신고</Text>
            <Text style={styles.modalLabel}>신고 이유 *</Text>
            <TextInput
              style={styles.modalInput}
              value={reportReason}
              onChangeText={setReportReason}
              placeholder="오탐 이유를 입력하세요"
              placeholderTextColor={COLORS.subtext}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.modalLabel}>추가 메모 (선택)</Text>
            <TextInput
              style={styles.modalInput}
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="추가 메모 (선택)"
              placeholderTextColor={COLORS.subtext}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setReportModalVisible(false)}
                disabled={reporting}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, reporting && styles.btnDisabled]}
                onPress={handleReport}
                disabled={reporting}
              >
                {reporting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitText}>신고하기</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, valueColor }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueColor && { color: valueColor, fontWeight: '600' }]}>
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: COLORS.subtext,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: COLORS.text,
    flex: 2,
    textAlign: 'right',
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
  errorText: {
    textAlign: 'center',
    color: COLORS.subtext,
    marginTop: 60,
    fontSize: 15,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  levelBanner: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBannerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  descLabel: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 8,
    fontWeight: '600',
  },
  descText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  reportButton: {
    borderWidth: 1.5,
    borderColor: COLORS.WARNING,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  reportButtonText: {
    color: COLORS.WARNING,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 13,
    color: COLORS.subtext,
    marginBottom: 6,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#f8fafc',
    marginBottom: 14,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    color: COLORS.subtext,
  },
  modalSubmitBtn: {
    flex: 1,
    backgroundColor: COLORS.WARNING,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
