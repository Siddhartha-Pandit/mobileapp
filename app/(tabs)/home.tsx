import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  LayoutGrid,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { BalanceCard } from '../../components/BalanceCard';
import { CreditCardAccountCard } from '../../components/CreditCardAccountCard';
import { MonthYearSelector } from '../../components/MonthYearSelector';
import { TransactionItem } from '../../components/TransactionItem';
import { SectionHeader } from '../../components/SectionHeader';
import { Card, CardHeader, CardContent, CardDescription } from '../../components/Card';

export default function DashboardScreen() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const { theme } = useTheme();
  const router = useRouter();

  const transactions = [
    { title: "Grocery Shopping", date: "Today, 10:45 AM", amount: -1250 },
    { title: "Monthly Salary", date: "Feb 21, 2026", amount: 75000 },
    { title: "Electricity Bill", date: "Feb 20, 2026", amount: -4800 },
    { title: "The Pizza Place", date: "Feb 19, 2026", amount: -1560 },
  ];

  const quickActions = [
    { label: "Income", color: theme.brandPrimary, icon: ArrowDown, link: "/add-money" },
    { label: "Expense", color: "#EF4444", icon: ArrowUp, link: "/add-expense" },
    { label: "Transfer", color: theme.brandNavy, icon: ArrowLeftRight, link: "/transfer" },
    { label: "More", color: theme.surface, icon: LayoutGrid, textColor: theme.textPrimary, link: "/more" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PRIMARY HEADER SECTION */}
        <View style={[styles.header, { backgroundColor: theme.brandNavy }]}>
          <View style={styles.headerDecoration} />
          
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.topBar}>
              <View style={styles.profileRow}>
                <TouchableOpacity 
                  onPress={() => router.push('/edit-profile' as any)}
                  style={[styles.avatarFrame, { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: theme.surface }]}
                >
                  <Image 
                    source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }} 
                    style={styles.avatar} 
                  />
                </TouchableOpacity>
                <View>
                  <Text style={styles.greeting}>Hi, Alex</Text>
                  <Text style={styles.dateText}>February 24, 2026</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={() => router.push('/notifications' as any)}
                style={styles.notifBtn}
              >
                <Bell size={22} color="white" />
                <View style={[styles.notifBadge, { borderColor: theme.brandNavy }]} />
              </TouchableOpacity>
            </View>

            <View style={styles.balanceWrapper}>
              <BalanceCard theme={theme} balance={145000} />
            </View>
          </SafeAreaView>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsContainer}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <View key={i} style={styles.actionItem}>
                <TouchableOpacity
                  onPress={() => router.push(action.link as any)}
                  style={[
                    styles.actionBtn, 
                    { 
                      backgroundColor: action.color,
                      boxShadow: `0 12px 24px -6px ${action.color}60`,
                      elevation: 8 
                    }
                  ]}
                >
                  <Icon size={24} color={action.textColor || "white"} />
                </TouchableOpacity>
                <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>{action.label}</Text>
              </View>
            );
          })}
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.mainContent}>
          
          {/* BUDGET SUMMARY CARD */}
          <Card theme={theme} style={styles.budgetCard}>
            <CardHeader theme={theme} style={styles.budgetCardHeader}>
              <MonthYearSelector />
              <TouchableOpacity 
                onPress={() => router.push('/budget-breakdown' as any)}
                style={styles.detailsBtn}
              >
                <Text style={[styles.detailsBtnText, { color: theme.brandPrimary }]}>DETAILS</Text>
                <ChevronRight size={14} color={theme.brandPrimary} />
              </TouchableOpacity>
            </CardHeader>

            <View style={styles.budgetStatsRow}>
              <View style={styles.budgetStat}>
                <View style={[styles.statIconWrapper, { backgroundColor: `${theme.brandPrimary}15` }]}>
                  <TrendingUp size={20} color={theme.brandPrimary} />
                </View>
                <View>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>INCOME</Text>
                  <Text style={[styles.statAmount, { color: theme.brandPrimary }]}>₨ 75,000</Text>
                </View>
              </View>
              <View style={styles.budgetStat}>
                <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                  <TrendingDown size={20} color="#EF4444" />
                </View>
                <View>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>EXPENSE</Text>
                  <Text style={[styles.statAmount, { color: "#EF4444" }]}>₨ 32,450</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={[styles.progressBarBg, { backgroundColor: `${theme.textSecondary}15` }]}>
                <View style={[styles.progressBarFill, { backgroundColor: theme.brandPrimary, width: '65%' }]} />
              </View>
              <Text style={[styles.progressDesc, { color: theme.textSecondary }]}>
                You've spent <Text style={{ fontWeight: '800', color: theme.brandPrimary }}>65%</Text> of your budget
              </Text>
            </View>
          </Card>

          {/* MY ACCOUNTS SECTION */}
          <View style={styles.sectionContainer}>
            <SectionHeader
              theme={theme}
              title="My Accounts"
              onRightPress={() => router.push('/accounts-list' as any)}
              rightLabel="VIEW ALL"
            />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.accountsScroll}
            >
              <TouchableOpacity onPress={() => router.push('/account-detail' as any)}>
                <CreditCardAccountCard theme={theme} bank="HDFC Bank" number="4210" balance={120500} style={styles.accountCard} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/account-detail' as any)}>
                <CreditCardAccountCard theme={theme} bank="ICICI Bank" number="9802" balance={12450} style={styles.accountCard} />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* RECENT TRANSACTIONS */}
          <View style={styles.sectionContainer}>
            <SectionHeader
              theme={theme}
              title="Recent Transactions"
              onRightPress={() => router.push('/transactions-list' as any)}
              rightLabel="VIEW ALL"
            />
            
            <View style={styles.transactionsList}>
              {transactions.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => router.push('/transaction-detail' as any)}
                >
                  <Card theme={theme} style={styles.transactionCard}>
                    <TransactionItem 
                      title={item.title} 
                      date={item.date} 
                      amount={item.amount} 
                    />
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    width: '100%',
    paddingBottom: 80,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarFrame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  dateText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
  },
  balanceWrapper: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 24,
    marginTop: -44,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mainContent: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  budgetCard: {
    marginBottom: 32,
    padding: 16,
  },
  budgetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontWeight: '800',
    fontSize: 12,
  },
  budgetStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  budgetStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontWeight: '700',
    fontSize: 10,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressSection: {
    width: '100%',
  },
  progressBarBg: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDesc: {
    marginTop: 12,
    fontSize: 13,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  accountsScroll: {
    paddingBottom: 10,
    paddingLeft: 4,
    gap: 16,
  },
  accountCard: {
    width: 220,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    padding: 12,
    paddingHorizontal: 16,
  },
});
