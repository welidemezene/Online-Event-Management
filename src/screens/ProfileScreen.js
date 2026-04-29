import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { bookings } = useEvents();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>👤</Text>
          <Text style={styles.emptyTitle}>Not Logged In</Text>
          <Text style={styles.emptyText}>Sign in to view your profile and manage settings.</Text>
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

  const myBookingsCount = bookings.filter(b => b.userId === user.uid).length;

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTab' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{myBookingsCount}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Year Member</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.borderLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.borderLight} />
          </TouchableOpacity>

          {user.role === 'admin' && (
            <TouchableOpacity 
              style={[styles.menuItem, { backgroundColor: 'rgba(99,102,241,0.05)' }]}
              onPress={() => navigation.navigate('Admin')}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="settings-outline" size={22} color={colors.primaryLight} />
                <Text style={[styles.menuItemText, { color: colors.primaryLight, fontWeight: '600' }]}>Admin Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.primaryLight} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={22} color={colors.danger} />
              <Text style={[styles.menuItemText, { color: colors.danger }]}>Logout</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statValue: {
    ...typography.h2,
    color: colors.primaryLight,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  menuSection: {
    backgroundColor: colors.bgCard,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 40,
  },
  menuTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
});
