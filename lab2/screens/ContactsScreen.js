import React, { useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { CONTACTS_DATA } from '../data/newsData';

function ContactItem({ item }) {
  const handlePhone = () => Linking.openURL(`tel:${item.phone}`);
  const handleEmail = () => Linking.openURL(`mailto:${item.email}`);

  return (
    <View style={styles.contactItem}>
      <View style={styles.contactAvatar}>
        <Text style={styles.contactAvatarText}>
          {item.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactRole}>{item.role}</Text>
        <View style={styles.contactActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handlePhone}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>{item.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleEmail}>
            <Text style={styles.actionIcon}>✉️</Text>
            <Text style={styles.actionText}>{item.email}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ section }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );
}

export default function ContactsScreen({ navigation }) {
  const renderItem = useCallback(({ item }) => (
    <ContactItem item={item} />
  ), []);

  const renderSectionHeader = useCallback(({ section }) => (
    <SectionHeader section={section} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  const ItemSeparator = () => <View style={styles.separator} />;

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>👥 Контакти університету</Text>
      <Text style={styles.listHeaderSub}>
        Житомирська політехніка — офіційні контакти
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.listFooter}>
      <Text style={styles.footerText}>🌐 www.ztu.edu.ua</Text>
      <Text style={styles.footerText}>📍 вул. Чуднівська, 103, Житомир</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Топ-бар */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Контакти</Text>
        <View style={{ width: 40 }} />
      </View>

      <SectionList
        sections={CONTACTS_DATA}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    paddingBottom: 30,
  },
  listHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  listHeaderSub: {
    fontSize: 13,
    color: '#666',
  },
  sectionHeader: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1565C0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  contactAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  contactActions: {
    gap: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#1565C0',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 76,
  },
  listFooter: {
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#888',
  },
});
