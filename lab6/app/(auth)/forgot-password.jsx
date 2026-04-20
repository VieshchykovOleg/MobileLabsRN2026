import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Помилка', 'Введіть email адресу');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      Alert.alert('Помилка', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.logo}>{sent ? '📬' : '🔑'}</Text>
        <Text style={styles.title}>
          {sent ? 'Листа надіслано!' : 'Відновлення паролю'}
        </Text>
        <Text style={styles.subtitle}>
          {sent
            ? `Перевірте поштову скриньку ${email}. Перейдіть за посиланням у листі для скидання паролю.`
            : 'Введіть email, пов\'язаний з вашим акаунтом. Ми надішлемо посилання для скидання паролю.'
          }
        </Text>

        {!sent && (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#ADB5BD"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleReset}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.buttonText}>Надіслати лист</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {sent && (
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
            <Text style={styles.buttonText}>Повернутися до входу</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF', padding: 24 },
  backBtn: { marginTop: 48, marginBottom: 8 },
  backText: { fontSize: 16, color: '#4F46E5', fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 72, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#1E1B4B', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6C757D', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  form: { width: '100%' },
  label: { fontSize: 13, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, fontSize: 15,
    color: '#212529', borderWidth: 1.5, borderColor: '#E9ECEF', marginBottom: 16,
  },
  button: {
    backgroundColor: '#4F46E5', borderRadius: 14, padding: 16,
    alignItems: 'center', width: '100%',
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#A5B4FC' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
