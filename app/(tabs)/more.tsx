import { useRouter } from "expo-router";
import {
  Briefcase,
  Calculator,
  ChevronLeft,
  Coins,
  CreditCard,
  FileDown,
  FolderKanban,
  Gem, 
  Goal,
  HeartHandshake,
  Landmark,
  Palette,
  PieChart,
  PiggyBank,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  LogOut,
  DollarSign,
  Server
} from "lucide-react-native";
import React from "react";
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../../components/HeaderBar";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // Mock admin state (TODO: Map to actual user role state)
  const isAdmin = true;

  const menuGroups: { title: string; items: { label: string; Icon: React.ComponentType<{ size: number; color: string }>; color: string; path: string }[] }[] = [
    {
      title: "Investments",
      items: [
        { label: "Portfolio", Icon: Briefcase, color: "#8B5CF6", path: "/portfolio-list" },
        { label: "Buy Stocks", Icon: TrendingUp, color: "#10B981", path: "/buy-securities" },
        { label: "Sell Stocks", Icon: TrendingDown, color: "#DC2626", path: "/sell-securities" },
        { label: "Gold & Silver", Icon: Coins, color: "#F59E0B", path: "/buy-gold" },
        { label: "Sell Metal", Icon: Gem, color: "#F59E0B", path: "/sell-gold" },
        { label: "Screener", Icon: Search, color: "#3B82F6", path: "/screener" },
      ]
    },
    {
      title: "Recurring Flows",
      items: [
        { label: "Recurring", Icon: RefreshCw, color: "#10B981", path: "/recurring-transactions" },
        { label: "Subs", Icon: CreditCard, color: "#6366F1", path: "/subscriptions" },
      ]
    },
    {
      title: "Loans & EMI",
      items: [
        { label: "Loans", Icon: Landmark, color: "#EF4444", path: "/loans" },
        { label: "Calculator", Icon: Calculator, color: "#334155", path: "/emi-calc" },
      ]
    },
    {
      title: "Social & Shared",
      items: [
        { label: "People", Icon: Users, color: "#6366F1", path: "/people-list" },
        { label: "Split Bill", Icon: Receipt, color: "#F59E0B", path: "/split-bill" },
        { label: "Owed/Owe", Icon: HeartHandshake, color: "#10B981", path: "/loans" },
      ]
    },
    {
      title: "Account & Goals",
      items: [
        { label: "Account", Icon: PiggyBank, color: "#6366F1", path: "/accounts-list" },
        { label: "Categories", Icon: FolderKanban, color: "#F59E0B", path: "/manage-categories" },
        { label: "Goal", Icon: Goal, color: "#10B981", path: "/manage-goal" },
        { label: "Currency", Icon: DollarSign, color: "#8B5CF6", path: "/manage-currency" },
      ]
    },
    {
      title: "Analysis & Data",
      items: [
        { label: "Insights", Icon: PieChart, color: theme.brandPrimary, path: "/analytics" },
        { label: "Export", Icon: FileDown, color: "#EC4899", path: "/export-data" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { label: "Theme", Icon: Palette, color: "#EC4899", path: "/manage-theme" },
        { label: "Security", Icon: Shield, color: "#8B5CF6", path: "/manage-security" },
        { label: "Settings", Icon: Settings, color: "#64748B", path: "/settings" },
      ]
    }
  ];

  if (isAdmin) {
    menuGroups.push({
      title: "Admin Tools",
      items: [
        { label: "Cron Jobs", Icon: Server, color: "#EF4444", path: "/admin-cron" },
      ]
    });
  }

  const handleLogout = () => {
    console.log("Logging out...");
    router.replace('/login' as any);
  };

  const isTablet = SCREEN_WIDTH > 600;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="More"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentWrapper}>
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
                    activeOpacity={0.7}
                    style={styles.gridItem}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
                      <item.Icon size={22} color={item.color} />
                    </View>
                    <Text style={[styles.itemLabel, { color: theme.textPrimary }]} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 120,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 800, // Wider for the grid layout
    alignSelf: 'center',
  },
  groupContainer: { marginBottom: 40 },
  groupTitle: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 20,
    paddingLeft: 4,
  },
  gridContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8,
  },
  gridItem: {
    // Each row: 4 items with gap 8 between = (100% - 3*8) / 4
    // Use flex basis so items fill rows without trailing right gap
    flexBasis: '22%',
    flexGrow: 1,
    maxWidth: '25%',
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 14,
  },
  logoutSection: { marginTop: 20, paddingHorizontal: 4 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
