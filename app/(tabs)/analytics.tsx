import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  TrendingUp,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const [activeRange, setActiveRange] = React.useState("1M");

  const ranges = ["1W", "1M", "3M", "1Y", "ALL"];

  const portfolioData = [
    { value: 40000 }, { value: 45000 }, { value: 42000 },
    { value: 48000 }, { value: 55000 }, { value: 52000 },
    { value: 60000 }, { value: 68000 }, { value: 75703 },
  ];

  const pieData = [
    { value: 40, color: theme.brandPrimary, text: '40%' },
    { value: 20, color: "#10b981", text: '20%' },
    { value: 15, color: "#f59e0b", text: '15%' },
    { value: 10, color: "#6366f1", text: '10%' },
    { value: 15, color: "#1e293b", text: '15%' },
  ];

  const isTablet = SCREEN_WIDTH > 600;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Insights"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
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
          {/* NET GROWTH CHART */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={[styles.labelSmall, { color: theme.textSecondary }]}>NET GROWTH PORTFOLIO</Text>
                  <Text style={[styles.balanceText, { color: theme.textPrimary }]}>₨ 75,703.85</Text>
                  <View style={styles.growthRow}>
                    <TrendingUp size={14} color="#10b981" />
                    <Text style={styles.growthText}>+12.5% </Text>
                    <Text style={[styles.growthSubText, { color: theme.textSecondary }]}>vs last month</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <MoreVertical size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

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

          {/* BUDGET & SPENDING SECTION */}
          <View style={[styles.statsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
            <Card theme={theme} style={[styles.card, { flex: 1 }]}>
               <CardHeader theme={theme}>
                 <CardTitle theme={theme}>Category Spending</CardTitle>
               </CardHeader>
               <CardContent theme={theme} style={styles.pieContainer}>
                 <DonutChart
                   theme={theme}
                   data={pieData}
                   centerLabelValue="4,370"
                   centerLabelText="TOTAL"
                 />
               </CardContent>
            </Card>

            <Card theme={theme} style={[styles.card, { flex: 1 }]}>
              <CardContent theme={theme} style={styles.cardContent}>
                <SectionHeader theme={theme} title="Budget Status" icon={<Target size={18} color={theme.brandPrimary} />} marginBottom={20} />
                {[
                  { label: "Essential Needs", val: 82, color: "#f59e0b" },
                  { label: "Personal Wants", val: 65, color: "#EF4444" },
                  { label: "Savings Goal", val: 90, color: "#10b981" },
                ].map((item) => (
                  <View key={item.label} style={styles.allocationItem}>
                    <View style={styles.allocationLabels}>
                      <Text style={[styles.allocationName, { color: theme.textPrimary }]}>{item.label}</Text>
                      <Text style={[styles.allocationPercent, { color: item.color }]}>{item.val}%</Text>
                    </View>
                    <View style={[styles.progressBg, { backgroundColor: theme.surface }]}>
                      <View style={[styles.progressFill, { width: `${item.val}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  accountsScroll: { paddingHorizontal: 20, paddingVertical: 16, gap: 16 },
  accountCard: { width: 300, borderRadius: 28 },
  mainContent: { paddingHorizontal: 20, gap: 20, alignSelf: 'center', width: '100%', maxWidth: 800 },
  card: { borderRadius: 32, overflow: "hidden", borderWidth: 1, borderColor: 'transparent' },
  cardContent: { padding: 24 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  labelSmall: { fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  balanceText: { fontSize: 32, fontWeight: "900", marginTop: 4 },
  growthRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  growthText: { color: "#10b981", fontSize: 13, fontWeight: "800" },
  growthSubText: { fontSize: 12, fontWeight: "600" },
  rangeWrapper: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 24 },
  rangeBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderColor: 'transparent' },
  rangeText: { fontSize: 12, fontWeight: '900' },
  chartWrapper: { height: 180, marginLeft: -20, marginBottom: -10 },
  statsGrid: { gap: 20 },
  pieContainer: { paddingBottom: 40, alignItems: "center", justifyContent: 'center', height: 260 },
  allocationItem: { marginBottom: 20 },
  allocationLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  allocationName: { fontSize: 13, fontWeight: "800" },
  allocationPercent: { fontSize: 13, fontWeight: "900" },
  progressBg: { height: 10, borderRadius: 10, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 10 },
});
