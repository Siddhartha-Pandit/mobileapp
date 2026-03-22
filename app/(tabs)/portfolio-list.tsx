import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Menu,
  Plus,
  PlusCircle,
  ChevronLeft,
  Info,
  Sparkles,
} from "lucide-react-native";
import { DonutChart } from "../../components/charts/DonutChart";
import { MiniBarChart } from "../../components/charts/MiniBarChart";
import { CircularProgress } from "../../components/charts/CircularProgress";

// Types & Components
import { useTheme } from "../../hooks/useTheme";
import { SectionHeader } from "../../components/SectionHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import type { AppTheme } from "../../constants/theme";

export default function PortfolioListPage() {
  const { theme } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<"portfolios" | "health">("portfolios");

  const statusColors = {
    gain: "#078838",
    loss: theme.danger,
    warning: theme.warning,
    info: theme.brandPrimary,
    emerald: "#10b981",
  };

  const sectorData = [
    { value: 40, color: '#1d4ed8', text: '40%' },
    { value: 18, color: '#3b82f6', text: '18%' },
    { value: 15, color: '#60a5fa', text: '15%' },
    { value: 27, color: '#93c5fd', text: '27%' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.maxContainer}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: theme.surface, maxWidth: 1000, alignSelf: 'center', width: '100%' }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => activeTab === "health" && setActiveTab("portfolios")}>
            {activeTab === "health" ? <ChevronLeft size={22} color={theme.textPrimary} /> : <Menu size={22} color={theme.textPrimary} />}
          </TouchableOpacity>

          <View style={styles.tabsWrapper}>
            <TouchableOpacity onPress={() => setActiveTab("portfolios")} style={[styles.tab, activeTab === "portfolios" && { borderBottomColor: theme.brandPrimary }]}>
              <Text style={[styles.tabText, { color: activeTab === "portfolios" ? theme.brandPrimary : theme.textSecondary }]}>Portfolios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("health")} style={[styles.tab, activeTab === "health" && { borderBottomColor: theme.brandPrimary }]}>
              <Text style={[styles.tabText, { color: activeTab === "health" ? theme.brandPrimary : theme.textSecondary }]}>Overall Health</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.iconBtn}>
            {activeTab === "health" ? <Info size={20} color={theme.textPrimary} /> : <Plus size={22} color={theme.brandPrimary} />}
          </TouchableOpacity>
        </View>

        {/* MAIN CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === "portfolios" ? (
            <View style={styles.tabContent}>
              {/* Portfolio Summary Card */}
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.summaryTop}>
                  <View>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>TOTAL COMBINED VALUE</Text>
                    <Text style={[styles.balanceLarge, { color: theme.textPrimary }]}>NPR 24,80,000</Text>
                  </View>
                  <View style={styles.barChartMini}>
                    <MiniBarChart
                      theme={theme}
                      data={[0.3, 0.6, 0.45, 0.8, 1.0]}
                      color={statusColors.gain}
                      height={32}
                    />
                  </View>
                </View>
                <View style={[styles.cardDivider, { borderTopColor: theme.border }]}>
                  <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Total Combined Gain</Text>
                  <Text style={[styles.gainText, { color: statusColors.gain }]}>+NPR 2,12,000 (9.3%)</Text>
                  <Text style={[styles.cagrText, { color: theme.textSecondary }]}>CAGR: <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>14.2%</Text></Text>
                </View>
              </View>

              <SectionHeader 
                theme={theme}
                title="Active Portfolios"
                paddingHorizontal={24}
                uppercase={true}
                rightComponent={<View style={[styles.badge, { backgroundColor: `${theme.brandPrimary}15` }]}><Text style={[styles.badgeText, { color: theme.brandPrimary }]}>2 Active</Text></View>}
              />

              <PortfolioCard
                theme={theme}
                title="Long Term Investment"
                stocks="12 Stocks"
                risk="Low Risk"
                riskColor={statusColors.gain}
                value="NPR 18,00,000"
                todayChange="+1.2% Today"
                changeColor={statusColors.gain}
                equityWidth="75%"
                profitAmount="+NPR 1,45,000"
              />

              <PortfolioCard
                theme={theme}
                title="Trading Portfolio"
                stocks="5 Stocks"
                risk="Medium Risk"
                riskColor={statusColors.warning}
                value="NPR 6,80,000"
                todayChange="-0.5% Today"
                changeColor={statusColors.loss}
                equityWidth="40%"
                profitAmount="+NPR 67,000"
              />
            </View>
          ) : (
            <View style={styles.tabContent}>
              {/* Main Health Score */}
              <View style={styles.healthScoreContainer}>
                <View style={styles.circularProgressWrapper}>
                  <CircularProgress
                    theme={theme}
                    percentage={86}
                    centerLabel="86"
                    centerSubLabel="/100"
                    color={theme.brandPrimary}
                  />
                  <View style={styles.scoreTextOverlay}>
                    <Text style={[styles.scoreStatus, { color: statusColors.emerald, marginTop: 40 }]}>HEALTHY</Text>
                  </View>
                </View>
                <Text style={[styles.healthDesc, { color: theme.textSecondary }]}>
                  Your portfolio is well-diversified but slightly over-exposed to the <Text style={{ color: theme.brandPrimary, fontWeight: '700' }}>Banking Sector</Text> compared to NEPSE average.
                </Text>
              </View>

              <SectionHeader theme={theme} title="Risk Metrics" uppercase={true} paddingHorizontal={24} marginBottom={12} />
              <View style={styles.metricsGrid}>
                <MetricCard theme={theme} label="CAGR" value="14.2%" status="EXCELLENT" color={statusColors.emerald} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="SHARPE RATIO" value="0.95" status="Excellent" color={statusColors.emerald} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="VOLATILITY" value="26%" status="Moderate" color={statusColors.warning} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="BETA VS NEPSE" value="1.05" status="Market Match" color={theme.textSecondary} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="MAX DRAWDOWN" value="-12.4%" status="Low Risk" color={statusColors.emerald} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
                <MetricCard theme={theme} label="ALPHA" value="+2.1%" status="Overperforming" color={statusColors.emerald} width={SCREEN_WIDTH > 768 ? (SCREEN_WIDTH - 80) / 3 : (SCREEN_WIDTH - 60) / 2} />
              </View>

              <SectionHeader theme={theme} title="Allocation Overview" uppercase={true} paddingHorizontal={24} marginBottom={12} />
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, padding: 24 }]}>
                <View style={styles.pieWrapper}>
                  <DonutChart
                    theme={theme}
                    data={sectorData}
                    centerLabelText="Sectors"
                    radius={80}
                  />
                </View>
                <View style={styles.legendGrid}>
                  <LegendItem color="#1d4ed8" label="Banking" value="40%" theme={theme} />
                  <LegendItem color="#3b82f6" label="Hydro" value="18%" theme={theme} />
                  <LegendItem color="#60a5fa" label="Microfinance" value="15%" theme={theme} />
                  <LegendItem color="#93c5fd" label="Other" value="27%" theme={theme} />
                </View>
              </View>

              <SectionHeader 
                theme={theme} 
                title="AI Portfolio Advisor" 
                icon={<Sparkles size={20} color={theme.brandPrimary} />} 
                uppercase={true} 
                paddingHorizontal={24} 
                rightComponent={<View style={styles.realtimeBadge}><Text style={styles.realtimeBadgeText}>REAL-TIME</Text></View>}
              />
              <View style={styles.advisorList}>
                <AdvisorCard
                  theme={theme}
                  title="Reduce NABIL Bank exposure"
                  confidence="92% Confidence"
                  desc="Sell NPR 50,000 to rebalance sector risk and capture current gains."
                  statusColors={statusColors}
                />
                <AdvisorCard
                  theme={theme}
                  title="Increase Hydro Exposure"
                  confidence="88% Confidence"
                  desc="Add NPR 30,000 in SHL to capitalize on upcoming rainy season production peaks."
                  statusColors={statusColors}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Create Button */}
        <View style={styles.floatingAction}>
          <TouchableOpacity style={[styles.createBtn, { backgroundColor: theme.brandPrimary }]}>
            <PlusCircle size={20} color="#fff" />
            <Text style={styles.createBtnText}>Create New Portfolio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const MetricCard = ({ label, value, status, color, theme, width }: any) => (
  <View style={[styles.metricCard, { backgroundColor: theme.surface, borderColor: theme.border, width }]}>
    <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{value}</Text>
    <Text style={[styles.metricStatus, { color }]}>{status}</Text>
  </View>
);

