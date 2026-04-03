import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';

export default function CreateModal({ visible, type, onConfirm, onCancel }) {
  const [name, setName]       = useState('');
  const [content, setContent] = useState('');

  const isFile = type === 'file';
  const title  = isFile ? '📄 Новий файл' : '📁 Нова папка';

  const handleConfirm = () => {
    if (!name.trim()) return;
    const finalName = isFile && !name.includes('.') ? name + '.txt' : name.trim();
    onConfirm(finalName, content);
    setName('');
    setContent('');
  };

  const handleCancel = () => {
    setName('');
    setContent('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>

            <Text style={styles.label}>Назва {isFile ? 'файлу' : 'папки'}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={isFile ? 'наприклад: notes.txt' : 'наприклад: documents'}
              autoFocus
              autoCapitalize="none"
            />

            {isFile && (
              <>
                <Text style={styles.label}>Початковий вміст (необов'язково)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="Введіть текст файлу..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, !name.trim() && styles.confirmDisabled]}
                onPress={handleConfirm}
                disabled={!name.trim()}
              >
                <Text style={styles.confirmText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a1a2e',
    marginBottom: 14,
    backgroundColor: '#f8f9ff',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#4F6EF7',
    alignItems: 'center',
  },
  confirmDisabled: {
    backgroundColor: '#b0bcf5',
  },
  confirmText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
});
