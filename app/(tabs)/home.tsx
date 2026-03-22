import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  ChevronRight,
} from 'lucide-react-native';

const transactions = [
  { id: '1', title: 'Salary Credit', category: 'Income', amount: 85000, date: 'Today, 9:00 AM', type: 'credit' },
  { id: '2', title: 'Grocery Shopping', category: 'Food', amount: -2400, date: 'Today, 11:30 AM', type: 'debit' },
  { id: '3', title: 'Netflix', category: 'Entertainment', amount: -800, date: 'Yesterday', type: 'debit' },
  { id: '4', title: 'Freelance Payment', category: 'Income', amount: 15000, date: 'Mar 20', type: 'credit' },
  { id: '5', title: 'Electricity Bill', category: 'Utilities', amount: -3200, date: 'Mar 19', type: 'debit' },
];

const quickActions = [
  { label: 'Send', icon: ArrowUpRight },
  { label: 'Receive', icon: ArrowDownLeft },
  { label: 'Savings', icon: Wallet },
  { label: 'Invest', icon: TrendingUp },
];

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>Good morning 👋</Text>
            <Text style={[styles.name, { color: theme.textPrimary }]}>Siddhartha</Text>
          </View>
          <TouchableOpacity style={[styles.notifBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Bell size={20} color={theme.textPrimary} />
            <View style={[styles.notifDot, { backgroundColor: theme.danger }]} />
          </TouchableOpacity>
        </View>

        {/* ── Balance Card ── */}
        <View style={[styles.balanceCard, { backgroundColor: theme.brandNavy }]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>रू 1,24,500.00</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceStat}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(10,169,113,0.2)' }]}>
                <TrendingUp size={14} color="#0AA971" />
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={[styles.statValue, { color: '#0AA971' }]}>रू 1,00,000</Text>
              </View>
            </View>
            <View style={[styles.balanceDivider]} />
            <View style={styles.balanceStat}>
              <View style={[styles.statIconBg, { backgroundColor: 'rgba(248,113,113,0.2)' }]}>
                <TrendingDown size={14} color="#F87171" />
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={[styles.statValue, { color: '#F87171' }]}>रू 6,400</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {quickActions.map(({ label, icon: Icon }) => (
            <TouchableOpacity key={label} style={styles.quickAction}>
              <View style={[styles.quickIcon, { backgroundColor: theme.hover, borderColor: theme.border }]}>
                <Icon size={20} color={theme.brandPrimary} />
              </View>
              <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Transactions ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Transactions</Text>
          <TouchableOpacity style={styles.seeAllRow}>
            <Text style={[styles.seeAll, { color: theme.brandPrimary }]}>See All</Text>
            <ChevronRight size={14} color={theme.brandPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.transactionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {transactions.map((tx, idx) => (
            <View key={tx.id}>
              <View style={styles.txRow}>
                <View style={[
                  styles.txIcon,
                  { backgroundColor: tx.type === 'credit'
                      ? 'rgba(10,169,113,0.12)'
                      : 'rgba(248,113,113,0.12)' }
                ]}>
                  {tx.type === 'credit'
                    ? <ArrowDownLeft size={18} color="#0AA971" />
                    : <ArrowUpRight size={18} color="#F87171" />}
                </View>
                <View style={styles.txMeta}>
                  <Text style={[styles.txTitle, { color: theme.textPrimary }]}>{tx.title}</Text>
                  <Text style={[styles.txSub, { color: theme.textSecondary }]}>{tx.date}</Text>
                </View>
                <Text style={[
                  styles.txAmount,
                  { color: tx.type === 'credit' ? '#0AA971' : theme.danger }
                ]}>
                  {tx.type === 'credit' ? '+' : '-'}रू {Math.abs(tx.amount).toLocaleString()}
                </Text>
              </View>
              {idx < transactions.length - 1 && (
                <View style={[styles.txDivider, { backgroundColor: theme.border }]} />
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: { fontSize: 13, fontWeight: '500' },
  name: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Balance card
  balanceCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
  },
  balanceStat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIconBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: '500' },
  statValue: { fontSize: 15, fontWeight: '700', marginTop: 1 },
  balanceDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 8 },

  // Quick actions
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 24,
  },
  quickAction: { alignItems: 'center', gap: 8 },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { fontSize: 12, fontWeight: '600' },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  seeAllRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 13, fontWeight: '600' },

  // Transaction card
  transactionCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txMeta: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '600' },
  txSub: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txDivider: { height: 1, marginLeft: 52 },
});
