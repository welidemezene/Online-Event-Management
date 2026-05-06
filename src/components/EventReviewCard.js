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

export default function EventReviewCard({ eventTitle = 'Event', onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }
    if (review.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters in your review.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
    if (onSubmit) {
      onSubmit({ rating, review: review.trim() });
    }
  };

  if (submitted) {
    return (
      <View style={styles.successCard}>
        <Ionicons name="checkmark-circle" size={48} color="#10b981" />
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.successText}>
          Your review for {eventTitle} has been submitted.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Rate your experience</Text>
      <Text style={styles.eventName}>{eventTitle}</Text>

      <View style={styles.ratingSection}>
        <Text style={styles.label}>Your Rating</Text>
        <StarRating value={rating} onSelect={setRating} />
        {rating > 0 && (
          <Text style={styles.ratingHint}>
            {['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent!'][rating]}
          </Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Review</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell others what you thought about this event..."
          placeholderTextColor="#6b7280"
          multiline
          numberOfLines={4}
          value={review}
          onChangeText={setReview}
          maxLength={500}
        />
        <Text style={styles.charCount}>{review.length}/500</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitBtnText}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingHint: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
  },
});