import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreditCard, RefreshCw, ChevronRight, BellOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function SubscriptionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Mock data representing subscriptions derived from recurring transactions
  const subscriptions = [
    { id: '1', name: 'Netflix Premium', amount: '1,299', period: 'Monthly', nextDate: 'Apr 12, 2024', color: '#E50914' },
    { id: '2', name: 'Spotify Family', amount: '999', period: 'Monthly', nextDate: 'Apr 18, 2024', color: '#1DB954' },
    { id: '3', name: 'iCloud Storage', amount: '299', period: 'Monthly', nextDate: 'Apr 20, 2024', color: '#007AFF' },
    { id: '4', name: 'Gym Membership', amount: '4,500', period: 'Monthly', nextDate: 'May 01, 2024', color: '#F59E0B' },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Subscriptions"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.summaryBox}>
            <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>₨ 7,097</Text>
            <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>TOTAL MONTHLY RECURRING</Text>
          </View>

          <View style={styles.listSection}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ACTIVE SUBSCRIPTIONS</Text>
            <View style={styles.list}>
              {subscriptions.map((sub) => (
                <TouchableOpacity 
                  key={sub.id} 
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/recurring-detail', params: { id: sub.id } } as any)}
                >
                  <Card theme={theme} style={styles.subCard}>
                    <CardContent theme={theme} style={styles.cardContent}>
                      <View style={styles.cardLeft}>
                         <View style={[styles.iconBox, { backgroundColor: `${sub.color}10` }]}>
                            <CreditCard size={24} color={sub.color} />
                         </View>
                         <View>
                            <Text style={[styles.subName, { color: theme.textPrimary }]}>{sub.name}</Text>
                            <Text style={[styles.subDetail, { color: theme.textSecondary }]}>{sub.period} • Next: {sub.nextDate}</Text>
                         </View>
                      </View>
                      <View style={styles.cardRight}>
                         <Text style={[styles.subAmount, { color: theme.textPrimary }]}>₨ {sub.amount}</Text>
                         <ChevronRight size={18} color={theme.textSecondary} />
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* EMPTY STATE FOR BILLS (REMOVED as per request) */}
          <Card theme={theme} style={styles.manageCard}>
            <CardContent theme={theme} style={styles.manageContent}>
               <View style={[styles.iconBox, { backgroundColor: `${theme.brandPrimary}10` }]}>
                  <RefreshCw size={20} color={theme.brandPrimary} />
               </View>
               <View style={{ flex: 1 }}>
                  <Text style={[styles.manageTitle, { color: theme.textPrimary }]}>Manage All Recurrings</Text>
                  <Text style={[styles.manageDesc, { color: theme.textSecondary }]}>View and edit your payment cycles</Text>
               </View>
               <PrimaryButton 
                  theme={theme} 
                  title="View" 
                  onPress={() => router.push('/recurring-transactions' as any)}
                  style={{ width: 80, height: 40, paddingVertical: 0, borderRadius: 12 }}
               />
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Add New Subscription"
          theme={theme}
          onPress={() => router.push('/add-recurring' as any)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 220,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  container: { flex: 1 },
  summaryBox: { alignItems: 'center', marginBottom: 40, marginTop: 12 },
  totalAmount: { fontSize: 42, fontWeight: '900' },
  totalLabel: { fontSize: 11, fontWeight: '900', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1.5 },
  listSection: { gap: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 4 },
  list: { gap: 14 },
  subCard: { borderRadius: 28, borderWidth: 1.5, borderColor: 'transparent' },
  cardContent: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  subName: { fontSize: 16, fontWeight: '800' },
  subDetail: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  subAmount: { fontSize: 17, fontWeight: '900' },
  manageCard: { marginTop: 40, borderRadius: 28, backgroundColor: 'transparent', borderStyle: 'dashed', borderWidth: 1.5 },
  manageContent: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  manageTitle: { fontSize: 15, fontWeight: '800' },
  manageDesc: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  footer: { 
    position: 'absolute', 
    bottom: 72, 
    left: 0, 
    right: 0, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
  },
});
