import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, SafeAreaView, ActivityIndicator, ScrollView,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

import { readDirectory, formatSize, getIcon, isTextFile } from '../utils/fileUtils';
import CreateModal from '../components/CreateModal';
import InfoModal   from '../components/InfoModal';
import ActionSheet from '../components/ActionSheet';

const ROOT = FileSystem.documentDirectory;

export default function FileManagerScreen({ navigation }) {
  const [currentPath, setCurrentPath] = useState(ROOT);
  const [pathStack,   setPathStack]   = useState([ROOT]);
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(false);

  // Модальні вікна
  const [createModal,  setCreateModal]  = useState(null); // 'file' | 'folder' | null
  const [infoItem,     setInfoItem]     = useState(null);
  const [actionItem,   setActionItem]   = useState(null);

  // Завантаження вмісту директорії
  const loadDir = useCallback(async (path) => {
    setLoading(true);
    try {
      // Ствоюємо демо-файли при першому запуску
      await ensureDemoFiles(path);
      const result = await readDirectory(path);
      setItems(result);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося відкрити директорію');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadDir(currentPath); }, [currentPath]));

  // Перехід у підпапку
  const openDir = (uri) => {
    setPathStack(s => [...s, uri]);
    setCurrentPath(uri);
  };

  // Кнопка "назад"
  const goUp = () => {
    if (pathStack.length <= 1) return;
    const newStack = pathStack.slice(0, -1);
    setPathStack(newStack);
    setCurrentPath(newStack[newStack.length - 1]);
  };

  // Breadcrumb — відносний шлях від ROOT
  const relativePath = currentPath.replace(ROOT, '') || '/';

  const handleCreate = async (name, content) => {
    setCreateModal(null);
    const uri = currentPath + name;
    try {
      if (createModal === 'folder') {
        await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
      } else {
        await FileSystem.writeAsStringAsync(uri, content || '');
      }
      loadDir(currentPath);
    } catch {
      Alert.alert('Помилка', 'Не вдалося створити ' + (createModal === 'folder' ? 'папку' : 'файл'));
    }
  };

  const handleDelete = async (item) => {
    setActionItem(null);
    Alert.alert(
      'Підтвердження видалення',
      `Видалити "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити', style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri, { idempotent: true });
              loadDir(currentPath);
            } catch {
              Alert.alert('Помилка', 'Не вдалося видалити');
            }
          },
        },
      ]
    );
  };

  const handleOpen = (item) => {
    setActionItem(null);
    navigation.navigate('Viewer', { uri: item.uri, name: item.name, readOnly: true });
  };

  const handleEdit = (item) => {
    setActionItem(null);
    navigation.navigate('Viewer', { uri: item.uri, name: item.name, readOnly: false });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => item.isDirectory ? openDir(item.uri + '/') : setActionItem(item)}
      onLongPress={() => setActionItem(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemIcon}>{getIcon(item)}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.isDirectory ? 'Папка' : formatSize(item.size)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => setActionItem(item)} style={styles.moreBtn}>
        <Text style={styles.moreIcon}>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ListEmpty = () => (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>📂</Text>
      <Text style={styles.emptyText}>Папка порожня</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        {items.length} {declItems(items.length)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Хедер з breadcrumb */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, pathStack.length <= 1 && styles.backBtnDisabled]}
          onPress={goUp}
          disabled={pathStack.length <= 1}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.pathWrap}>
          <Text style={styles.pathLabel}>Поточний шлях</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.pathText}>📁 {relativePath}</Text>
          </ScrollView>
        </View>
      </View>

      {/* Список файлів */}
      {loading
        ? <ActivityIndicator size="large" color="#4F6EF7" style={{ flex: 1 }} />
        : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.uri}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmpty}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )
      }

      {/* FAB кнопки */}
      <View style={styles.fab}>
        <TouchableOpacity style={[styles.fabBtn, styles.fabFolder]} onPress={() => setCreateModal('folder')}>
          <Text style={styles.fabText}>📁+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fabBtn, styles.fabFile]} onPress={() => setCreateModal('file')}>
          <Text style={styles.fabText}>📄+</Text>
        </TouchableOpacity>
      </View>

      {/* Модалки */}
      <CreateModal
        visible={!!createModal}
        type={createModal}
        onConfirm={handleCreate}
        onCancel={() => setCreateModal(null)}
      />
      <InfoModal
        visible={!!infoItem}
        item={infoItem}
        onClose={() => setInfoItem(null)}
      />
      <ActionSheet
        visible={!!actionItem}
        item={actionItem}
        onClose={() => setActionItem(null)}
        onDelete={() => handleDelete(actionItem)}
        onInfo={() => { setActionItem(null); setInfoItem(actionItem); }}
        onOpen={() => handleOpen(actionItem)}
        onEdit={() => handleEdit(actionItem)}
      />
    </SafeAreaView>
  );
}
// Створення демо-файлів при першому запуску
async function ensureDemoFiles(root) {
  const demoDir = root + 'documents/';
  const demoInfo = await FileSystem.getInfoAsync(demoDir);
  if (!demoInfo.exists) {
    await FileSystem.makeDirectoryAsync(demoDir, { intermediates: true });
    await FileSystem.writeAsStringAsync(demoDir + 'readme.txt',
      'Це демонстраційний файл.\nДодаток — Файловий менеджер.\nЛабораторна робота №4.');
    await FileSystem.writeAsStringAsync(demoDir + 'notes.txt',
      'Мої нотатки:\n- Вивчити expo-file-system\n- Здати лабораторну');
    const photosDir = demoDir + 'photos/';
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  }
}

function declItems(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'елемент';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'елементи';
  return 'елементів';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
 header: {
   backgroundColor: '#4F6EF7',
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 12,
   paddingVertical: 12,
   paddingTop: 48,
   gap: 8,
 },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnDisabled: { opacity: 0.3 },
  backIcon: { fontSize: 24, color: '#fff', fontWeight: '700', marginTop: -2 },
  pathWrap: { flex: 1 },
  pathLabel: { fontSize: 10, color: '#ffffff80', letterSpacing: 0.5 },
  pathText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 12, paddingBottom: 100, paddingTop: 4 },
  listHeader: { paddingVertical: 8 },
  listHeaderText: { fontSize: 12, color: '#888', fontWeight: '600' },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  moreBtn: { padding: 4 },
  moreIcon: { fontSize: 20, color: '#bbb', fontWeight: '700' },
  separator: { height: 6 },
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    gap: 10,
    alignItems: 'flex-end',
  },
  fabBtn: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabFolder: { backgroundColor: '#F59E0B' },
  fabFile:   { backgroundColor: '#4F6EF7' },
  fabText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});