const LegendItem = ({ color, label, value, theme }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.legendValue, { color: theme.textPrimary }]}>{value}</Text>
  </View>
);

const PortfolioCard = ({ title, stocks, risk, riskColor, value, todayChange, changeColor, equityWidth, profitAmount, theme }: any) => (
  <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, padding: 24, marginBottom: 16 }]}>
    <View style={styles.cardHeaderRow}>
      <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.cardValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
    <View style={styles.cardSubRow}>
      <Text style={[styles.cardSubText, { color: theme.textSecondary }]}>{stocks} • <Text style={{ color: riskColor, fontWeight: '700' }}>{risk}</Text></Text>
      <Text style={[styles.todayChange, { color: changeColor }]}>{todayChange}</Text>
    </View>
    <View style={styles.equityRow}>
      <View style={[styles.equityBg, { backgroundColor: theme.border }]}>
        <View style={[styles.equityFill, { width: equityWidth, backgroundColor: theme.brandPrimary }]} />
      </View>
      <Text style={[styles.equityLabel, { color: theme.textSecondary }]}>{equityWidth} Equity</Text>
    </View>
    <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
      <Text style={[styles.footerLabel, { color: theme.textSecondary }]}>OVERALL GAIN</Text>
      <Text style={[styles.footerAmount, { color: "#078838" }]}>{profitAmount}</Text>
    </View>
  </View>
);

