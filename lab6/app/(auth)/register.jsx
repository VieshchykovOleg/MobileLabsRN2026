import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Помилка', 'Будь ласка, заповніть усі поля');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Помилка', 'Паролі не співпадають');
      return;
    }
    setLoading(true);
    const result = await register(email.trim(), password, name.trim());
    setLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      Alert.alert('Помилка реєстрації', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>✨</Text>
          <Text style={styles.title}>Реєстрація</Text>
          <Text style={styles.subtitle}>Створіть свій акаунт</Text>
        </View>

        <View style={styles.form}>
          {[
            { label: "Ім'я", value: name, setter: setName, placeholder: "Ваше ім'я", capitalize: 'words' },
            { label: 'Email', value: email, setter: setEmail, placeholder: 'example@email.com', keyboard: 'email-address', capitalize: 'none' },
            { label: 'Пароль', value: password, setter: setPassword, placeholder: 'Мінімум 6 символів', secure: true },
            { label: 'Підтвердження паролю', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Повторіть пароль', secure: true },
          ].map((field) => (
            <View key={field.label} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#ADB5BD"
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.keyboard || 'default'}
                autoCapitalize={field.capitalize || 'sentences'}
                secureTextEntry={field.secure || false}
                autoCorrect={false}
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.buttonText}>Зареєструватися</Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Вже є акаунт? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Увійти</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#1E1B4B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6C757D' },
  form: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: {
    backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15,
    fontSize: 15, color: '#212529', borderWidth: 1.5, borderColor: '#E9ECEF',
  },
  button: {
    backgroundColor: '#4F46E5', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 8,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#A5B4FC' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: '#6C757D' },
  link: { fontSize: 14, color: '#4F46E5', fontWeight: '600' },
});
