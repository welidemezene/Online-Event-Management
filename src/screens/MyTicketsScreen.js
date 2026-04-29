import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';

export default function MyTicketsScreen() {
  const navigation = useNavigation();
  const { bookings, events } = useEvents();
  const { user } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔐</Text>
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptyText}>Please login to view your tickets.</Text>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const myBookings = bookings.filter(b => b.userId === user.uid).sort((a, b) => {
    const eventA = events.find(e => e.eventId === a.eventId);
    const eventB = events.find(e => e.eventId === b.eventId);
    if (!eventA || !eventB) return 0;
    return new Date(eventA.date) - new Date(eventB.date);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <Text style={styles.subtitle}>Present QR code at the venue</Text>
      </View>

      <FlatList
        data={myBookings}
        keyExtractor={item => item.bookingId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const event = events.find(e => e.eventId === item.eventId);
          return <TicketCard booking={item} event={event} user={user} />;
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎫</Text>
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptyText}>Book your first event and it will appear here.</Text>
            <TouchableOpacity 
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseBtnText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
  },
  loginBtnText: {
    ...typography.h4,
    color: 'white',
  },
  browseBtn: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 100,
  },
  browseBtnText: {
    ...typography.h4,
    color: colors.primaryLight,
  },
});
