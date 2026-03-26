import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';

const LEVEL_CONFIG = {
  GUIDE: {
    color: COLORS.GUIDE,
    bgColor: '#eff6ff',
    icon: '⚠️',
    title: '주의가 필요합니다',
    message: '유해 콘텐츠가 감지되었습니다.\n사용에 주의해 주세요.',
    buttonText: '확인',
  },
  CAUTION: {
    color: COLORS.CAUTION,
    bgColor: '#fefce8',
    icon: '🔶',
    title: '반복 사용이 감지되었습니다',
    message: '반복 사용이 감지되었습니다\n사용을 줄여주세요',
    buttonText: '알겠습니다',
  },
  WARNING: {
    color: COLORS.WARNING,
    bgColor: '#fef2f2',
    icon: '🚨',
    title: '위험한 사용이 지속되고 있습니다',
    message: '위험한 사용이 지속되고 있습니다\n즉시 중단하세요',
    buttonText: '즉시 중단',
  },
};

export default function NotificationModal({ visible, level, onDismiss }) {
  const config = LEVEL_CONFIG[level];
  if (!config) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { borderTopColor: config.color, backgroundColor: config.bgColor }]}>
          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={[styles.title, { color: config.color }]}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: config.color }]}
            onPress={onDismiss}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{config.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modal: {
    width: '100%',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
