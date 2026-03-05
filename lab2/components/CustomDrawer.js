import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const MENU_ITEMS = [
  { name: 'NewsStack', label: 'Новини', icon: '📰' },
  { name: 'Contacts', label: 'Контакти', icon: '👥' },
];

export default function CustomDrawer({ navigation, state }) {
  const currentRoute = state?.routeNames[state?.index];

  return (
    <SafeAreaView style={styles.container}>
      {/* Профіль */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>ІІ</Text>
        </View>
        <Text style={styles.fullName}>Вєщиков Олег Миколайович</Text>
        <Text style={styles.group}>Група: ІПЗ-22-2</Text>
        <Text style={styles.email}>ipz_vom@student@ztu.edu.ua</Text>
      </View>

      {/* Роздільник */}
      <View style={styles.divider} />

      {/* Пункти меню */}
      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item) => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Нижня частина */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <Text style={styles.footerText}>Житомирська політехніка</Text>
        <Text style={styles.footerSub}>Лабораторна робота №2</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    backgroundColor: '#1565C0',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  group: {
    fontSize: 13,
    color: '#BBDEFB',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#90CAF9',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: '#E3F2FD',
  },
  menuIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#1565C0',
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginTop: 8,
  },
  footerSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});
