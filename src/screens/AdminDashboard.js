import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';
import { useEvents } from '../context/EventContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { events, bookings, deleteEvent, markAttended } = useEvents();
  const [activeTab, setActiveTab] = useState('events');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const payload = JSON.parse(data);
      if (!payload.bookingId) throw new Error("Invalid QR code format");

      const booking = bookings.find(b => b.bookingId === payload.bookingId);
      if (!booking) {
        Alert.alert("Error", "Booking not found in the database.", [{ text: "OK", onPress: () => setScanned(false) }]);
        return;
      }

      if (booking.attended) {
        Alert.alert("Warning", "This ticket has already been used!", [{ text: "OK", onPress: () => setScanned(false) }]);
        return;
      }

      const event = events.find(e => e.eventId === booking.eventId);
      
      Alert.alert(
        "Ticket Valid!",
        `Event: ${event?.title}\nUser ID: ${booking.userId}`,
        [
          { text: "Cancel", style: "cancel", onPress: () => setScanned(false) },
          { 
            text: "Check In", 
            onPress: async () => {
              await markAttended(booking.bookingId);
              Alert.alert("Success", "Attendee checked in.");
              setScanned(false);
            }
          }
        ]
      );
    } catch (e) {
      Alert.alert("Error", "Unrecognized QR code.", [{ text: "OK", onPress: () => setScanned(false) }]);
    }
  };

  const renderStats = () => (
    <View style={styles.statsGrid}>
      <LinearGradient colors={['rgba(99,102,241,0.15)', 'rgba(99,102,241,0.05)']} style={styles.statCard}>
        <Text style={styles.statIcon}>📅</Text>
        <Text style={[styles.statValue, { color: colors.primaryLight }]}>{events.length}</Text>
        <Text style={styles.statLabel}>Total Events</Text>
      </LinearGradient>
      <LinearGradient colors={['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.05)']} style={styles.statCard}>
        <Text style={styles.statIcon}>🎟️</Text>
        <Text style={[styles.statValue, { color: colors.success }]}>{bookings.length}</Text>
        <Text style={styles.statLabel}>Total Bookings</Text>
      </LinearGradient>
      <LinearGradient colors={['rgba(245,158,11,0.15)', 'rgba(245,158,11,0.05)']} style={styles.statCard}>
        <Text style={styles.statIcon}>💰</Text>
        <Text style={[styles.statValue, { color: colors.warning }]}>{totalRevenue}</Text>
        <Text style={styles.statLabel}>ETB Revenue</Text>
      </LinearGradient>
    </View>
  );

  const renderEventsTab = () => (
    <View>
      <TouchableOpacity 
        style={styles.addBtnContainer}
        onPress={() => navigation.navigate('ManageEvent')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradientPrimary}
          style={styles.addBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addBtnText}>Add New Event</Text>
        </LinearGradient>
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
             <View style={styles.scannerContainer}>
               {!permission ? (
                 <View style={styles.scannerBox}><Text>Requesting permission...</Text></View>
               ) : !permission.granted ? (
                 <View style={styles.scannerBox}>
                   <Text style={styles.scannerDesc}>We need your permission to show the camera</Text>
                   <TouchableOpacity style={styles.addBtn} onPress={requestPermission}>
                     <Text style={styles.addBtnText}>Grant Permission</Text>
                   </TouchableOpacity>
                 </View>
               ) : (
                 <View style={styles.cameraWrapper}>
                   <CameraView
                     style={StyleSheet.absoluteFillObject}
                     facing="back"
                     onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                     barcodeScannerSettings={{
                       barcodeTypes: ["qr"],
                     }}
                   />
                   <View style={styles.overlay}>
                     <View style={styles.scanTarget} />
                   </View>
                   {scanned && (
                     <TouchableOpacity style={styles.rescanBtn} onPress={() => setScanned(false)}>
                       <Text style={styles.rescanBtnText}>Tap to Scan Again</Text>
                     </TouchableOpacity>
                   )}
                 </View>
               )}
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
    padding: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  addBtnContainer: {
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.full,
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
  scannerContainer: {
    height: 400,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  rescanBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.full,
  },
  rescanBtnText: {
    ...typography.body,
    color: 'white',
    fontWeight: '700',
  },
});
