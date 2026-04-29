import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, categoryConfig, radius } from '../theme';
import EventCard from '../components/EventCard';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { events } = useEvents();
  const { user } = useAuth();
  
  const featuredEvents = events.slice(0, 3);
  const categories = Object.keys(categoryConfig);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]} 👋</Text>
            <Text style={styles.tagline}>Ready for your next event?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
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

        <View style={{ height: 40 }} />
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
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99,102,241,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    marginBottom: spacing.md,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  searchText: {
    ...typography.body,
    color: colors.textMuted,
    marginLeft: 8,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
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
