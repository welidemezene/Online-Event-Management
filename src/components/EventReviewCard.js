import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function StarRating({ value = 0, onSelect, editable = true }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => editable && onSelect && onSelect(star)}
          activeOpacity={editable ? 0.7 : 1}
        >
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={26}
            color={star <= value ? '#f59e0b' : '#4b5563'}
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}