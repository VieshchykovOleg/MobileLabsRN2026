import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer(props) {
  const name = props.name || 'Вєщиков Олег';
  const group = props.group || 'ІПЗ-22-2';

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{name}, {group}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});