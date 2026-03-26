import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGrades } from '../../api/client';
import { COLORS } from '../../constants/colors';

export default function GradeSelectScreen({ navigation, route }) {
  const { schoolId, schoolName } = route.params;
  const [grades, setGrades] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadGrades = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGrades(schoolId);
      setGrades(Array.isArray(data) ? data : data.grades || []);
    } catch (error) {
      Alert.alert('오류', '학년 목록을 불러오지 못했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  function handleNext() {
    if (!selectedId) {
      Alert.alert('알림', '학년을 선택해 주세요.');
      return;
    }
    const grade = grades.find((g) => g.id === selectedId);
    navigation.navigate('ClassSelect', {
      schoolId,
      gradeId: selectedId,
      gradeName: grade?.name || '',
    });
  }

  function renderItem({ item }) {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.gradeButton, selected && styles.gradeButtonSelected]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.75}
      >
        <Text style={[styles.gradeText, selected && styles.gradeTextSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>{schoolName}</Text>
        <Text style={styles.title}>학년 선택</Text>
        <Text style={styles.subtitle}>학년을 선택해 주세요</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
      ) : (
        <FlatList
          data={grades}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <Text style={styles.emptyText}>학년 정보가 없습니다.</Text>
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
  schoolName: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
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
  },
  grid: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  gradeButton: {
    flex: 1,
    maxWidth: '30%',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  gradeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  gradeText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  gradeTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
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
