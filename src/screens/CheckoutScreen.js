import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
  
  const [method, setMethod] = useState('telebirr');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');

  const PAYMENT_METHODS = [
    { id: 'telebirr', label: 'Telebirr', icon: '📱', ussd: '*127#', hint: 'Dial *127# → Send Money → Enter amount → Copy the reference number here.' },
    { id: 'cbebirr', label: 'CBE Birr', icon: '🏦', ussd: '*847#', hint: 'Dial *847# → Transfer → Enter amount → Copy the reference number here.' },
    { id: 'amole', label: 'Amole', icon: '💳', ussd: 'App', hint: 'Open Amole app → Pay → Enter amount → Copy the reference number here.' },
    { id: 'bank', label: 'Bank Transfer', icon: '🏛️', ussd: 'Ref', hint: 'Transfer to CBE: 1000123456789 (EventSphere Ltd) → Enter your bank reference here.' },
  ];

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method);
  
  const insets = useSafeAreaInsets();

  const handlePayment = async () => {
    if (!reference.trim()) {
      Alert.alert('Reference Required', 'Please enter your payment reference number.');
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      try {
        await bookEvent(user.uid, eventId);
        setProcessing(false);
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('MainTabs', { screen: 'TicketsTab' });
        }, 1500);
      } catch (error) {
        setProcessing(false);
        Alert.alert('Payment Failed', error.message);
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={processing}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Secure Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
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

        {/* Payment Methods Grid */}
        <View style={styles.methodsGrid}>
          {PAYMENT_METHODS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodCard, method === m.id && styles.methodActive]}
              onPress={() => { setMethod(m.id); setReference(''); }}
              disabled={processing}
            >
              <Text style={styles.methodIcon}>{m.icon}</Text>
              <Text style={[styles.methodText, method === m.id && styles.methodTextActive]}>{m.label}</Text>
              <Text style={styles.methodUssd}>{m.ussd}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reference Input */}
        <View style={styles.refSection}>
          <Text style={styles.sectionTitle}>Payment Reference</Text>
          <TextInput
            style={styles.refInput}
            placeholder="Enter reference / transaction ID"
            placeholderTextColor={colors.textMuted}
            value={reference}
            onChangeText={setReference}
            editable={!processing}
          />
          {selectedMethod && (
            <Text style={styles.refHint}>💡 {selectedMethod.hint}</Text>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Pay Button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <TouchableOpacity
          style={[styles.payBtn, (processing || !reference.trim()) && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={processing || !reference.trim()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={colors.gradientPrimary}
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
              <Text style={styles.payBtnText}>Confirm & Pay ETB {price}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
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
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.xl,
  },
  methodCard: {
    width: '47%',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  methodActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
  methodIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  methodText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  methodTextActive: {
    color: colors.primaryLight,
  },
  methodUssd: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  refSection: {
    marginBottom: spacing.lg,
  },
  refInput: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  refHint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
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
