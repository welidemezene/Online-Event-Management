import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, categoryConfig, radius } from '../theme';
import EventCard from '../components/EventCard';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import NotificationBanner from '../components/NotificationBanner';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { events } = useEvents();
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(true);
  
  const featuredEvents = events.slice(0, 3);
  const categories = Object.keys(categoryConfig);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NotificationBanner 
        visible={showNotification} 
        onDismiss={() => setShowNotification(false)}
        message="🚀 A new massive Tech conference was just added!"
        type="success"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Guest'} 👋</Text>
            <Text style={styles.tagline}>Ready for your next event?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')} style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'G'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <LinearGradient
          colors={colors.gradientHero}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroBadge}>
            <View style={styles.heroDot} />
            <Text style={styles.heroBadgeText}>Ethiopia's #1 Platform</Text>
          </View>
          
          <Text style={styles.heroTitle}>Discover Amazing</Text>
          <Text style={styles.heroTitleAccent}>Experiences</Text>
          
          <TouchableOpacity 
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('EventsList', { focusSearch: true })}
          >
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <Text style={styles.searchText}>Search for events, venues...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventsList')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map(cat => {
              const conf = categoryConfig[cat];
              return (
                <TouchableOpacity 
                  key={cat} 
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('EventsList', { category: cat })}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: conf.bg, borderColor: conf.color }]}>
                    <Text style={{ fontSize: 24 }}>{conf.emoji}</Text>
                  </View>
                  <Text style={styles.categoryLabel}>{conf.label}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Featured Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EventsList')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.eventsGrid}>
            {featuredEvents.map(event => (
              <EventCard 
                key={event.eventId} 
                event={event} 
                onPress={() => navigation.navigate('EventDetail', { eventId: event.eventId })}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  tagline: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99,102,241,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.4)',
    marginBottom: spacing.lg,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },
  heroBadgeText: {
    ...typography.caption,
    color: colors.primaryLight,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  heroTitleAccent: {
    ...typography.h2,
    color: colors.accent,
    marginBottom: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  searchText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 10,
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.bodySmall,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  eventsGrid: {
    paddingHorizontal: spacing.lg,
  },
});
