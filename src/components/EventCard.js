import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography, spacing, categoryConfig } from '../theme';

export default function EventCard({ event, onPress }) {
  const percentFull = Math.min(100, Math.round((event.currentBookings / event.capacity) * 100));
  const isFull = percentFull >= 100;
  const isAlmostFull = percentFull >= 80 && !isFull;
  const cat = categoryConfig[event.category] || categoryConfig.tech;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Hero Image Section */}
      {event.imageUrl ? (
        <ImageBackground
          source={{ uri: event.imageUrl }}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <LinearGradient
            colors={['transparent', 'rgba(8,8,15,0.85)']}
            style={styles.imageGradient}
          />
          <View style={styles.imageOverlayContent}>
            {isFull ? (
              <View style={styles.soldOutBadge}>
                <Text style={styles.soldOutText}>SOLD OUT</Text>
              </View>
            ) : isAlmostFull ? (
              <View style={[styles.soldOutBadge, { backgroundColor: 'rgba(245,158,11,0.9)' }]}>
                <Text style={styles.soldOutText}>ALMOST FULL</Text>
              </View>
            ) : null}
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.imageContainer, { backgroundColor: cat.bg }]}>
          <Text style={styles.emoji}>{event.emoji || '📅'}</Text>
          {isFull && (
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          )}
        </View>
      )}

      {/* Card Body */}
      <View style={styles.body}>
        {/* Category Badge */}
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: cat.bg, borderColor: cat.color + '40' }]}>
            <Text style={styles.badgeEmoji}>{cat.emoji}</Text>
            <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <Text style={[
            styles.price,
            event.price === 0 && { color: colors.success }
          ]}>
            {event.price === 0 ? 'FREE' : `ETB ${event.price}`}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>

        {/* Capacity Bar */}
        <View style={styles.footer}>
          <View style={styles.capacityBarBg}>
            <View style={[
              styles.capacityBarFill,
              { width: `${percentFull}%` },
              isAlmostFull && { backgroundColor: colors.warning },
              isFull && { backgroundColor: colors.danger },
            ]} />
          </View>
          <Text style={[
            styles.capacityText,
            isAlmostFull && { color: colors.warning },
            isFull && { color: colors.danger },
          ]}>
            {isFull ? 'Fully Booked' : `${event.capacity - event.currentBookings} spots left`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlayContent: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  emoji: {
    fontSize: 64,
  },
  soldOutBadge: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  soldOutText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  body: {
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 4,
  },
  badgeEmoji: {
    fontSize: 11,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  price: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  details: {
    gap: 6,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    gap: 6,
  },
  capacityBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  capacityText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
