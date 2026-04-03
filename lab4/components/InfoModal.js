import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { formatSize, formatDate, getFileType, getIcon } from '../utils/fileUtils';

export default function InfoModal({ visible, item, onClose }) {
  if (!item) return null;

  const rows = item.isDirectory
    ? [
        { label: 'Назва',  value: item.name },
        { label: 'Тип',    value: 'Папка' },
        { label: 'Шлях',   value: item.uri },
      ]
    : [
        { label: 'Назва',              value: item.name },
        { label: 'Тип',                value: getFileType(item.name) },
        { label: 'Розмір',             value: formatSize(item.size) },
        { label: 'Остання зміна',      value: formatDate(item.modificationTime) },
        { label: 'Шлях',               value: item.uri },
      ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.icon}>{getIcon(item)}</Text>
            <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          </View>

          <ScrollView style={styles.rows}>
            {rows.map((r, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <Text style={styles.rowValue} selectable>{r.value}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Закрити</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a2e',
    flex: 1,
  },
  rows: { marginBottom: 16 },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  closeBtn: {
    backgroundColor: '#4F6EF7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
