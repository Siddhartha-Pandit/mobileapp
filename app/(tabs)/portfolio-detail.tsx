import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Briefcase,
  PieChart as PieIcon,
  ChevronRight,
  ArrowUpRight,
  MoreVertical,
  Edit2,
  Trash2,
  Info,
  Activity,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { DonutChart } from "../../components/charts/DonutChart";
import { MiniBarChart } from "../../components/charts/MiniBarChart";
import { CircularProgress } from "../../components/charts/CircularProgress";
import { SectionHeader } from "../../components/SectionHeader";
import { CustomTabs } from "../../components/CustomTabs";
import { HeaderActionMenu } from "../../components/HeaderActionMenu";

export default function PortfolioDetailPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { title } = useLocalSearchParams();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState("holdings");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const portfolioTitle = (title as string) || "Portfolio Detail";

  const tabOptions = [
    { value: "holdings", label: "Holdings" },
    { value: "health", label: "Health" },
  ];

  const holdings = [
    { id: "1", symbol: "NABIL", name: "Nabil Bank Ltd.", shares: 150, price: 620, change: "+1.2%", value: "NPR 93,000", isGain: true },
    { id: "2", symbol: "NICA", name: "NIC Asia Bank", shares: 200, price: 480, change: "-0.5%", value: "NPR 96,000", isGain: false },
    { id: "3", symbol: "SHL", name: "Soaltee Hotel", shares: 500, price: 410, change: "+2.4%", value: "NPR 205,000", isGain: true },
    { id: "4", symbol: "HDL", name: "Himalayan Distillery", shares: 40, price: 2150, change: "+0.8%", value: "NPR 86,000", isGain: true },
    { id: "5", symbol: "GBIME", name: "Global IME Bank", shares: 350, price: 195, change: "-1.1%", value: "NPR 68,250", isGain: false },
  ];

  const sectorData = [
    { value: 45, color: theme.brandPrimary, text: '45%' },
    { value: 25, color: '#3b82f6', text: '25%' },
    { value: 15, color: '#10b981', text: '15%' },
    { value: 15, color: '#f59e0b', text: '15%' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.maxContainer}>
        <HeaderBar
          theme={theme}
          title={portfolioTitle}
          leftContent={
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <ChevronLeft size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          }
          rightContent={
            <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.iconBtn}>
              <MoreVertical size={22} color={theme.textPrimary} />
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <View style={[styles.mainCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={[styles.label, { color: theme.textSecondary }]}>CURRENT VALUE</Text>
                <View style={styles.valueRow}>
                   <Text style={[styles.valueLarge, { color: theme.textPrimary }]}>NPR 18,45,000</Text>
                   <View style={[styles.badge, { backgroundColor: '#07883815', marginLeft: 12 }]}>
                    <TrendingUp size={14} color="#078838" />
                    <Text style={[styles.badgeText, { color: "#078838" }]}>+12.4%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Invested</Text>
                <Text style={[styles.statValue, { color: theme.textPrimary }]}>NPR 16.2L</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Returns</Text>
                <Text style={[styles.statValue, { color: '#078838' }]}>+NPR 2.25L</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Day's P&L</Text>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>-NPR 4,200</Text>
              </View>
            </View>
          </View>

          {/* TABS SECTION */}
          <View style={styles.tabSection}>
             <CustomTabs
              theme={theme}
              options={tabOptions}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </View>

          {activeTab === "holdings" && (
            <View style={styles.tabContent}>
              <SectionHeader 
                theme={theme} 
                title="Active Holdings" 
                uppercase 
                paddingHorizontal={24}
                rightComponent={<Text style={{ color: theme.brandPrimary, fontWeight: '700' }}>{holdings.length} Assets</Text>}
              />
              <View style={styles.holdingsList}>
                {holdings.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[styles.holdingItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.holdingLeft}>
                      <View style={[styles.symbolIcon, { backgroundColor: theme.background }]}>
                        <Text style={[styles.symbolText, { color: theme.textPrimary }]}>{item.symbol[0]}</Text>
                      </View>
                      <View>
                        <Text style={[styles.holdingSymbol, { color: theme.textPrimary }]}>{item.symbol}</Text>
                        <Text style={[styles.holdingName, { color: theme.textSecondary }]}>{item.shares} Shares</Text>
                      </View>
                    </View>
                    <View style={styles.holdingRight}>
                      <Text style={[styles.holdingValue, { color: theme.textPrimary }]}>{item.value}</Text>
                      <View style={styles.holdingChangeRow}>
                        {item.isGain ? <TrendingUp size={12} color="#078838" /> : <TrendingDown size={12} color="#ef4444" />}
                        <Text style={[styles.holdingChange, { color: item.isGain ? "#078838" : "#ef4444" }]}>{item.change}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeTab === "health" && (
            <View style={styles.tabContent}>
              {/* Health Score Overview */}
              <View style={styles.healthHeader}>
                <CircularProgress
                  theme={theme}
                  percentage={86}
                  centerLabel="86"
                  centerSubLabel="/100"
                  color={theme.brandPrimary}
                  size={160}
                />
                <View style={[styles.healthBadge, { backgroundColor: '#10b98115' }]}>
                    <ShieldCheck size={16} color="#10b981" />
                    <Text style={{ color: "#10b981", fontWeight: '800', fontSize: 13 }}>HEALTHY</Text>
                </View>
                <Text style={[styles.healthDesc, { color: theme.textSecondary }]}>
                  Your portfolio is well-diversified but slightly over-exposed to the <Text style={{ color: theme.brandPrimary, fontWeight: '700' }}>Banking Sector</Text> compared to NEPSE average.
                </Text>
              </View>

              <SectionHeader theme={theme} title="Risk Metrics" uppercase={true} paddingHorizontal={24} marginBottom={12} />
              <View style={styles.metricsGrid}>
                <MetricCard theme={theme} label="CAGR" value="14.2%" status="EXCELLENT" color="#10b981" width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="SHARPE RATIO" value="0.95" status="Excellent" color="#10b981" width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="VOLATILITY" value="26%" status="Moderate" color="#f59e0b" width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="BETA VS NEPSE" value="1.05" status="Market Match" color={theme.textSecondary} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="MAX DRAWDOWN" value="-12.4%" status="Low Risk" color="#10b981" width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="ALPHA" value="+2.1%" status="Overperforming" color="#10b981" width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
              </View>

              {/* Performance Section (Moved to Health) */}
              <SectionHeader theme={theme} title="Growth & Performance" uppercase paddingHorizontal={24} />
              <View style={[styles.performanceInHealth, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.perfHeaderRow}>
                    <View>
                        <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>PORTFOLIO GROWTH</Text>
                        <Text style={[styles.perfValue, { color: theme.textPrimary }]}>+NPR 2,45,000</Text>
                    </View>
                    <View style={styles.timeframeRow}>
                        {['1M', '3M', '6M', '1Y', 'ALL'].map((tf) => (
                        <TouchableOpacity key={tf} style={[styles.tfBtn, tf === '1Y' && { backgroundColor: theme.brandPrimary }]}>
                            <Text style={[styles.tfText, { color: tf === '1Y' ? '#fff' : theme.textSecondary }]}>{tf}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Fixed Graph Alignment */}
                <View style={styles.chartContainerHealth}>
                    <MiniBarChart
                        theme={theme}
                        data={[0.3, 0.45, 0.35, 0.55, 0.4, 0.65, 0.5, 0.8, 0.7, 0.9, 0.85, 1.0, 0.95, 1.1, 1.0, 1.2]}
                        color={theme.brandPrimary}
                        height={120}
                    />
                </View>

                <View style={styles.perfStatsGridMini}>
                    <PerfStat 
                      theme={theme} 
                      label="CAGR" 
                      value="18.5%" 
                      icon={<TrendingUp size={14} color="#10b981" />} 
                    />
                    <PerfStat 
                      theme={theme} 
                      label="Sharpe Ratio" 
                      value="1.2" 
                      icon={<Activity size={14} color={theme.brandPrimary} />} 
                    />
                </View>
              </View>

              {/* Allocation Section (Moved to Health) */}
              <SectionHeader theme={theme} title="Asset Allocation" uppercase paddingHorizontal={24} />
              <View style={[styles.allocationCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.chartWrapper}>
                  <DonutChart
                    theme={theme}
                    data={sectorData}
                    centerLabelText="Assets"
                    radius={55}
                  />
                </View>
                <View style={styles.allocationList}>
                  <AllocationItem color={theme.brandPrimary} label="Banking" value="45%" theme={theme} />
                  <AllocationItem color="#3b82f6" label="Hotels" value="25%" theme={theme} />
                  <AllocationItem color="#10b981" label="Hydro" value="15%" theme={theme} />
                  <AllocationItem color="#f59e0b" label="Cash" value="15%" theme={theme} />
                </View>
              </View>

              {/* Health Metrics */}
              <SectionHeader theme={theme} title="Health Metrics" uppercase paddingHorizontal={24} />
              <View style={styles.metricsWrapper}>
                <HealthMetric 
                  theme={theme} 
                  icon={<Activity size={20} color={theme.brandPrimary} />} 
                  label="Diversification" 
                  value="Optimal" 
                  desc="Portfolio is well-diversified across 4 major sectors."
                />
                <HealthMetric 
                  theme={theme} 
                  icon={<ShieldCheck size={20} color="#10b981" />} 
                  label="Risk Profile" 
                  value="Market Neutral" 
                  desc="Your beta of 1.05 matches the NEPSE market movement."
                />
                <HealthMetric 
                  theme={theme} 
                  icon={<AlertCircle size={20} color="#f59e0b" />} 
                  label="Concentration" 
                  value="Slightly High" 
                  desc="Banking sector exposure (45%) exceeds recommended 30%."
                />
              </View>

              <SectionHeader 
                theme={theme} 
                title="AI Portfolio Advisor" 
                icon={<Sparkles size={20} color={theme.brandPrimary} />} 
                uppercase={true} 
                paddingHorizontal={24} 
              />
              <View style={styles.advisorList}>
                <TouchableOpacity style={[styles.advisorBannerInHealth, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}20`, marginBottom: 12 }]}>
                  <View style={styles.advisorIconBox}>
                      <Activity size={20} color={theme.brandPrimary} />
                  </View>
                  <View style={styles.advisorText}>
                      <Text style={[styles.advisorTitle, { color: theme.brandPrimary }]}>Reduce NABIL Bank exposure</Text>
                      <Text style={[styles.advisorShortDesc, { color: theme.textSecondary }]}>Sell NPR 50,000 to rebalance sector risk and capture current gains.</Text>
                  </View>
                  <ChevronRight size={18} color={theme.brandPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.advisorBannerInHealth, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}20`, marginBottom: 40 }]}>
                   <View style={styles.advisorIconBox}>
                    <Activity size={20} color={theme.brandPrimary} />
                  </View>
                  <View style={styles.advisorText}>
                    <Text style={[styles.advisorTitle, { color: theme.brandPrimary }]}>Increase Hydro Exposure</Text>
                    <Text style={[styles.advisorShortDesc, { color: theme.textSecondary }]}>Add NPR 30,000 in SHL to capitalize on upcoming production peaks.</Text>
                  </View>
                  <ChevronRight size={18} color={theme.brandPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <HeaderActionMenu
          visible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
          theme={theme}
          items={[
            { 
              label: "Edit Portfolio", 
              icon: <Edit2 size={18} color={theme.textPrimary} />, 
              onPress: () => console.log("Edit Pressed") 
            },
            { 
              label: "Delete Portfolio", 
              icon: <Trash2 size={18} color="#ef4444" />, 
              onPress: () => console.log("Delete Pressed"),
              isDestructive: true 
            },
          ]}
        />
      </View>
    </View>
  );
}

const AllocationItem = ({ color, label, value, theme }: any) => (
  <View style={styles.allocationItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={[styles.allocationLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.allocationValue, { color: theme.textPrimary }]}>{value}</Text>
  </View>
);

const HealthMetric = ({ theme, icon, label, value, desc }: any) => (
  <View style={[styles.metricItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.metricTop}>
        <View style={styles.metricLabelRow}>
            {icon}
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>{label}</Text>
        </View>
        <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
    <Text style={[styles.metricDesc, { color: theme.textSecondary }]}>{desc}</Text>
  </View>
);

const MetricCard = ({ label, value, status, color, theme, width }: any) => (
  <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border, width }]}>
    <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.metricCardValue, { color: theme.textPrimary }]}>{value}</Text>
    <Text style={[styles.metricStatus, { color }]}>{status}</Text>
  </View>
);

const PerfStat = ({ theme, label, value, icon }: any) => (
    <View style={styles.perfStatItemMini}>
        <Text style={[styles.statLabelMini, { color: theme.textSecondary }]}>{label}</Text>
        <View style={styles.statValueRow}>
            {icon}
            <Text style={[styles.perfStatValue, { color: theme.textPrimary }]}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maxContainer: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  iconBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainCard: {
    margin: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  valueLarge: {
    fontSize: 32,
    fontWeight: '800',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
  },
  tabSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  tabContent: {
    flex: 1,
  },
  holdingsList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '800',
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: '800',
  },
  holdingName: {
    fontSize: 12,
  },
  holdingRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  holdingValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  holdingChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  holdingChange: {
    fontSize: 13,
    fontWeight: '700',
  },
  healthHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 16,
  },
  performanceInHealth: {
    margin: 24,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  perfHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  perfValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  tfBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tfText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chartContainerHealth: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center', 
    marginVertical: 10,
    width: '100%',
  },
  perfStatsGridMini: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
  },
  perfStatItemMini: {
    flex: 1,
  },
  statLabelMini: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  perfStatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  allocationCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  chartWrapper: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allocationList: {
    flex: 1,
    gap: 10,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allocationLabel: {
    flex: 1,
    fontSize: 13,
  },
  allocationValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricsWrapper: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  metricItem: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  advisorBannerInHealth: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  advisorIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorText: {
    flex: 1,
  },
  advisorTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  advisorShortDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  healthDesc: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 20,
    lineHeight: 20,
    maxWidth: 280,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricCardValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricStatus: {
    fontSize: 10,
    fontWeight: '700',
  },
  advisorList: {
    marginTop: 12,
  },
});
