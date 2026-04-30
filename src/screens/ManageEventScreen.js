import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography, radius, categoryConfig } from '../theme';
import { useEvents } from '../context/EventContext';

export default function ManageEventScreen() {
  const navigation = useNavigation();
  const { addEvent } = useEvents();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('tech');
  const [emoji, setEmoji] = useState('💻');
  const [imageUrl, setImageUrl] = useState('');
  
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !location || !capacity) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await addEvent({
        title,
        description,
        location,
        price: Math.max(0, parseFloat(price) || 0),
        capacity: Math.max(1, parseInt(capacity) || 1),
        category,
        emoji,
        imageUrl,
        date: date.toISOString(),
      });
      Alert.alert("Success", "Event created successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = Object.keys(categoryConfig);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Event</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, loading && { opacity: 0.5 }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Summer Music Festival"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => {
                    setCategory(cat);
                    setEmoji(categoryConfig[cat].emoji);
                  }}
                >
                  <Text style={[styles.catText, category === cat && { color: colors.bgBase }]}>
                    {categoryConfig[cat].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={[styles.inputGroup, { width: 80 }]}>
            <Text style={styles.label}>Emoji</Text>
            <TextInput
              style={[styles.input, { textAlign: 'center', fontSize: 20 }]}
              value={emoji}
              onChangeText={setEmoji}
              maxLength={2}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={colors.textMuted}
            value={imageUrl}
            onChangeText={setImageUrl}
          />
          <Text style={styles.hintText}>Paste a link to an image from the internet.</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people about this event..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity style={styles.dateTimeBtn} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {(showDatePicker || showTimePicker) && (
          <DateTimePicker
            value={date}
            mode={showDatePicker ? 'date' : 'time'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={showDatePicker ? handleDateChange : handleTimeChange}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Silicon Hall, Addis Ababa"
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
            <Text style={styles.label}>Price (ETB)</Text>
            <TextInput
              style={styles.input}
              placeholder="0 for Free"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Capacity *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 500"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={capacity}
              onChangeText={setCapacity}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  saveText: {
    ...typography.h4,
    color: colors.primaryLight,
  },
  content: {
    padding: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    color: colors.textPrimary,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  catScroll: {
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 8,
  },
  catChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  catText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    gap: 8,
  },
  dateTimeText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
