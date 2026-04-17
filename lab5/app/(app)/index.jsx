import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { products } from '../../data/products';

// Компонент картки товару
function ProductCard({ item }) {
  return (
    <Link href={`/details/${item.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{item.price.toLocaleString('uk-UA')} ₴</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
          </View>
          {!item.inStock && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Немає в наявності</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function CatalogScreen() {
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Вихід', 'Ви дійсно хочете вийти?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Вийти',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  // Додати кнопку виходу в хедер
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Вийти</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Привітання */}
      {user && (
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Привіт, {user.name}! 👋</Text>
          <Text style={styles.greetingSubtext}>Знайдіть щось особливе сьогодні</Text>
        </View>
      )}

      {/* Список товарів */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Всі товари ({products.length})</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  greeting: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 8,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E9ECEF',
  },
  cardContent: {
    padding: 16,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  ratingBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  outOfStock: {
    marginTop: 8,
    backgroundColor: '#F8D7DA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  outOfStockText: {
    fontSize: 12,
    color: '#842029',
    fontWeight: '600',
  },
  logoutBtn: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
