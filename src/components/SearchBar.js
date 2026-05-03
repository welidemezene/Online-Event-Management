import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({
  placeholder = 'Search events, venues...',
  onSearch,
  onFocus,
  onBlur,
  initialValue = '',
}) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onBlur) onBlur();
  };

  const handleChangeText = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    if (onSearch) onSearch(query);
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.08)', '#6366f1'],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, { borderColor }]}>
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? '#818cf8' : '#64748b'}
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#475569"
          value={query}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#64748b" />
          </TouchableOpacity>
        )}

        {isFocused && (
          <TouchableOpacity onPress={handleSubmit} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Go</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {query.length > 0 && (
        <Text style={styles.resultHint}>
          Searching for <Text style={styles.queryText}>"{query}"</Text>...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#11111b',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#f1f5f9',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
  searchBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  searchBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  resultHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginLeft: 4,
  },
  queryText: {
    color: '#818cf8',
    fontWeight: '600',
  },
});
