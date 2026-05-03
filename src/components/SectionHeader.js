import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SectionHeader = ({
  title,
  actionText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>

      {actionText && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.actionText}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },

  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});