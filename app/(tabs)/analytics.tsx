import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  ChevronLeft,
  Download,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Target,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { CreditCardAccountCard } from "../../components/CreditCardAccountCard";
import { SectionHeader } from "../../components/SectionHeader";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { GrowthLineChart } from "../../components/charts/GrowthLineChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { MiniSparkline } from "../../components/charts/MiniSparkline";

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const isDark = theme.background === "#121212";
  const [activeRange, setActiveRange] = React.useState("1M");

  const ranges = ["1W", "1M", "3M", "1Y", "ALL"];

  const portfolioData = [
    { value: 40000 },
    { value: 45000 },
    { value: 42000 },
    { value: 48000 },
    { value: 55000 },
    { value: 52000 },
    { value: 60000 },
    { value: 68000 },
    { value: 75703 },
  ];

  const pieData = [
    { value: 40, color: theme.brandPrimary, text: '40%' },
    { value: 20, color: "#10b981", text: '20%' },
    { value: 15, color: "#f59e0b", text: '15%' },
    { value: 10, color: "#6366f1", text: '10%' },
    { value: 15, color: "#1e293b", text: '15%' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Financial Analytics"
        leftContent={
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity style={[styles.navBtn, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
            <Download size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HORIZONTAL BANK CARDS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.accountsScroll}
        >
          <CreditCardAccountCard theme={theme} bank="Global Bank" number="4582" balance={124562} style={styles.accountCard} />
          <CreditCardAccountCard
            theme={theme}
            bank="Nabil Bank"
            number="7823"
            balance={85400}
            style={[styles.accountCard, { backgroundColor: "#1e3a8a" }]}
          />
        </ScrollView>

        <View style={styles.mainContent}>
          {/* TOTAL PORTFOLIO AREA CHART */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SectionHeader
                theme={theme}
                title="Net Growth Portfolio"
                variant="label"
                marginBottom={4}
                rightComponent={
                  <TouchableOpacity>
                    <MoreVertical size={18} color={theme.textSecondary} />
                  </TouchableOpacity>
                }
              />
              <Text style={[styles.balanceText, { color: theme.textPrimary }]}>₨ 75,703.85</Text>
              <View style={styles.growthRow}>
                <TrendingUp size={14} color="#10b981" />
                <Text style={styles.growthText}>+12.5% </Text>
                <Text style={[styles.growthSubText, { color: theme.textSecondary }]}>vs last month</Text>
              </View>

              {/* TIME RANGE SELECTOR */}
              <View style={styles.rangeWrapper}>
                {ranges.map((range) => {
                  const isActive = activeRange === range;
                  return (
                    <TouchableOpacity
                      key={range}
                      onPress={() => setActiveRange(range)}
                      style={[
                        styles.rangeBtn,
                        isActive && { backgroundColor: `${theme.brandPrimary}15`, borderColor: theme.brandPrimary }
                      ]}
                    >
                      <Text style={[
                        styles.rangeText,
                        { color: isActive ? theme.brandPrimary : theme.textSecondary }
                      ]}>
                        {range}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <View style={styles.chartWrapper}>
                <GrowthLineChart
                  theme={theme}
                  data={portfolioData}
                />
              </View>
            </CardContent>
          </Card>

          {/* SPENDING CATEGORIES */}
          <Card theme={theme} style={styles.card}>
            <CardHeader theme={theme}>
              <CardTitle theme={theme}>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent theme={theme} style={styles.pieContainer}>
              <View style={styles.pieWrapper}>
                <DonutChart
                  theme={theme}
                  data={pieData}
                  centerLabelValue="4,370"
                  centerLabelText="EXPENSE"
                />
              </View>
            </CardContent>
          </Card>

          {/* CREDIT & DEBTS */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SectionHeader
                theme={theme}
                title="Credit & Debts"
                marginBottom={16}
                rightComponent={<MoreVertical size={18} color={theme.textSecondary} />}
              />
              <View style={styles.creditDebtsRow}>
                <View style={[styles.statBox, { backgroundColor: "#10b98112", borderColor: "#10b98120" }]}>
                  <SectionHeader theme={theme} title="RECEIVABLE" variant="label" marginBottom={4} />
                  <Text style={[styles.statAmount, { color: "#10b981" }]}>₨ 1,280</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: "#ef444412", borderColor: "#ef444420" }]}>
                  <SectionHeader theme={theme} title="PAYABLE" variant="label" marginBottom={4} />
                  <Text style={[styles.statAmount, { color: "#ef4444" }]}>₨ 850.75</Text>
                </View>
              </View>

              {["Anish Magar", "Emma Watson", "Sarah Parker"].map((name, i) => (
                <View key={name} style={styles.debtItem}>
                  <View style={[styles.avatar, { backgroundColor: isDark ? theme.background : "#f1f5f9" }]}>
                    <Text style={[styles.avatarText, { color: theme.brandPrimary }]}>{name[0]}</Text>
                  </View>
                  <View style={styles.debtInfo}>
                    <Text style={[styles.debtName, { color: theme.textPrimary }]}>{name}</Text>
                    <Text style={[styles.debtStatus, { color: theme.textSecondary }]}>{i === 0 ? "Owes you" : "You owe"}</Text>
                  </View>
                  <Text style={[styles.debtAmount, { color: i === 0 ? "#10b981" : "#ef4444" }]}>
                    {i === 0 ? "+" : "-"}₨ {i === 0 ? "450" : "320"}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* BUDGET ALLOCATION */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SectionHeader theme={theme} title="Budget Allocation" icon={<Target size={18} color={theme.brandPrimary} />} marginBottom={20} />
              {[
                { label: "Essential Needs", val: 82, color: "#f59e0b" },
                { label: "Personal Wants", val: 65, color: "#ef4444" },
                { label: "Emergency Savings", val: 90, color: "#10b981" },
              ].map((item) => (
                <View key={item.label} style={styles.allocationItem}>
                  <View style={styles.allocationLabels}>
                    <Text style={[styles.allocationName, { color: theme.textPrimary }]}>{item.label}</Text>
                    <Text style={[styles.allocationPercent, { color: item.color }]}>{item.val}%</Text>
                  </View>
                  <View style={[styles.progressBg, { backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }]}>
                    <View style={[styles.progressFill, { width: `${item.val}%`, backgroundColor: item.color }]} />
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>

          {/* TRANSACTIONS SECTION */}
          <View style={styles.transactionsSection}>
            <SectionHeader
              theme={theme}
              title="Transactions"
              marginBottom={16}
              rightComponent={
                <TouchableOpacity>
                  <Text style={[styles.seeAllBtn, { color: theme.brandPrimary }]}>See All</Text>
                </TouchableOpacity>
              }
            />
            <Card theme={theme} style={styles.transactionTrendCard}>
              <CardContent theme={theme} style={styles.transactionTrendContent}>
                <SectionHeader theme={theme} title="WEEKLY CASHFLOW" variant="label" marginBottom={12} />
                <View style={styles.miniChartWrapper}>
                  <MiniSparkline
                    theme={theme}
                    data={portfolioData}
                  />
                </View>
              </CardContent>
            </Card>

            {[
              { n: "Amazon Prime", d: "Sept 18", a: "-84.50" },
              { n: "Project Salary", d: "Sept 15", a: "+5,240", g: true },
            ].map((t, i) => (
              <View key={i} style={[styles.transactionItem, { backgroundColor: theme.surface, borderColor: `${theme.border}60` }]}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? theme.background : "#f8fafc" }]}>
                  {t.g ? <ArrowDownLeft color="#10b981" size={20} /> : <ArrowUpRight color="#ef4444" size={20} />}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionName, { color: theme.textPrimary }]}>{t.n}</Text>
                  <Text style={[styles.transactionDate, { color: theme.textSecondary }]}>{t.d}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: t.g ? "#10b981" : theme.textPrimary }]}>{t.a}</Text>
              </View>
            ))}
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
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  accountsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  accountCard: {
    width: 280,
  },
  mainContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    padding: 0,
    overflow: "hidden",
  },
  cardContent: {
    padding: 24,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: "900",
    marginVertical: 4,
  },
  growthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  growthText: {
    color: "#10b981",
    fontSize: 12,
    fontWeight: "800",
  },
  growthSubText: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
  },
  chartWrapper: {
    height: 160,
    marginLeft: -20,
  },
  pieContainer: {
    paddingBottom: 24,
    alignItems: "center",
  },
  pieWrapper: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelType: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  centerLabelValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  creditDebtsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  statAmount: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4,
  },
  debtItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "900",
  },
  debtInfo: {
    flex: 1,
  },
  debtName: {
    fontSize: 14,
    fontWeight: "700",
  },
  debtStatus: {
    fontSize: 11,
  },
  debtAmount: {
    fontSize: 14,
    fontWeight: "900",
  },
  allocationItem: {
    marginBottom: 16,
  },
  allocationLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  allocationName: {
    fontSize: 12,
    fontWeight: "800",
  },
  allocationPercent: {
    fontSize: 12,
    fontWeight: "800",
  },
  progressBg: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  transactionsSection: {
    paddingBottom: 20,
  },
  seeAllBtn: {
    fontSize: 13,
    fontWeight: "800",
  },
  transactionTrendCard: {
    marginBottom: 12,
  },
  transactionTrendContent: {
    padding: 16,
  },
  miniChartWrapper: {
    height: 60,
    marginLeft: -20,
  },
  transactionItem: {
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 15,
    fontWeight: "800",
  },
  transactionDate: {
    fontSize: 11,
    fontWeight: "600",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "900",
  },
  rangeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  rangeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
