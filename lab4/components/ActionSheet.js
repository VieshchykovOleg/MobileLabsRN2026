import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { getIcon, isTextFile } from '../utils/fileUtils';

export default function ActionSheet({ visible, item, onClose, onDelete, onInfo, onEdit, onOpen }) {
  if (!item) return null;

  const canRead = !item.isDirectory && isTextFile(item.name);

  const actions = [
    canRead && { label: 'Переглянути', onPress: onOpen, color: '#4F6EF7' },
    canRead && {label: 'Редагувати',   onPress: onEdit,   color: '#22C55E' },
    {label: 'Інформація', onPress: onInfo,   color: '#F59E0B' },
    {label: 'Видалити',   onPress: onDelete, color: '#EF4444' },
  ].filter(Boolean);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>{getIcon(item)}</Text>
            <Text style={styles.headerName} numberOfLines={1}>{item.name}</Text>
          </View>

          <View style={styles.divider} />

          {/* Дії */}
          {actions.map((a, i) => (
            <TouchableOpacity key={i} style={styles.action} onPress={a.onPress}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  headerIcon: { fontSize: 26 },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  actionIcon: { fontSize: 20 },
  actionLabel: { fontSize: 16, fontWeight: '600' },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
