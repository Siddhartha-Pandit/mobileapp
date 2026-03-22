import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus, MoreVertical, TrendingUp, TrendingDown, Wallet, History, ShoppingCart, Car, ChevronLeft
} from "lucide-react-native";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { CreditCardAccountCard } from "../../components/CreditCardAccountCard";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";

/* ================= TYPES ================= */
interface AccountItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  change: number;
  lastTx: string;
  lastTxIcon: React.ReactNode;
  color: string;
  category: string;
}

export default function AccountsDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Bank", "Cash", "Digital Wallet", "Credit Card", "Investment"];

  const accounts: AccountItem[] = [
    {
      id: "1",
      name: "HDFC Bank",
      type: "Savings Account",
      balance: 120000,
      change: 2.5,
      lastTx: "₨ 500 at Starbucks",
      lastTxIcon: <ShoppingCart size={12} />,
      color: "#1132d4",
      category: "Bank",
    },
    {
      id: "2",
      name: "Petty Cash",
      type: "Physical Cash",
      balance: 5400,
      change: -1.2,
      lastTx: "₨ 200 for Auto",
      lastTxIcon: <Car size={12} />,
      color: "#10b981",
      category: "Cash",
    },
    {
      id: "3",
      name: "SBI Cash",
      type: "Bank account Cash",
      balance: 2000,
      change: 1.2,
      lastTx: "₨ 500 for Auto",
      lastTxIcon: <Car size={12} />,
      color: "#439278",
      category: "Cash",
    },
  ];

  const filteredAccounts = activeTab === "All"
    ? accounts
    : accounts.filter((acc) => acc.category === activeTab);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Accounts</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.addBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity 
             onPress={() => router.push('/add-account' as any)} 
             style={[styles.addBtn, { backgroundColor: theme.surface, borderColor: theme.brandPrimary }]}
          >
             <Plus size={20} color={theme.brandPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. TOTAL BALANCE SUMMARY */}
        <View style={styles.cardWrapper}>
          <CreditCardAccountCard
            theme={theme}
            bank="Total Portfolio"
            number="NET WORTH SUMMARY"
            balance={totalBalance}
            style={styles.creditCardBox}
          />
        </View>

        {/* 2. CATEGORY FILTER */}
        <View style={styles.filtersWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
            {categories.map((cat) => {
               const isActive = activeTab === cat;
               return (
                 <TouchableOpacity
                   key={cat}
                   onPress={() => setActiveTab(cat)}
                   style={[
                     styles.tabBtn,
                     {
                       backgroundColor: isActive ? theme.brandPrimary : theme.surface,
                       borderColor: isActive ? 'transparent' : `${theme.border}80`,
                     }
                   ]}
                 >
                   <Text style={[styles.tabBtnText, { color: isActive ? "#fff" : theme.textSecondary }]}>
                     {cat}
                   </Text>
                 </TouchableOpacity>
               );
            })}
          </ScrollView>
        </View>

        {/* 3. ACCOUNT LIST */}
        <View style={styles.listContainer}>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((acc) => (
              <TouchableOpacity key={acc.id} onPress={() => router.push(`/account-detail` as any)} activeOpacity={0.8}>
                 <AccountCard account={acc} theme={theme} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
               <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                 No accounts in {activeTab}
               </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const AccountCard = ({ account, theme }: { account: AccountItem; theme: AppTheme }) => {
  const isPositive = account.change > 0;
  return (
    <Card theme={theme} style={{ marginBottom: 16 }}>
      <CardContent theme={theme} style={{ padding: 0 }}>
        {/* Header Part */}
        <View style={styles.cardHeaderArea}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardHeaderIconBox, { backgroundColor: `${account.color}15` }]}>
              <Wallet size={20} color={account.color} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{account.name}</Text>
              <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>{account.type}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MoreVertical size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Balance Part */}
        <View style={styles.cardBalanceArea}>
          <View>
            <Text style={[styles.cardBalanceLabel, { color: theme.textSecondary }]}>AVAILABLE BALANCE</Text>
            <Text style={[styles.cardBalanceAmount, { color: theme.textPrimary }]}>
              ₨ {account.balance.toLocaleString()}
            </Text>
          </View>
          <View style={[
             styles.changeBadge,
             { backgroundColor: isPositive ? `${theme.brandPrimary}15` : `${theme.danger || '#f43f5e'}15` }
          ]}>
             {isPositive ? (
                <TrendingUp size={14} color={theme.brandPrimary} />
             ) : (
                <TrendingDown size={14} color={theme.danger || '#f43f5e'} />
             )}
            <Text style={[styles.changeText, { color: isPositive ? theme.brandPrimary : (theme.danger || '#f43f5e') }]}>
               {Math.abs(account.change)}%
            </Text>
          </View>
        </View>

        {/* Footer Part */}
        <View style={[styles.cardFooter, { borderTopColor: `${theme.border}40`, backgroundColor: `${theme.surface}95` }]}>
          <History size={14} color={theme.textSecondary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Last Activity: <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>{account.lastTx}</Text>
          </Text>
        </View>
      </CardContent>
    </Card>
  );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { paddingVertical: 12, paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' },
  cardWrapper: { paddingHorizontal: 20, marginBottom: 32 },
  creditCardBox: {
    width: "100%",
    aspectRatio: 1.58,
    maxHeight: 220,
    elevation: 10,
  },
  filtersWrapper: { marginBottom: 24 },
  filtersScroll: { paddingHorizontal: 20, gap: 10 },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabBtnText: { fontSize: 13, fontWeight: "800" },
  listContainer: { paddingHorizontal: 20, gap: 16 },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyStateText: { fontSize: 14, fontWeight: "600" },

  cardHeaderArea: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 14 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardHeaderIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  cardCategory: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  cardBalanceArea: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 20, paddingBottom: 20 },
  cardBalanceLabel: { fontSize: 10, fontWeight: "800", opacity: 0.7, marginBottom: 4, letterSpacing: 0.5 },
  cardBalanceAmount: { fontSize: 26, fontWeight: "900" },
  changeBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  changeText: { fontSize: 13, fontWeight: "800" },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14, paddingHorizontal: 20, borderTopWidth: 1 },
  footerText: { fontSize: 12, fontWeight: "500" }
});
