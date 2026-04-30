import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';
import { useEvents } from '../context/EventContext';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { events, bookings, deleteEvent } = useEvents();
  const [activeTab, setActiveTab] = useState('events');

  const totalRevenue = bookings.reduce((sum, b) => {
    const ev = events.find(e => e.eventId === b.eventId);
    return sum + (ev ? ev.price : 0);
  }, 0);

  const handleDelete = (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This will also remove all bookings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteEvent(eventId) }
      ]
    );
  };

  const renderStats = () => (
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <Text style={styles.statIcon}>📅</Text>
        <Text style={[styles.statValue, { color: colors.primaryLight }]}>{events.length}</Text>
        <Text style={styles.statLabel}>Total Events</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statIcon}>🎟️</Text>
        <Text style={[styles.statValue, { color: colors.success }]}>{bookings.length}</Text>
        <Text style={styles.statLabel}>Total Bookings</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statIcon}>💰</Text>
        <Text style={[styles.statValue, { color: colors.warning }]}>{totalRevenue}</Text>
        <Text style={styles.statLabel}>ETB Revenue</Text>
      </View>
    </View>
  );

  const renderEventsTab = () => (
    <View>
      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => navigation.navigate('ManageEvent')}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.addBtnText}>Add New Event</Text>
      </TouchableOpacity>

      {events.map(ev => (
        <View key={ev.eventId} style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listEmoji}>{ev.emoji}</Text>
            <View>
              <Text style={styles.listTitle}>{ev.title}</Text>
              <Text style={styles.listSubtitle}>{ev.currentBookings}/{ev.capacity} booked</Text>
            </View>
          </View>
          <View style={styles.listActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="pencil" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(ev.eventId)}>
              <Ionicons name="trash" size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBookingsTab = () => (
    <View>
      {bookings.length === 0 ? (
        <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>No bookings yet.</Text>
      ) : (
        bookings.map(b => {
          const ev = events.find(e => e.eventId === b.eventId);
          return (
            <View key={b.bookingId} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.bookingAvatar}>
                  <Text style={styles.bookingAvatarText}>U</Text>
                </View>
                <View>
                  <Text style={styles.listTitle}>{ev ? ev.title : 'Unknown Event'}</Text>
                  <Text style={styles.listSubtitle}>ID: {b.bookingId.toUpperCase()}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, b.attended && { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }]}>
                <Text style={[styles.statusText, b.attended && { color: colors.success }]}>
                  {b.attended ? 'Attended' : 'Active'}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        {renderStats()}

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'events' && styles.tabActive]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bookings' && styles.tabActive]}
            onPress={() => setActiveTab('bookings')}
          >
            <Text style={[styles.tabText, activeTab === 'bookings' && styles.tabTextActive]}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'scanner' && styles.tabActive]}
            onPress={() => setActiveTab('scanner')}
          >
            <Text style={[styles.tabText, activeTab === 'scanner' && styles.tabTextActive]}>Scanner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'scanner' && (
             <View style={styles.scannerBox}>
               <Ionicons name="qr-code-outline" size={64} color={colors.primaryLight} style={{ marginBottom: 16 }} />
               <Text style={styles.scannerTitle}>QR Scanner</Text>
               <Text style={styles.scannerDesc}>Use your camera to verify tickets at the venue entrance.</Text>
               <TouchableOpacity style={styles.addBtn} onPress={() => Alert.alert("Scanner", "Camera requires physical device.")}>
                 <Text style={styles.addBtnText}>Open Camera</Text>
               </TouchableOpacity>
             </View>
          )}
        </View>

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  backBtn: {
    marginRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    ...typography.h3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingVertical: 12,
    marginRight: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primaryLight,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  addBtnText: {
    ...typography.body,
    fontWeight: '700',
    color: 'white',
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listEmoji: {
    fontSize: 24,
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  bookingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bookingAvatarText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  listTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  listActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgSurface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSurface,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  scannerBox: {
    backgroundColor: colors.bgCard,
    padding: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.md,
  },
  scannerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  scannerDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
