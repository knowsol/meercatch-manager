import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDetections } from '../api/client';
import DetectionItem from '../components/DetectionItem';
import { COLORS } from '../constants/colors';

export default function DetectionListScreen({ navigation }) {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDetections = useCallback(async () => {
    try {
      const data = await getDetections();
      const list = Array.isArray(data) ? data : data.detections || [];
      setDetections(list);
    } catch (error) {
      Alert.alert('오류', '탐지 기록을 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDetections();
  }, [loadDetections]);

  async function onRefresh() {
    setRefreshing(true);
    await loadDetections();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    return (
      <DetectionItem
        detection={item}
        onPress={() => navigation.navigate('DetectionDetail', { detectionId: item.id })}
      />
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
      <FlatList
        data={detections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>탐지 기록이 없습니다</Text>
          </View>
        }
        ListFooterComponent={
          detections.length > 0 ? (
            <Text style={styles.footerText}>최대 100건까지 표시됩니다</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.subtext,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.subtext,
    paddingVertical: 12,
  },
});
