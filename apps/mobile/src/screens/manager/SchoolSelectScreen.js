import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSchools } from '../../api/client';
import { COLORS } from '../../constants/colors';

export default function SchoolSelectScreen({ navigation }) {
  const [schools, setSchools] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSchools = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSchools();
      setSchools(Array.isArray(data) ? data : data.schools || []);
    } catch (error) {
      Alert.alert('오류', '학교 목록을 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  function handleNext() {
    if (!selectedId) {
      Alert.alert('알림', '학교를 선택해 주세요.');
      return;
    }
    const school = schools.find((s) => s.id === selectedId);
    navigation.navigate('GradeSelect', { schoolId: selectedId, schoolName: school?.name || '' });
  }

  function renderItem({ item }) {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.item, selected && styles.itemSelected]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
        <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>학교 선택</Text>
        <Text style={styles.subtitle}>소속 학교를 선택해 주세요</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>학교 목록이 없습니다.</Text>
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedId && styles.buttonDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  itemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  itemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.subtext,
    marginTop: 40,
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
