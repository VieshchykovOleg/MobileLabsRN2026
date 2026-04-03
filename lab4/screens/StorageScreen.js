import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet,
  ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { getStorageInfo, formatSize } from '../utils/fileUtils';

function UsageBar({ used, total }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const color = pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#22C55E';
  return (
    <View style={styles.barWrap}>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.barPct, { color }]}>{pct}%</Text>
    </View>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

export default function StorageScreen() {
  const [storage, setStorage] = useState(null);
  const [docSize, setDocSize] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const info = await getStorageInfo();
      setStorage(info);
      const docInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory, { size: true }
      );
      setDocSize(docInfo.size || 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Статистика пам'яті</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F6EF7" />
          <Text style={styles.loadingText}>Отримання даних...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {storage && (
            <View style={styles.mainCard}>
              <Text style={styles.mainCardTitle}>Сховище пристрою</Text>
              <UsageBar used={storage.used} total={storage.total} />
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#4F6EF7' }]} />
                  <Text style={styles.legendText}>Зайнято: {formatSize(storage.used)}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E0E4F0' }]} />
                  <Text style={styles.legendText}>Вільно: {formatSize(storage.free)}</Text>
                </View>
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Деталі</Text>

          {storage && (
            <>
              <StatCard
                label="Загальний обсяг" color="#4F6EF7"
                value={formatSize(storage.total)}
                sub="Фізичний розмір сховища"
              />
              <StatCard
                label="Вільний простір" color="#22C55E"
                value={formatSize(storage.free)}
                sub={`${Math.round((storage.free / storage.total) * 100)}% від загального`}
              />
              <StatCard
                label="Зайнятий простір" color="#F59E0B"
                value={formatSize(storage.used)}
                sub={`${Math.round((storage.used / storage.total) * 100)}% від загального`}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Додаток</Text>
          <StatCard
            label="Папка документів" color="#8B5CF6"
            value={formatSize(docSize)}
            sub={FileSystem.documentDirectory}
          />

          <TouchableOpacity style={styles.refreshBtn} onPress={load}>
            <Text style={styles.refreshText}>Оновити дані</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            * Дані можуть відрізнятись залежно від версії Android та доступних дозволів
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: {
    backgroundColor: '#4F6EF7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#888', fontSize: 15 },
  content: { padding: 16, paddingBottom: 40 },
  mainCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    marginBottom: 20, elevation: 3,
  },
  mainCardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  barWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  barTrack: { flex: 1, height: 14, backgroundColor: '#E0E4F0', borderRadius: 7, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 7 },
  barPct: { fontSize: 15, fontWeight: '700', minWidth: 44, textAlign: 'right' },
  legend: { gap: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: '#444' },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#888',
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: 8, marginTop: 4, marginLeft: 4,
  },
  statCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 8, borderLeftWidth: 4, elevation: 2,
  },
  statInfo: { flex: 1 },
  statLabel: { fontSize: 13, color: '#888', marginBottom: 2 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statSub: { fontSize: 11, color: '#aaa', marginTop: 2 },
  refreshBtn: {
    backgroundColor: '#4F6EF7', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  refreshText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  note: { fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 16, lineHeight: 16 },
});
