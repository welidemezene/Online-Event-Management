import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, categoryConfig } from '../theme';

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  const categories = ['all', ...Object.keys(categoryConfig)];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const config = categoryConfig[cat];
        
        return (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              isActive && styles.chipActive,
              isActive && cat !== 'all' && { borderColor: config.color, backgroundColor: config.bg }
            ]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text style={styles.icon}>{cat === 'all' ? '✨' : config.emoji}</Text>
            <Text style={[
              styles.text,
              isActive && styles.textActive,
              isActive && cat !== 'all' && { color: config.color }
            ]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.bgCard,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99,102,241,0.1)',
  },
  icon: {
    fontSize: 14,
  },
  text: {
    ...typography.bodySmall,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
});