const AdvisorCard = ({ title, confidence, desc, theme, statusColors }: any) => (
  <View style={[styles.advisorCard, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}20` }]}>
    <View style={styles.advisorTop}>
      <Text style={[styles.advisorTitle, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.confidence, { color: statusColors.emerald }]}>{confidence}</Text>
    </View>
    <Text style={[styles.advisorDesc, { color: theme.textSecondary }]}>{desc}</Text>
    <PrimaryButton
      theme={theme}
      title="Simulate Trade"
      onPress={() => {}}
      fullWidth
      style={{ marginTop: 16 }}
    />
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
  header: {
    padding: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  iconBtn: {
    padding: 8,
  },
  tabsWrapper: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 150,
  },
  tabContent: {
    gap: 24,
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryTop: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  balanceLarge: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  barChartMini: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 48,
  },
  miniBar: {
    width: 10,
    borderRadius: 2,
  },
  cardDivider: {
    padding: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  gainText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cagrText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  healthScoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  circularProgressWrapper: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreLarge: {
    fontSize: 36,
    fontWeight: '800',
  },
  scoreStatus: {
    fontSize: 12,
    fontWeight: '700',
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
  },
  metricCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricStatus: {
    fontSize: 10,
    fontWeight: '700',
  },
  pieWrapper: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    flex: 1,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  realtimeBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  realtimeBadgeText: {
    color: "#4338ca",
    fontSize: 10,
    fontWeight: '800',
  },
  advisorList: {
    paddingHorizontal: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardSubText: {
    fontSize: 11,
    fontWeight: '600',
  },
  todayChange: {
    fontSize: 12,
    fontWeight: '800',
  },
  equityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  equityBg: {
    flex: 1,
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  equityFill: {
    height: '100%',
  },
  equityLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  advisorCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  advisorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  advisorTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  confidence: {
    fontSize: 10,
    fontWeight: '700',
  },
  advisorDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  simulateBtn: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  simulateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  floatingAction: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 90,
  },
  createBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 8,
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
  createBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
