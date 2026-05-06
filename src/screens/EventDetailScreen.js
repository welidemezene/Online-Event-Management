import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, categoryConfig, radius } from '../theme';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import UserAvatarGroup from '../components/UserAvatarGroup';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;
  const insets = useSafeAreaInsets();
  
  const { events, bookings, bookEvent, comments, addComment } = useEvents();
  const { user } = useAuth();
  
  const [newComment, setNewComment] = useState('');
  
  const event = events.find(e => e.eventId === eventId);
  const myBooking = bookings.find(b => b.eventId === eventId && b.userId === user?.uid);
  
  if (!event) return null;
  
  const cat = categoryConfig[event.category] || categoryConfig.tech;
  const percentFull = Math.min(100, Math.round((event.currentBookings / event.capacity) * 100));
  const isFull = percentFull >= 100;

  const handleBook = async () => {
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    
    // If the event is paid, go to the simulated payment gateway
    if (event.price > 0) {
      navigation.navigate('Checkout', { 
        eventId: event.eventId,
        eventTitle: event.title,
        price: event.price
      });
      return;
    }
    
    // If it's free, book it instantly
    try {
      await bookEvent(user.uid, eventId);
      Alert.alert(
        "Booking Confirmed! 🎉",
        "Your free ticket has been added to My Tickets.",
        [{ text: "View Ticket", onPress: () => navigation.navigate('MainTabs', { screen: 'TicketsTab' }) }]
      );
    } catch (error) {
      Alert.alert("Booking Failed", error.message);
    }
  };

  // Generate some mock attendees to make the UI look alive
  const generateMockAttendees = (count) => {
    const names = ['Abebe Kebede', 'Sara Alemu', 'Dawit Assefa', 'Hanna Tadesse', 'Yonas Belay', 'Betelhem Girma', 'Samuel Tilahun', 'Marta Getachew'];
    return Array.from({ length: Math.min(count, 12) }).map((_, i) => ({
      uid: `mock_${i}`,
      name: names[i % names.length],
    }));
  };
  
  const attendees = generateMockAttendees(event.currentBookings);
  const eventComments = comments[eventId] ? Object.values(comments[eventId]) : [];

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(eventId, user.uid, user.name, newComment.trim());
      setNewComment('');
    } catch (error) {
      Alert.alert("Error", "Could not post comment");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Hero Image / Placeholder */}
        {event.imageUrl ? (
          <View style={styles.heroImageContainer}>
            <Image source={{ uri: event.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'transparent', colors.bgBase]}
              style={styles.heroOverlay}
            />
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        ) : (
          <View style={[styles.heroImageContainer, { backgroundColor: cat.bg }]}>
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </SafeAreaView>
            <Text style={styles.heroEmoji}>{event.emoji}</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: cat.bg }]}>
              <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
            </View>
            {isFull && <Text style={styles.soldOut}>🔴 SOLD OUT</Text>}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.infoCardsRow}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={20} color={colors.primaryLight} />
              <Text style={styles.infoCardLabel}>Date</Text>
              <Text style={styles.infoCardValue}>{new Date(event.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={20} color={colors.primaryLight} />
              <Text style={styles.infoCardLabel}>Location</Text>
              <Text style={styles.infoCardValue} numberOfLines={1}>{event.location}</Text>
            </View>
          </View>

          <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <UserAvatarGroup users={attendees} max={5} size={32} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Countdown</Text>
            <CountdownTimer targetDate={event.date} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacity</Text>
            <View style={styles.capacityBox}>
              <View style={styles.capacityRow}>
                <Text style={styles.capacityText}>
                  <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{event.currentBookings}</Text> / {event.capacity} registered
                </Text>
                <Text style={styles.capacityPercent}>{percentFull}%</Text>
              </View>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Discussion</Text>
            
            {eventComments.map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.userName}</Text>
                  <Text style={styles.commentTime}>{new Date(comment.timestamp).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
            
            {user ? (
              <View style={styles.commentInputRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Ask a question..."
                  placeholderTextColor={colors.textMuted}
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.commentPostBtn} onPress={handlePostComment}>
                  <Ionicons name="send" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.loginToComment}>Log in to join the discussion.</Text>
            )}
          </View>

        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={[styles.priceValue, event.price === 0 && { color: colors.success }]}>
            {event.price === 0 ? 'FREE' : `ETB ${event.price}`}
          </Text>
        </View>
        
        {myBooking ? (
          <TouchableOpacity 
            style={[styles.bookBtn, { backgroundColor: colors.bgSurface, borderColor: colors.primary, borderWidth: 1 }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'TicketsTab' })}
          >
            <Text style={[styles.bookBtnText, { color: colors.primaryLight }]}>View Ticket</Text>
          </TouchableOpacity>
        ) : isFull ? (
          <TouchableOpacity style={[styles.bookBtn, { backgroundColor: colors.bgSurface, opacity: 0.5 }]} disabled>
            <Text style={styles.bookBtnText}>Fully Booked</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <LinearGradient
              colors={colors.gradientPrimary}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: radius.full, ...StyleSheet.absoluteFillObject }}
            />
            <Text style={[styles.bookBtnText, { zIndex: 1 }]}>{user ? 'Book Now' : 'Login to Book'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  heroImageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  heroEmoji: {
    fontSize: 100,
  },
  content: {
    padding: spacing.lg,
    marginTop: -30,
    backgroundColor: colors.bgBase,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.caption,
  },
  soldOut: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    lineHeight: 34,
  },
  infoCardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoCardLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  capacityBox: {
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  capacityText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  capacityPercent: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  capacityBarBg: {
    height: 8,
    backgroundColor: colors.bgSurface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  commentItem: {
    backgroundColor: colors.bgSurface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  commentTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  commentText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  commentInputRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
  },
  commentPostBtn: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginToComment: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 17, 27, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  priceValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 140,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bookBtnText: {
    ...typography.h4,
    color: 'white',
  },
});
