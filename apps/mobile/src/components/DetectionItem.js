import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

export default function DetectionItem({ detection, onPress }) {
  const level = detection.notificationLevel || 'NONE';
  const badgeColor = COLORS[level] || COLORS.subtext;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.left}>
        <Text style={styles.dateText}>{formatDate(detection.detectedAt || detection.createdAt)}</Text>
        <Text style={styles.typeText} numberOfLines={1}>
          {detection.detectionType || '알 수 없음'}
        </Text>
        {detection.appName ? (
          <Text style={styles.subText} numberOfLines={1}>{detection.appName}</Text>
        ) : null}
      </View>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{LEVEL_LABEL[level] || level}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 48,
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
