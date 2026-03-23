import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Search,
  Download,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { TransactionItem } from "../../components/TransactionItem";
import { Card } from "../../components/Card";
import { SegmentTabs } from "../../components/SegmentTabs";
import HeaderBar from "../../components/HeaderBar";

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

interface TransactionGroup {
  month: string;
  data: Transaction[];
}

export default function TransactionsListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const transactionGroups: TransactionGroup[] = [
    {
      month: "February 2026",
      data: [
        { id: 1, title: "Grocery Shopping", category: "Food", amount: -1250, date: "Today, 10:45 AM", type: "expense" },
        { id: 2, title: "Monthly Salary", category: "Work", amount: 75000, date: "Feb 21, 2026", type: "income" },
        { id: 3, title: "Electricity Bill", category: "Bills", amount: -4800, date: "Feb 20, 2026", type: "expense" },
        { id: 4, title: "The Pizza Place", category: "Food", amount: -1560, date: "Feb 19, 2026", type: "expense" },
      ],
    },
    {
      month: "January 2026",
      data: [
        { id: 5, title: "Freelance Project", category: "Work", amount: 15000, date: "Jan 28, 2026", type: "income" },
        { id: 6, title: "Amazon Purchase", category: "Shopping", amount: -3200, date: "Jan 25, 2026", type: "expense" },
      ],
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER SECTION */}
      <HeaderBar
        theme={theme}
        title="Transactions"
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <Download size={18} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* SEARCH & TABS */}
      <View style={[styles.filterSection, { backgroundColor: theme.background }]}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchIcon}>
            <Search size={18} color={theme.textSecondary} />
          </View>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="Search by name or category..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={{ marginTop: 8 }}>
          <SegmentTabs
            theme={theme}
            tabs={["All", "Income", "Expenses"]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </View>
      </View>

      {/* LIST SECTION */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {transactionGroups.map((group) => (
          <View key={group.month}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              {group.month}
            </Text>
            <View style={styles.groupItems}>
              {group.data.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => router.push('/transaction-detail' as any)}
                  activeOpacity={0.7}
                >
                  <Card theme={theme} style={styles.transactionCard}>
                    <TransactionItem 
                      title={item.title} 
                      date={item.date} 
                      amount={item.amount} 
                    />
                  </Card>
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
  container: { flex: 1, alignItems: 'center' },
  filterSection: { padding: 24, paddingBottom: 16, width: '100%', maxWidth: 500, zIndex: 10 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: { position: "relative", marginBottom: 20 },
  searchIcon: { position: "absolute", left: 18, top: "50%", marginTop: -9, zIndex: 2 },
  searchInput: {
    width: "100%",
    paddingVertical: 16,
    paddingLeft: 52,
    paddingRight: 16,
    borderRadius: 18,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: "600",
  },

  listContent: { width: '100%', maxWidth: 500, paddingHorizontal: 20, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginVertical: 16,
    marginLeft: 4,
    opacity: 0.8,
  },
  groupItems: { gap: 12 },
  transactionCard: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});
