import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, radius, shadows, typography, spacing, categoryConfig } from '../theme';

export default function EventCard({ event, onPress }) {
  const percentFull = Math.min(100, Math.round((event.currentBookings / event.capacity) * 100));
  const isFull = percentFull >= 100;
  const cat = categoryConfig[event.category] || categoryConfig.tech;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.imagePlaceholder} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: cat.bg }]}>
          <Text style={styles.emoji}>{event.emoji || '📅'}</Text>
        </View>
      )}
      
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: cat.bg }]}>
            <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          {isFull && <Text style={styles.soldOut}>SOLD OUT</Text>}
        </View>
        
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        <View style={styles.details}>
          <Text style={styles.detailText}>📅 {new Date(event.date).toLocaleDateString()}</Text>
          <Text style={styles.detailText}>📍 {event.location}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.price, event.price === 0 && { color: colors.success }]}>
            {event.price === 0 ? 'FREE' : `ETB ${event.price}`}
          </Text>
          <View style={styles.capacity}>
            <Text style={styles.capacityText}>{percentFull}% full</Text>
            <View style={styles.capacityBarBg}>
              <View style={[
                styles.capacityBarFill, 
                { width: `${percentFull}%` },
                percentFull > 80 && { backgroundColor: colors.warning },
                isFull && { backgroundColor: colors.danger }
              ]} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  imagePlaceholder: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
  },
  soldOut: {
    ...typography.caption,
    color: colors.danger,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  details: {
    gap: 4,
    marginBottom: spacing.md,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  capacity: {
    alignItems: 'flex-end',
  },
  capacityText: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 4,
  },
  capacityBarBg: {
    width: 60,
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
});
