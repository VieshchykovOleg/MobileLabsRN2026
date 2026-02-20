import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 36) / 2; // 2 колонки з відступами

const GALLERY_ITEMS = [
  { id: '1', label: 'Фото 1' },
  { id: '2', label: 'Фото 2' },
  { id: '3', label: 'Фото 3' },
  { id: '4', label: 'Фото 4' },
  { id: '5', label: 'Фото 5' },
  { id: '6', label: 'Фото 6' },
  { id: '7', label: 'Фото 7' },
  { id: '8', label: 'Фото 8' },
  { id: '9', label: 'Фото 9' },
  { id: '10', label: 'Фото 10' },
];

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.grid}>
        {GALLERY_ITEMS.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.gridItem, { width: ITEM_SIZE, height: ITEM_SIZE }]} activeOpacity={0.7}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>🖼</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  gridItem: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderIcon: {
    fontSize: 40,
  },
});
