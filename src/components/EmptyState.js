import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = ({
  title = 'Nothing here yet',
  message = 'There is currently no data to display.',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  icon: {
    fontSize: 48,
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },

  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});