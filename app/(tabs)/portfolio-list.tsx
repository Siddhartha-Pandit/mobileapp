import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Plus,
  PlusCircle,
  ChevronLeft,
  Info,
  Sparkles,
  X,
  Activity,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
} from "lucide-react-native";
import { DonutChart } from "../../components/charts/DonutChart";
import { MiniBarChart } from "../../components/charts/MiniBarChart";
import { CircularProgress } from "../../components/charts/CircularProgress";

import { CustomTabs } from "../../components/CustomTabs";
import { useTheme } from "../../hooks/useTheme";
import { SectionHeader } from "../../components/SectionHeader";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import type { AppTheme } from "../../constants/theme";

export default function PortfolioListPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<string>("portfolios");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");

  const tabOptions = [
    { value: "portfolios", label: "Portfolios" },
    { value: "health", label: "Overall Health" },
  ];

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
        {/* HEADER AREA */}
        <HeaderBar
          theme={theme}
          title="Portfolio"
          leftContent={
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <ChevronLeft size={22} color={theme.textPrimary} />
            </TouchableOpacity>
          }
          rightContent={
            <TouchableOpacity 
              onPress={() => setIsAddModalVisible(true)}
              style={styles.iconBtn}
            >
              <Plus size={22} color={theme.brandPrimary} />
            </TouchableOpacity>
          }
        />

        {/* MAIN CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.tabSection}>
            <CustomTabs 
              theme={theme}
              options={tabOptions}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </View>

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
                onPress={() => router.push({ pathname: "/portfolio-detail", params: { title: "Long Term Investment" } })}
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
                onPress={() => router.push({ pathname: "/portfolio-detail", params: { title: "Trading Portfolio" } })}
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
                <TouchableOpacity style={[styles.advisorBannerList, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}15` }]}>
                  <View style={styles.tabAdvisorIcon}>
                    <Activity size={20} color={theme.brandPrimary} />
                  </View>
                  <View style={styles.advisorTextBody}>
                    <Text style={[styles.advisorTitleText, { color: theme.brandPrimary }]}>Reduce NABIL Bank exposure</Text>
                    <Text style={[styles.advisorDescText, { color: theme.textSecondary }]}>Sell NPR 50,000 to rebalance sector risk and capture current gains.</Text>
                  </View>
                  <ChevronRight size={18} color={theme.brandPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.advisorBannerList, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}15` }]}>
                   <View style={styles.tabAdvisorIcon}>
                    <Activity size={20} color={theme.brandPrimary} />
                  </View>
                  <View style={styles.advisorTextBody}>
                    <Text style={[styles.advisorTitleText, { color: theme.brandPrimary }]}>Increase Hydro Exposure</Text>
                    <Text style={[styles.advisorDescText, { color: theme.textSecondary }]}>Add NPR 30,000 in SHL to capitalize on upcoming production peaks.</Text>
                  </View>
                  <ChevronRight size={18} color={theme.brandPrimary} />
                </TouchableOpacity>
              </View>

              <SectionHeader theme={theme} title="Detailed Health Analysis" uppercase={true} paddingHorizontal={24} marginBottom={12} />
              <View style={styles.detailedMetricsList}>
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
                  desc="Banking sector exposure (40%) exceeds recommended 30%."
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Add Portfolio Modal */}
        <Modal
          visible={isAddModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>New Portfolio</Text>
                <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={styles.closeBtn}>
                  <X size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>PORTFOLIO NAME</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background, 
                    color: theme.textPrimary,
                    borderColor: theme.border
                  }]}
                  placeholder="e.g. Retirement Fund"
                  placeholderTextColor={theme.textSecondary}
                  value={newPortfolioName}
                  onChangeText={setNewPortfolioName}
                  autoFocus
                />
                
                <PrimaryButton
                  title="Create Portfolio"
                  onPress={() => {
                    // Logic to create portfolio would go here
                    setIsAddModalVisible(false);
                    setNewPortfolioName("");
                  } }
                  theme={theme}
                  fullWidth
                  style={{ marginTop: 24 }}
                  disabled={!newPortfolioName.trim()}
                />
              </View>
            </View>
          </View>
        </Modal>
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

const HealthMetric = ({ theme, icon, label, value, desc }: any) => (
  <View style={[styles.metricItemInList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={styles.metricTopPart}>
        <View style={styles.metricLabelArea}>
            {icon}
            <Text style={[styles.metricLabelText, { color: theme.textSecondary }]}>{label}</Text>
        </View>
        <Text style={[styles.metricValueText, { color: theme.textPrimary }]}>{value}</Text>
    </View>
    <Text style={[styles.metricDescText, { color: theme.textSecondary }]}>{desc}</Text>
  </View>
);

const PortfolioCard = ({ theme, title, stocks, risk, riskColor, value, todayChange, changeColor, equityWidth, profitAmount, onPress }: any) => {
  const handlePress = () => {
    Haptics.selectionAsync();
    onPress && onPress();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, padding: 24, marginBottom: 16 }]}
    >
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
    </TouchableOpacity>
  );
};

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
  tabSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingTop: 40, 
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  advisorBannerList: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tabAdvisorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorTextBody: {
    flex: 1,
  },
  advisorTitleText: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  advisorDescText: {
    fontSize: 11,
    lineHeight: 16,
  },
  detailedMetricsList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 30,
  },
  metricItemInList: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricTopPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabelArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricValueText: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricDescText: {
    fontSize: 11,
    lineHeight: 16,
  },
});
