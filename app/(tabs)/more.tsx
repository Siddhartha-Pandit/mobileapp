import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft, Users, PieChart, Settings as SettingsIcon, FileDown, ShieldCheck, 
  Palette, Receipt, HeartHandshake, TrendingUp, Coins, Search, Briefcase, 
  Landmark, Calculator, Timer, ShieldEllipsis, RefreshCw, CalendarClock, 
  CreditCard, FolderKanban, TrendingDown, PiggyBank, Gem, Goal
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const menuGroups = [
    {
      title: "Investments",
      items: [
        { label: "Portfolio", icon: <Briefcase size={22} />, color: "#8B5CF6", path: "/portfolio-list" },
        { label: "Buy Stocks", icon: <TrendingUp size={22} />, color: "#10B981", path: "/buy-securities" },
        { label: "Sell Stocks", icon: <TrendingDown size={22} />, color: "#DC2626", path: "/sell-securities" },
        { label: "Gold & Silver", icon: <Coins size={22} />, color: "#F59E0B", path: "/buy-gold" },
        { label: "Sell Metal", icon: <Gem size={22} />, color: "#F59E0B", path: "/sell-gold" },
        { label: "Screener", icon: <Search size={22} />, color: "#3B82F6", path: "/screener" },
      ]
    },
    {
      title: "Recurring Flows",
      items: [
        { label: "Recurring", icon: <RefreshCw size={22} />, color: "#10B981", path: "/recurring-transactions" },
        { label: "Subs", icon: <CreditCard size={22} />, color: "#6366F1", path: "/subscriptions" },
        { label: "Bills", icon: <CalendarClock size={22} />, color: "#F43F5E", path: "/recurring-bills" },
      ]
    },
    {
      title: "Loans & EMI",
      items: [
        { label: "Loans", icon: <Landmark size={22} />, color: "#EF4444", path: "/loans" },
        { label: "Upcoming", icon: <Timer size={22} />, color: "#F97316", path: "/emi-schedule" },
        { label: "Calculator", icon: <Calculator size={22} />, color: theme.brandNavy, path: "/emi-calc" },
        { label: "Credit Score", icon: <ShieldEllipsis size={22} />, color: "#06B6D4", path: "/credit-score" },
      ]
    },
    {
      title: "Social & Shared",
      items: [
        { label: "People", icon: <Users size={22} />, color: "#6366F1", path: "/people-list" },
        { label: "Split Bill", icon: <Receipt size={22} />, color: "#F59E0B", path: "/split-bill" },
        { label: "Owed/Owe", icon: <HeartHandshake size={22} />, color: "#10B981", path: "/debt-tracker" },
      ]
    },
    {
      title: "Account & Goals",
      items: [
        { label: "Account", icon: <PiggyBank size={22} />, color: "#6366F1", path: "/accounts-list" },
        { label: "Categories", icon: <FolderKanban size={22} />, color: "#F59E0B", path: "/expense-category" },
        { label: "Goal", icon: <Goal size={22} />, color: "#10B981", path: "/budget-setup" },
      ]
    },
    {
      title: "Analysis & Data",
      items: [
        { label: "Insights", icon: <PieChart size={22} />, color: theme.brandPrimary, path: "/insights" },
        { label: "Export", icon: <FileDown size={22} />, color: "#EC4899", path: "/export" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { label: "Theming", icon: <Palette size={22} />, color: theme.brandNavy, path: "/categories" },
        { label: "Security", icon: <ShieldCheck size={22} />, color: "#64748B", path: "/security" },
        { label: "Settings", icon: <SettingsIcon size={22} />, color: "#94A3B8", path: "/settings" },
      ]
    }
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER BAR ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>More</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={<View style={{ width: 44 }} />}
      />

      {/* ================= MAIN CONTENT ================= */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Intro Subtitle */}
        <View style={styles.introBox}>
          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Wealth, recurring flows, and app management
          </Text>
        </View>

        {menuGroups.map((group, idx) => (
          <View key={idx} style={styles.groupContainer}>
            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
              {group.title}
            </Text>

            <View style={styles.gridContainer}>
              {group.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => router.push(item.path as any)}
                  style={styles.gridItem}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
                    {React.cloneElement(item.icon, { color: item.color })}
                  </View>
                  <Text style={[styles.itemLabel, { color: theme.textPrimary }]} numberOfLines={2}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  introBox: { marginBottom: 32, paddingLeft: 4 },
  introText: { fontSize: 13, fontWeight: "600" },
  groupContainer: { marginBottom: 36 },
  groupTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingLeft: 4,
  },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 12 },
  gridItem: {
    width: '22%',
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 14,
  },
});
