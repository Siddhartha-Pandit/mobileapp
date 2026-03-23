import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Briefcase,
  Laptop,
  Home,
  ShoppingCart,
  Bus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  ChevronDown
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { DonutChart } from "../../components/charts/DonutChart";
import type { AppTheme } from "../../constants/theme";

/* ================= TYPES ================= */
interface FinanceItem {
  label: string;
  amount: number;
  budget?: number;
  icon: React.ReactNode;
  color: string;
}

/* ================= MAIN COMPONENT ================= */
export default function BudgetBreakdown() {
  const router = useRouter();
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = React.useState("March 2026");

  const incomeSources: FinanceItem[] = [
    { label: "Main Salary", amount: 65000, icon: <Briefcase size={18} color="#22C55E" />, color: "#22C55E" },
    { label: "Freelance", amount: 10000, icon: <Laptop size={18} color="#86EFAC" />, color: "#86EFAC" },
  ];

  const expenseCategories: FinanceItem[] = [
    { label: "Housing", amount: 15000, budget: 15000, icon: <Home size={18} color="#EF4444" />, color: "#EF4444" },
    { label: "Groceries", amount: 8450, budget: 10000, icon: <ShoppingCart size={18} color="#FB923C" />, color: "#FB923C" },
    { label: "Transport", amount: 4200, budget: 5000, icon: <Bus size={18} color="#6366F1" />, color: "#6366F1" },
  ];

  const totalIncome = incomeSources.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenseCategories.reduce((acc, curr) => acc + curr.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const spentPercent = Math.round((totalExpense / totalIncome) * 100);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 1. HEADER BAR */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Analysis</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity 
            style={[styles.monthSelector, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => {}}
          >
            <Calendar size={14} color={theme.brandPrimary} />
            <Text style={[styles.monthText, { color: theme.textPrimary }]}>{selectedMonth.split(' ')[0]}</Text>
            <ChevronDown size={14} color={theme.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 2. OVERALL HERO CARD */}
        <View style={[styles.heroCard, { backgroundColor: theme.brandNavy, shadowColor: theme.brandNavy }]}>
           <View style={{ alignItems: "center", paddingVertical: 10 }}>
             <DonutChart 
                theme={{...theme, surface: theme.brandNavy, textPrimary: "#FFFFFF", textSecondary: "rgba(255,255,255,0.7)"}} 
                data={[
                  { value: netSavings > 0 ? netSavings : 0, color: "#22C55E" },
                  { value: totalExpense, color: "#EF4444" }
                ]} 
                centerLabelValue={`₨ ${(netSavings / 1000).toFixed(1)}k`} 
                centerLabelText="NET SAVINGS"
                innerCircleColor={theme.brandNavy}
                radius={110}
             />
           </View>

           <View style={styles.heroMetrics}>
              <View style={styles.heroMetricBox}>
                <View style={[styles.dot, { backgroundColor: "#22C55E" }]} />
                <Text style={styles.metricLabel}>Income</Text>
                <Text style={styles.metricValue}>₨ {(totalIncome / 1000).toFixed(1)}k</Text>
              </View>
              <View style={styles.heroMetricBox}>
                <View style={[styles.dot, { backgroundColor: "#EF4444" }]} />
                <Text style={styles.metricLabel}>Expense</Text>
                <Text style={styles.metricValue}>₨ {(totalExpense / 1000).toFixed(1)}k</Text>
              </View>
           </View>
        </View>

        {/* 3. INCOME BREAKDOWN */}
        <SectionTitle title="Income Sources" theme={theme} />
        <View style={styles.listContainer}>
          {incomeSources.map((item, i) => (
            <FinanceRow key={i} item={item} theme={theme} isIncome />
          ))}
        </View>

        {/* 4. EXPENSE BREAKDOWN */}
        <SectionTitle title="Expense Categories" theme={theme} />
        <View style={styles.listContainer}>
          {expenseCategories.map((item, i) => (
            <FinanceRow key={i} item={item} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= SUB-COMPONENTS ================= */

const FinanceRow = ({ item, theme, isIncome }: { item: FinanceItem; theme: AppTheme; isIncome?: boolean }) => {
  const progress = item.budget ? (item.amount / item.budget) * 100 : 0;
  return (
    <Card theme={theme} style={{ marginBottom: 12 }}>
      <CardContent theme={theme} style={{ padding: 16 }}>
        <View style={styles.rowTop}>
          <View style={styles.rowLeft}>
            <View style={[styles.rowIconBox, { backgroundColor: `${item.color}15` }]}>
              {item.icon}
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>{item.label}</Text>
              {item.budget && (
                <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                  Goal: ₨ {item.budget.toLocaleString()}
                </Text>
              )}
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.rowAmount, { color: isIncome ? "#22C55E" : theme.textPrimary }]}>
              ₨ {item.amount.toLocaleString()}
            </Text>
          </View>
        </View>
        
        {item.budget && (
          <View style={[styles.progressBarBg, { backgroundColor: `${theme.border}40` }]}>
            <View style={[styles.progressBarFill, { backgroundColor: item.color, width: `${Math.min(progress, 100)}%` }]} />
          </View>
        )}
      </CardContent>
    </Card>
  );
};

const SectionTitle = ({ title, theme }: { title: string; theme: AppTheme }) => (
  <View style={styles.sectionTitleRow}>
    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
    <ArrowRight size={14} color={theme.textSecondary} />
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { padding: 24, paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' },
  
  heroCard: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
    elevation: 8,
  },

  
  heroMetrics: { flexDirection: "row", justifyContent: "space-between" },
  heroMetricBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  metricLabel: { color: "#FFFFFF", opacity: 0.8, fontSize: 13, fontWeight: "600" },
  metricValue: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },

  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.2 },
  listContainer: { marginBottom: 20 },
  
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  rowIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 15, fontWeight: "800" },
  rowSubtitle: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  rowAmount: { fontSize: 16, fontWeight: "900" },
  progressBarBg: { height: 6, borderRadius: 3, marginTop: 14, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 3 },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  monthText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
