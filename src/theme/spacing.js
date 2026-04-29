// spacing.js — layout tokens
export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const radius = {
  sm: 6, md: 12, lg: 16, xl: 24, full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  md: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  lg: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  glow: {
    shadowColor: '#6366F1', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 8,
  },
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '800' },
  h3: { fontSize: 20, fontWeight: '700' },
  h4: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 19 },
  caption: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
};
