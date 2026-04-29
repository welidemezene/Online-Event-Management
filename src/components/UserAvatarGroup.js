import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AVATAR_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
];

function getColorFromName(name = '') {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function SingleAvatar({ name = '?', size = 36, style }) {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  const color = getColorFromName(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>
        {initials}
      </Text>
    </View>
  );
}

export default function UserAvatarGroup({
  users = [],
  max = 4,
  size = 36,
  onPress,
  showLabel = true,
}) {
  const visibleUsers = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.avatarRow}>
        {visibleUsers.map((user, index) => (
          <SingleAvatar
            key={user.uid || index}
            name={user.name || '?'}
            size={size}
            style={[
              styles.overlappingAvatar,
              {
                marginLeft: index === 0 ? 0 : -(size * 0.3),
                zIndex: visibleUsers.length - index,
                borderWidth: 2,
                borderColor: '#0f0f1a',
              },
            ]}
          />
        ))}

        {overflow > 0 && (
          <View
            style={[
              styles.avatar,
              styles.overflowBadge,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: -(size * 0.3),
              },
            ]}
          >
            <Text style={[styles.overflowText, { fontSize: size * 0.3 }]}>
              +{overflow}
            </Text>
          </View>
        )}
      </View>

      {showLabel && users.length > 0 && (
        <Text style={styles.label}>
          {users.length} {users.length === 1 ? 'attendee' : 'attendees'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlappingAvatar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    color: 'white',
    fontWeight: '700',
  },
  overflowBadge: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#0f0f1a',
  },
  overflowText: {
    color: '#9ca3af',
    fontWeight: '700',
  },
  label: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
