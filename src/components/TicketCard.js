import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, shadows, typography, spacing, categoryConfig } from '../theme';

export default function TicketCard({ booking, event, user }) {
  if (!event) return null;
  
  const isUpcoming = new Date(event.date) > new Date();
  const statusLabel = booking.attended ? '✅ Attended' : isUpcoming ? '🟢 Upcoming' : '⏰ Past';
  const cat = categoryConfig[event.category] || categoryConfig.tech;
  
  // Data to encode in QR
  const qrData = JSON.stringify({ b: booking.bookingId });

  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: cat.bg }]}>
            <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <View style={[styles.statusBadge, booking.attended && styles.statusAttended]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
        
        <Text style={styles.title} numberOfLines={2}>
          {event.emoji} {event.title}
        </Text>
        
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>DATE</Text>
            <Text style={styles.value}>{new Date(event.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>TIME</Text>
            <Text style={styles.value}>
              {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={[styles.gridItem, { width: '100%' }]}>
            <Text style={styles.label}>LOCATION</Text>
            <Text style={styles.value} numberOfLines={1}>{event.location}</Text>
          </View>
          <View style={[styles.gridItem, { width: '100%' }]}>
            <Text style={styles.label}>BOOKING ID</Text>
            <Text style={[styles.value, { color: colors.primaryLight, letterSpacing: 1 }]}>
              {booking.bookingId.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>
      
      <View style={styles.qrSection}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={qrData}
            size={120}
            color={colors.bgBase}
            backgroundColor="white"
          />
        </View>
        <Text style={styles.scanText}>Scan at venue</Text>
        <Text style={styles.userName}>{user?.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  body: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusAttended: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(16,185,129,0.3)',
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '45%',
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  notchLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.bgBase,
    position: 'absolute',
    left: -12,
    borderRightWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  notchRight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.bgBase,
    position: 'absolute',
    right: -12,
    borderLeftWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: 16,
  },
  qrSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  scanText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  userName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
