import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { newsItem } = route.params;

  // Динамічний заголовок екрану деталей
  useLayoutEffect(() => {
    navigation.setOptions({
      title: newsItem.category || 'Деталі новини',
    });
  }, [navigation, newsItem]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Зображення */}
      <Image
        source={{ uri: newsItem.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Контент */}
      <View style={styles.content}>
        {/* Категорія та дата */}
        <View style={styles.metaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{newsItem.category}</Text>
          </View>
          <Text style={styles.date}>{newsItem.date}</Text>
        </View>

        {/* Заголовок */}
        <Text style={styles.title}>{newsItem.title}</Text>

        {/* Автор */}
        <View style={styles.authorRow}>
          <View style={styles.authorAvatar}>
            <Text style={styles.authorAvatarText}>
              {newsItem.author ? newsItem.author[0] : 'А'}
            </Text>
          </View>
          <Text style={styles.author}>{newsItem.author}</Text>
        </View>

        {/* Роздільник */}
        <View style={styles.divider} />

        {/* Повний текст */}
        <Text style={styles.bodyText}>{newsItem.description}</Text>
        <Text style={styles.bodyText}>
          Захід зібрав представників провідних підприємств регіону та науковців
          університету. У ході заходу були обговорені актуальні питання розвитку
          галузі та перспективи співробітництва між бізнесом і освітою.
        </Text>
        <Text style={styles.bodyText}>
          Учасники відзначили високий рівень організації та змістовність
          представлених матеріалів. За підсумками заходу підписано ряд угод про
          співробітництво, які відкривають нові можливості для студентів.
        </Text>

        {/* Кнопка назад */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← Повернутися до новин</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#1565C0',
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 30,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  author: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 14,
  },
  backButton: {
    backgroundColor: '#1565C0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
