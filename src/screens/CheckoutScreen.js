import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography, radius } from '../theme';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import PulseLoader from '../components/PulseLoader';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId, eventTitle, price } = route.params;
  
  const { bookEvent } = useEvents();
  const { user } = useAuth();
  
  const [method, setMethod] = useState('chapa');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const insets = useSafeAreaInsets();

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate network delay for payment processing
    setTimeout(async () => {
      try {
        await bookEvent(user.uid, eventId);
        setProcessing(false);
        setSuccess(true);
        
        // Wait 1.5 seconds on success screen, then redirect
        setTimeout(() => {
          navigation.navigate('MainTabs', { screen: 'TicketsTab' });
        }, 1500);
        
      } catch (error) {
        setProcessing(false);
        Alert.alert("Payment Failed", error.message);
      }
    }, 2000);
  };

  if (success) {
    return (
      <View style={styles.centerContainer}>
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.2)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={64} color="white" />
        </View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successText}>Your secure digital ticket is ready.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={processing}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Secure Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Paying for</Text>
          <Text style={styles.summaryTitle}>{eventTitle}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryPrice}>ETB {price}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <TouchableOpacity 
          style={[styles.methodCard, method === 'chapa' && styles.methodActive]}
          onPress={() => setMethod('chapa')}
          disabled={processing}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.radio, method === 'chapa' && styles.radioActive]}>
              {method === 'chapa' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.methodText}>Chapa</Text>
          </View>
          <Ionicons name="card" size={24} color={colors.primaryLight} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodCard, method === 'telebirr' && styles.methodActive]}
          onPress={() => setMethod('telebirr')}
          disabled={processing}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.radio, method === 'telebirr' && styles.radioActive]}>
              {method === 'telebirr' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.methodText}>Telebirr</Text>
          </View>
          <Ionicons name="phone-portrait" size={24} color={colors.primaryLight} />
        </TouchableOpacity>

      </View>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <TouchableOpacity 
          style={[styles.payBtn, processing && styles.payBtnDisabled]} 
          onPress={handlePayment}
          disabled={processing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.gradientPrimary}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: radius.full, ...StyleSheet.absoluteFillObject }}
          />
          {processing ? (
            <View style={{ zIndex: 1 }}>
              <PulseLoader size={30} color="white" pulseCount={2} speed={1000} />
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 }}>
              <Ionicons name="lock-closed" size={18} color="white" />
              <Text style={styles.payBtnText}>Pay ETB {price}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.bgBase,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xl,
  },
  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryPrice: {
    ...typography.h2,
    color: colors.primaryLight,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgSurface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  methodActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99,102,241,0.05)',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  methodText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 17, 27, 0.95)',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  payBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    ...typography.h4,
    color: 'white',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
