import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, TrendingUp, Wallet, Landmark, PiggyBank, Briefcase } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import HeaderBar from '../../components/HeaderBar';
import { Card, CardContent } from '../../components/Card';
import { DonutChart } from '../../components/charts/DonutChart';
import { GrowthLineChart } from '../../components/charts/GrowthLineChart';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BalanceDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const totalBalance = 145000;
  const growth = 12.5;

  const allocationData = [
    { value: 65000, color: theme.brandPrimary, text: 'Bank' },
    { value: 45000, color: '#10B981', text: 'Savings' },
    { value: 25000, color: '#F59E0B', text: 'Investments' },
    { value: 10000, color: theme.brandNavy, text: 'Cash' },
  ];

  const chartData = [
    { value: 120 }, { value: 125 }, { value: 122 },
    { value: 135 }, { value: 140 }, { value: 145 }, { value: 145 }
  ];

  const accounts = [
    { name: 'HDFC Savings', type: 'Bank', balance: 45000, icon: Landmark, color: theme.brandPrimary },
    { name: 'ICICI Current', type: 'Bank', balance: 20000, icon: Landmark, color: '#3B82F6' },
    { name: 'Emergency Fund', type: 'Savings', balance: 45000, icon: PiggyBank, color: '#10B981' },
    { name: 'Stock Portfolio', type: 'Investment', balance: 25000, icon: Briefcase, color: '#F59E0B' },
    { name: 'Physical Cash', type: 'Cash', balance: 10000, icon: Wallet, color: theme.brandNavy },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Total Balance"
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>NET WORTH</Text>
          <Text style={[styles.heroAmount, { color: theme.textPrimary }]}>रू {totalBalance.toLocaleString()}</Text>
          <View style={[styles.growthBadge, { backgroundColor: `${theme.brandPrimary}15` }]}>
            <TrendingUp size={14} color={theme.brandPrimary} />
            <Text style={[styles.growthText, { color: theme.brandPrimary }]}>+{growth}% this month</Text>
          </View>
        </View>

        {/* ALLOCATION CHART */}
        <View style={styles.section}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.chartCardContent}>
              <View style={styles.chartWrapper}>
                <DonutChart 
                  theme={theme} 
                  data={allocationData} 
                  radius={SCREEN_WIDTH * 0.22}
                  centerLabelText="TOTAL"
                  centerLabelValue={`रू 1.4L`}
                />
              </View>
              <View style={styles.legendGrid}>
                {allocationData.map((item, i) => (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.legendText, { color: theme.textSecondary }]}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* TREND SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Balance Trend</Text>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <View style={styles.trendChartArea}>
                <GrowthLineChart theme={theme} data={chartData} color={theme.brandPrimary} />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* ACCOUNTS LIST */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Breakdown by Account</Text>
          <View style={styles.accountList}>
            {accounts.map((acc, i) => (
              <TouchableOpacity key={i} onPress={() => router.push('/account-detail')}>
                <Card theme={theme} style={styles.accountCard}>
                  <CardContent theme={theme} style={styles.accountContent}>
                    <View style={styles.accountLeft}>
                      <View style={[styles.iconBox, { backgroundColor: `${acc.color}15` }]}>
                        <acc.icon size={20} color={acc.color} />
                      </View>
                      <View>
                        <Text style={[styles.accName, { color: theme.textPrimary }]}>{acc.name}</Text>
                        <Text style={[styles.accType, { color: theme.textSecondary }]}>{acc.type}</Text>
                      </View>
                    </View>
                    <Text style={[styles.accBalance, { color: theme.textPrimary }]}>रू {acc.balance.toLocaleString()}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40, width: '100%', maxWidth: 500, alignSelf: 'center' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: { alignItems: 'center', paddingVertical: 40 },
  heroLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  heroAmount: { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  growthBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginTop: 16 
  },
  growthText: { fontSize: 12, fontWeight: '800' },

  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 16 },
  
  chartCardContent: { padding: 24, alignItems: 'center' },
  chartWrapper: { marginBottom: 32 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '700' },

  cardPadding: { padding: 24 },
  trendChartArea: { height: 160, marginTop: 16 },

  accountList: { gap: 12 },
  accountCard: { borderRadius: 20 },
  accountContent: { 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  accountLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  accName: { fontSize: 15, fontWeight: '800' },
  accType: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  accBalance: { fontSize: 16, fontWeight: '900' },
});
