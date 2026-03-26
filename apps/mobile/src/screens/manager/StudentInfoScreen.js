import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createAffiliation, completeInstallation } from '../../api/client';
import { useApp } from '../../context/AppContext';
import { COLORS } from '../../constants/colors';

const STUDENT_NUMBERS = Array.from({ length: 40 }, (_, i) => i + 1);

export default function StudentInfoScreen({ navigation, route }) {
  const { schoolId, gradeId, classId } = route.params;
  const { setAffiliation } = useApp();
  const [studentNumber, setStudentNumber] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      const body = {
        schoolId,
        gradeId,
        classId,
        studentNumber,
        studentName: studentName.trim() || undefined,
      };
      const affiliation = await createAffiliation(body);
      await completeInstallation();
      setAffiliation(affiliation);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      Alert.alert('오류', '정보 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>학생 정보 입력</Text>
        <Text style={styles.subtitle}>번호와 이름을 입력해 주세요</Text>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>번호</Text>
          <View style={styles.numberPickerWrapper}>
            <TouchableOpacity
              style={styles.pickerArrow}
              onPress={() => setStudentNumber((n) => Math.max(1, n - 1))}
            >
              <Text style={styles.pickerArrowText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.pickerValue}>{studentNumber}번</Text>
            <TouchableOpacity
              style={styles.pickerArrow}
              onPress={() => setStudentNumber((n) => Math.min(40, n + 1))}
            >
              <Text style={styles.pickerArrowText}>▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.numberGrid}>
            {STUDENT_NUMBERS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.numberButton,
                  studentNumber === n && styles.numberButtonSelected,
                ]}
                onPress={() => setStudentNumber(n)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.numberText,
                    studentNumber === n && styles.numberTextSelected,
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>이름 (선택)</Text>
          <TextInput
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
            placeholder="이름을 입력하세요"
            placeholderTextColor={COLORS.subtext}
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>완료</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 28,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 12,
    fontWeight: '600',
  },
  numberPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pickerArrow: {
    padding: 12,
  },
  pickerArrowText: {
    fontSize: 18,
    color: COLORS.primary,
  },
  pickerValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 70,
    textAlign: 'center',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  numberButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  numberText: {
    fontSize: 14,
    color: COLORS.text,
  },
  numberTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
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
