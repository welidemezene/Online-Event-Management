import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function PulseLoader({
  size = 60,
  color = '#6366f1',
  pulseCount = 3,
  speed = 1500,
}) {
  const animations = useRef(
    Array.from({ length: pulseCount }).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const pulseAnimations = animations.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay((speed / pulseCount) * index),
          Animated.timing(anim, {
            toValue: 1,
            duration: speed,
            useNativeDriver: true,
          }),
        ])
      );
    });

    pulseAnimations.forEach((anim) => anim.start());

    return () => {
      pulseAnimations.forEach((anim) => anim.stop());
    };
  }, [animations, pulseCount, speed]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pulse: {
    position: 'absolute',
  },
  centerDot: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});