// colors.js — EventSphere design system
export const colors = {
  // Primary palette
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#8B5CF6',
  accent: '#06B6D4',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Backgrounds
  bgBase: '#08080F',
  bgSurface: '#11111B',
  bgCard: '#1A1A27',
  bgElevated: '#222233',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.14)',

  // Gradients (use with expo-linear-gradient)
  gradientPrimary: ['#6366F1', '#8B5CF6'],
  gradientHero: ['#0D0D1A', '#1A0A2E'],
  gradientCard: ['rgba(99,102,241,0.1)', 'rgba(139,92,246,0.05)'],

  // Category colors
  catTech: '#6366F1',
  catMusic: '#EC4899',
  catSports: '#10B981',
  catArt: '#F59E0B',
  catFood: '#EF4444',
  catBusiness: '#06B6D4',
};

export const categoryConfig = {
  tech:     { color: colors.catTech,     bg: 'rgba(99,102,241,0.15)',  emoji: '💻', label: 'Tech' },
  music:    { color: colors.catMusic,    bg: 'rgba(236,72,153,0.15)', emoji: '🎵', label: 'Music' },
  sports:   { color: colors.catSports,   bg: 'rgba(16,185,129,0.15)', emoji: '🏆', label: 'Sports' },
  art:      { color: colors.catArt,      bg: 'rgba(245,158,11,0.15)', emoji: '🎨', label: 'Art' },
  food:     { color: colors.catFood,     bg: 'rgba(239,68,68,0.15)',  emoji: '🍽️', label: 'Food' },
  business: { color: colors.catBusiness, bg: 'rgba(6,182,212,0.15)',  emoji: '💼', label: 'Business' },
};
