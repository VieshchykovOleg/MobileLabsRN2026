import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age ? String(profile.age) : '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Помилка', "Ім'я не може бути порожнім");
      return;
    }
    if (age && (isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120)) {
      Alert.alert('Помилка', 'Введіть коректний вік (1–120)');
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      name: name.trim(),
      age: age ? Number(age) : '',
      city: city.trim(),
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Збережено ✅', 'Профіль успішно оновлено', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Помилка збереження', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💾</Text>
          <Text style={styles.infoText}>
            Дані зберігаються у Firestore у колекції <Text style={styles.code}>users</Text>,
            документ з вашим uid.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ім'я *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ваше ім'я"
              placeholderTextColor="#ADB5BD"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Вік</Text>
            <TextInput
              style={styles.input}
              placeholder="Наприклад: 22"
              placeholderTextColor="#ADB5BD"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Місто</Text>
            <TextInput
              style={styles.input}
              placeholder="Наприклад: Київ"
              placeholderTextColor="#ADB5BD"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.saveButtonText}>💾 Зберегти зміни</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  inner: { padding: 20, paddingBottom: 40 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF',
    borderRadius: 16, padding: 16, marginBottom: 20, gap: 12,
  },
  infoIcon: { fontSize: 24 },
  infoText: { flex: 1, fontSize: 13, color: '#4338CA', lineHeight: 20 },
  code: { fontFamily: 'monospace', fontWeight: '700', backgroundColor: '#C7D2FE' },
  form: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: {
    backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15,
    fontSize: 15, color: '#212529', borderWidth: 1.5, borderColor: '#E9ECEF',
  },
  saveButton: {
    backgroundColor: '#4F46E5', borderRadius: 14, padding: 16,
    alignItems: 'center', marginBottom: 12,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  saveButtonDisabled: { backgroundColor: '#A5B4FC' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cancelButton: {
    backgroundColor: '#F3F4F6', borderRadius: 14, padding: 16, alignItems: 'center',
  },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#374151' },
});
