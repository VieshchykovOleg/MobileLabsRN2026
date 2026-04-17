import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { generateNews } from '../data/newsData';
import NewsCard from '../components/NewsCard';

const INITIAL_COUNT = 15;
const LOAD_MORE_COUNT = 10;

export default function MainScreen({ navigation }) {
  const [news, setNews] = useState(() => generateNews(1, INITIAL_COUNT));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextId, setNextId] = useState(INITIAL_COUNT + 1);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const freshNews = generateNews(1, INITIAL_COUNT);
      setNews(freshNews);
      setNextId(INITIAL_COUNT + 1);
      setRefreshing(false);
    }, 1500);
  }, []);

  // Infinite Scroll  підвантаження при досягненні кінця
  const handleLoadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const moreNews = generateNews(nextId, LOAD_MORE_COUNT);
      setNews((prev) => [...prev, ...moreNews]);
      setNextId((prev) => prev + LOAD_MORE_COUNT);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore, nextId]);

  // Перехід на екран деталей з передачею параметрів
  const handlePressItem = useCallback((item) => {
    navigation.navigate('Details', { newsItem: item });
  }, [navigation]);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerTitle}>📰 Новини університету</Text>
      <Text style={styles.headerSubtitle}>
        Житомирська політехніка — останні події
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.listFooter}>
      {loadingMore ? (
        <>
          <ActivityIndicator size="small" color="#1565C0" />
          <Text style={styles.footerText}>Завантаження...</Text>
        </>
      ) : (
        <Text style={styles.footerText}>Всього новин: {news.length}</Text>
      )}
    </View>
  );

  const ItemSeparator = () => <View style={styles.separator} />;

  const renderItem = useCallback(({ item }) => (
    <NewsCard item={item} onPress={() => handlePressItem(item)} />
  ), [handlePressItem]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Кнопка відкриття Drawer */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Головна</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={keyExtractor}

        // Обов'язкові компоненти
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={ItemSeparator}

        // Pull-to-Refresh
        refreshing={refreshing}
        onRefresh={handleRefresh}

        // Infinite Scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}

        // Оптимізація
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}

        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565C0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    color: '#fff',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  listHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
});
