import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, ActivityIndicator, TextInput, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Компонент рядка профілю
function ProfileRow({ icon, label, value }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, profile, logout, deleteAccount } = useAuth();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert('Вихід', 'Ви дійсно хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Вийти', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      Alert.alert('Помилка', 'Введіть пароль для підтвердження');
      return;
    }
    setDeleting(true);
    const result = await deleteAccount(deletePassword);
    setDeleting(false);
    if (result.success) {
      setDeleteModal(false);
      Alert.alert('Акаунт видалено', 'Ваш акаунт та всі дані були видалені.');
    } else {
      Alert.alert('Помилка', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Аватар */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.name || user?.email || '?')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{profile?.name || 'Без імені'}</Text>
          <Text style={styles.displayEmail}>{user?.email}</Text>
          <View style={styles.uidBadge}>
            <Text style={styles.uidText}>uid: {user?.uid?.slice(0, 12)}...</Text>
          </View>
        </View>

        {/* Дані профілю */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Особисті дані</Text>
          <ProfileRow icon="👤" label="Ім'я" value={profile?.name} />
          <ProfileRow icon="📧" label="Email" value={user?.email} />
          <ProfileRow icon="🎂" label="Вік" value={profile?.age ? `${profile.age} років` : null} />
          <ProfileRow icon="📍" label="Місто" value={profile?.city} />
        </View>

        {/* Firebase інфо */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Firebase дані</Text>
          <ProfileRow icon="🔑" label="UID" value={user?.uid} />
          <ProfileRow icon="✅" label="Email підтверджено" value={user?.emailVerified ? 'Так' : 'Ні'} />
          <ProfileRow icon="📅" label="Дата реєстрації"
            value={user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString('uk-UA')
              : null}
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>✏️ Редагувати профіль</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>🚪 Вийти з акаунту</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>🗑️ Видалити акаунт</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>Видалити акаунт?</Text>
            <Text style={styles.modalSubtitle}>
              Ця дія незворотна. Всі ваші дані будуть видалені. Для підтвердження введіть пароль.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ваш пароль"
              placeholderTextColor="#ADB5BD"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => { setDeleteModal(false); setDeletePassword(''); }}
              >
                <Text style={styles.modalCancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDelete}
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <Text style={styles.modalDeleteText}>Видалити</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  avatarSection: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  avatar: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
  displayName: { fontSize: 22, fontWeight: '700', color: '#1E1B4B', marginBottom: 4 },
  displayEmail: { fontSize: 14, color: '#6C757D', marginBottom: 8 },
  uidBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  uidText: { fontSize: 11, color: '#4F46E5', fontFamily: 'monospace' },
  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 20, padding: 16,
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  rowIcon: { fontSize: 20, marginRight: 12 },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  rowValue: { fontSize: 15, color: '#1E1B4B', fontWeight: '600' },
  actions: { padding: 16, gap: 10, paddingBottom: 40 },
  editButton: {
    backgroundColor: '#4F46E5', borderRadius: 14, padding: 16, alignItems: 'center',
    shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  logoutButton: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  logoutButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#FFF1F2', borderRadius: 14, padding: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FECDD3',
  },
  deleteButtonText: { color: '#DC2626', fontSize: 16, fontWeight: '600' },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalBox: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28,
    width: '100%', alignItems: 'center',
  },
  modalIcon: { fontSize: 52, marginBottom: 12 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1E1B4B', marginBottom: 10 },
  modalSubtitle: { fontSize: 14, color: '#6C757D', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  modalInput: {
    width: '100%', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 15,
    fontSize: 15, borderWidth: 1.5, borderColor: '#E9ECEF', marginBottom: 20,
  },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancel: {
    flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  modalDelete: {
    flex: 1, backgroundColor: '#DC2626', borderRadius: 12, padding: 14, alignItems: 'center',
  },
  modalDeleteText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
