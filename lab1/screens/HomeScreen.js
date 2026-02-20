import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NEWS_DATA = [
  { id: '1', title: 'Заголовок новини', date: '20 лютого 2026', description: 'Короткий текст новини про важливу подію в університеті.' },
  { id: '2', title: 'Заголовок новини', date: '19 лютого 2026', description: 'Короткий текст новини про наукову конференцію студентів.' },
  { id: '3', title: 'Заголовок новини', date: '18 лютого 2026', description: 'Короткий текст новини про олімпіаду з програмування.' },
  { id: '4', title: 'Заголовок новини', date: '17 лютого 2026', description: 'Короткий текст новини про нові навчальні програми.' },
  { id: '5', title: 'Заголовок новини', date: '16 лютого 2026', description: 'Короткий текст новини про спортивні змагання.' },
  { id: '6', title: 'Заголовок новини', date: '15 лютого 2026', description: 'Короткий текст новини про відкриту лекцію провідного фахівця.' },
  { id: '7', title: 'Заголовок новини', date: '14 лютого 2026', description: 'Короткий текст новини про день відкритих дверей.' },
  { id: '8', title: 'Заголовок новини', date: '13 лютого 2026', description: 'Короткий текст новини про міжнародне співробітництво.' },
  { id: '9', title: 'Заголовок новини', date: '12 лютого 2026', description: 'Короткий текст новини про студентські проєкти.' },
  { id: '10', title: 'Заголовок новини', date: '11 лютого 2026', description: 'Короткий текст новини про наукові досягнення.' },
  { id: '11', title: 'Заголовок новини', date: '10 лютого 2026', description: 'Короткий текст новини про міжнародний обмін.' },
];

function NewsItem({ title, date, description }) {
  return (
    <TouchableOpacity style={styles.newsItem} activeOpacity={0.7}>
      <View style={styles.newsImage}>
        <Text style={styles.imageIcon}>🖼</Text>
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{title}</Text>
        <Text style={styles.newsDate}>{date}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageTitle}>Новини</Text>
        {NEWS_DATA.map((item) => (
          <NewsItem
            key={item.id}
            title={item.title}
            date={item.date}
            description={item.description}
          />
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginVertical: 16, color: '#000' },
  newsItem: {
    flexDirection: 'row', backgroundColor: '#fff',
    marginHorizontal: 12, marginBottom: 10,
    borderRadius: 8, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
  },
  newsImage: { width: 70, height: 70, backgroundColor: '#e0e0e0', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  imageIcon: { fontSize: 24 },
  newsContent: { flex: 1, justifyContent: 'center' },
  newsTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 2 },
  newsDate: { fontSize: 12, color: '#999', marginBottom: 4 },
  newsDescription: { fontSize: 13, color: '#555', lineHeight: 18 },
});