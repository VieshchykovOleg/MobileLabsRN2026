import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';

export default function ViewerScreen({ route, navigation }) {
  const { uri, name, readOnly: initialReadOnly } = route.params;

  const [content,  setContent]  = useState('');
  const [loading,  setLoading]  = useState(true);
  const [readOnly, setReadOnly] = useState(initialReadOnly);
  const [changed,  setChanged]  = useState(false);

  // Динамічний заголовок
  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
      headerRight: () => (
        readOnly
          ? (
            <TouchableOpacity style={styles.headerBtn} onPress={() => setReadOnly(false)}>
              <Text style={styles.headerBtnText}>Редагувати</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.headerBtn, styles.headerBtnSave]}
              onPress={handleSave}
            >
              <Text style={styles.headerBtnText}>Зберегти</Text>
            </TouchableOpacity>
          )
      ),
    });
  }, [navigation, name, readOnly, content]);

  // Завантаження файлу
  useEffect(() => {
    FileSystem.readAsStringAsync(uri)
      .then(text => { setContent(text); setLoading(false); })
      .catch(() => {
        Alert.alert('Помилка', 'Не вдалося прочитати файл');
        navigation.goBack();
      });
  }, [uri]);

  const handleSave = async () => {
    try {
      await FileSystem.writeAsStringAsync(uri, content);
      setChanged(false);
      setReadOnly(true);
      Alert.alert('Збережено', 'Файл успішно збережено');
    } catch {
      Alert.alert('Помилка', 'Не вдалося зберегти файл');
    }
  };

  const handleBack = () => {
    if (changed) {
      Alert.alert(
        'Незбережені зміни',
        'Зберегти зміни перед виходом?',
        [
          { text: 'Не зберігати', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Зберегти', onPress: async () => { await handleSave(); navigation.goBack(); } },
          { text: 'Скасувати', style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#4F6EF7" />
        <Text style={styles.loadingText}>Завантаження файлу...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Статус-бар */}
      <View style={styles.statusBar}>
        <Text style={styles.statusMode}>
          {readOnly ? 'Перегляд' : 'Редагування'}
        </Text>
        <Text style={styles.statusLines}>
          {content.split('\n').length} рядків · {content.length} символів
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {readOnly
          ? (
            <ScrollView style={styles.viewerScroll} contentContainerStyle={styles.viewerContent}>
              <Text style={styles.viewerText} selectable>{content || '(порожній файл)'}</Text>
            </ScrollView>
          ) : (
            <TextInput
              style={styles.editor}
              value={content}
              onChangeText={(t) => { setContent(t); setChanged(true); }}
              multiline
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
              textAlignVertical="top"
              scrollEnabled
            />
          )
        }
      </KeyboardAvoidingView>

      {/* Нижня панель */}
      {!readOnly && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.discardBtn} onPress={handleBack}>
            <Text style={styles.discardText}>Скасувати</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Зберегти</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#666', fontSize: 15 },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F4FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4F0',
  },
  statusMode: { fontSize: 13, color: '#4F6EF7', fontWeight: '600' },
  statusLines: { fontSize: 12, color: '#888' },
  viewerScroll: { flex: 1 },
  viewerContent: { padding: 16 },
  viewerText: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  editor: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#fff',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E4F0',
    backgroundColor: '#fff',
  },
  discardBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  discardText: { fontSize: 15, color: '#666', fontWeight: '600' },
  saveBtn: {
    flex: 2, paddingVertical: 13, borderRadius: 10,
    backgroundColor: '#4F6EF7', alignItems: 'center',
  },
  saveText: { fontSize: 15, color: '#fff', fontWeight: '700' },
  headerBtn: {
    marginRight: 8, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, backgroundColor: '#ffffff30',
  },
  headerBtnSave: { backgroundColor: '#22C55E30' },
  headerBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },
});
