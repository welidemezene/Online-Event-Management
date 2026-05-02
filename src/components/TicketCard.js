import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { colors, radius, typography, spacing, categoryConfig } from '../theme';

export default function TicketCard({ booking, event, user }) {
  if (!event) return null;

  const isUpcoming = new Date(event.date) > new Date();
  const cat = categoryConfig[event.category] || categoryConfig.tech;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
  });
  const formattedTime = new Date(event.date).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });

  const qrData = JSON.stringify({ bookingId: booking.bookingId });

  const statusConfig = booking.attended
    ? { label: 'Attended', color: colors.success, bg: 'rgba(16,185,129,0.12)', icon: 'checkmark-circle' }
    : isUpcoming
    ? { label: 'Upcoming', color: colors.primaryLight, bg: 'rgba(99,102,241,0.12)', icon: 'time' }
    : { label: 'Past', color: colors.textMuted, bg: 'rgba(255,255,255,0.05)', icon: 'archive' };

  return (
    <View style={styles.card}>
      {/* Ticket Header with gradient */}
      <LinearGradient
        colors={[cat.color + '22', cat.color + '08']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={[styles.catBadge, { backgroundColor: cat.bg, borderColor: cat.color + '50' }]}>
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          </View>
        </View>

        <Text style={styles.eventEmoji}>{event.emoji}</Text>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
      </LinearGradient>

      {/* Ticket Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>DATE</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={15} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>TIME</Text>
            <Text style={styles.infoValue}>{formattedTime}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={15} color={colors.textMuted} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>LOCATION</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="person-outline" size={15} color={colors.textMuted} />
          <View>
            <Text style={styles.infoLabel}>ATTENDEE</Text>
            <Text style={styles.infoValue}>{user?.name}</Text>
          </View>
        </View>
      </View>

      {/* Tear Divider */}
      <View style={styles.divider}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={qrData}
            size={130}
            color={colors.bgBase}
            backgroundColor="white"
          />
        </View>
        <Text style={styles.bookingId}>{booking.bookingId.toUpperCase()}</Text>
        <Text style={styles.scanHint}>Present this QR code at the venue entrance</Text>
      </View>
    </View>
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 4,
  },
  catEmoji: {
    fontSize: 11,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  infoGrid: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    position: 'relative',
  },
  notchLeft: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgBase,
    position: 'absolute',
    left: -14,
    zIndex: 2,
  },
  notchRight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgBase,
    position: 'absolute',
    right: -14,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: 20,
  },
  qrSection: {
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  qrWrapper: {
    padding: 14,
    backgroundColor: 'white',
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingId: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  scanHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
