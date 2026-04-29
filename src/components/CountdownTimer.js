import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const diff = target - Date.now();
      
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <View style={styles.container}>
      <View style={styles.unit}>
        <Text style={styles.value}>{timeLeft.d}</Text>
        <Text style={styles.label}>Days</Text>
      </View>
      <View style={styles.unit}>
        <Text style={styles.value}>{timeLeft.h}</Text>
        <Text style={styles.label}>Hours</Text>
      </View>
      <View style={styles.unit}>
        <Text style={styles.value}>{timeLeft.m}</Text>
        <Text style={styles.label}>Mins</Text>
      </View>
      <View style={styles.unit}>
        <Text style={styles.value}>{timeLeft.s}</Text>
        <Text style={styles.label}>Secs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  unit: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
