import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗺️</Text>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Екран не знайдено</Text>
      <Text style={styles.subtitle}>
        Сторінка, яку ви шукаєте, не існує або була переміщена.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')} activeOpacity={0.8}>
        <Text style={styles.buttonText}>🏠 На головну</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F0F4FF' },
  emoji: { fontSize: 72, marginBottom: 16 },
  code: { fontSize: 80, fontWeight: '900', color: '#4F46E5', lineHeight: 88 },
  title: { fontSize: 24, fontWeight: '700', color: '#1E1B4B', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6C757D', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  button: {
    backgroundColor: '#4F46E5', paddingHorizontal: 28, paddingVertical: 16, borderRadius: 14,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
