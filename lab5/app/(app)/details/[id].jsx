import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getProductById } from '../../../data/products';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const product = getProductById(id);

  // Якщо товар не знайдено
  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundEmoji}>🔍</Text>
        <Text style={styles.notFoundTitle}>Товар не знайдено</Text>
        <Text style={styles.notFoundText}>Товар з ID "{id}" не існує в каталозі</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Повернутися до каталогу</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBuy = () => {
    if (!product.inStock) {
      Alert.alert('Недоступно', 'На жаль, цей товар відсутній у наявності');
      return;
    }
    Alert.alert('Успішно! 🎉', `"${product.name}" додано до кошика`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Зображення */}
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          {/* Категорія та рейтинг */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {product.rating}</Text>
            </View>
          </View>

          {/* Назва */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Ціна та наявність */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price.toLocaleString('uk-UA')} ₴</Text>
            <View style={[styles.stockBadge, !product.inStock && styles.stockBadgeOut]}>
              <Text style={[styles.stockText, !product.inStock && styles.stockTextOut]}>
                {product.inStock ? '✓ В наявності' : '✗ Немає'}
              </Text>
            </View>
          </View>

          {/* Розділювач */}
          <View style={styles.divider} />

          {/* Опис */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Опис товару</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Характеристики */}
          <View style={styles.specsSection}>
            <Text style={styles.descTitle}>Характеристики</Text>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Категорія</Text>
              <Text style={styles.specValue}>{product.category}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Рейтинг</Text>
              <Text style={styles.specValue}>{product.rating} / 5.0</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Наявність</Text>
              <Text style={[styles.specValue, { color: product.inStock ? '#198754' : '#DC3545' }]}>
                {product.inStock ? 'В наявності' : 'Немає в наявності'}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Артикул</Text>
              <Text style={styles.specValue}>#{product.id.padStart(6, '0')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Кнопка купити */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Ціна</Text>
          <Text style={styles.bottomPriceValue}>{product.price.toLocaleString('uk-UA')} ₴</Text>
        </View>
        <TouchableOpacity
          style={[styles.buyButton, !product.inStock && styles.buyButtonDisabled]}
          onPress={handleBuy}
          activeOpacity={0.8}
        >
          <Text style={styles.buyButtonText}>
            {product.inStock ? '🛒 Купити' : 'Немає в наявності'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E9ECEF',
  },
  content: {
    padding: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },
  ratingBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#856404',
  },
  productName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#212529',
    lineHeight: 34,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212529',
  },
  stockBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockBadgeOut: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
  },
  stockTextOut: {
    color: '#991B1B',
  },
  divider: {
    height: 1,
    backgroundColor: '#DEE2E6',
    marginBottom: 20,
  },
  descSection: {
    marginBottom: 24,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 26,
  },
  specsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  specLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  specValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomPrice: {},
  bottomPriceLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  bottomPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212529',
  },
  buyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonDisabled: {
    backgroundColor: '#ADB5BD',
    shadowOpacity: 0,
    elevation: 0,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Not found styles
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  notFoundEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
