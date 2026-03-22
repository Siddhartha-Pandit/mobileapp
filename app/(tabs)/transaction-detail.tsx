import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  Tag,
  Wallet,
  User,
  Target,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import type { AppTheme } from "../../constants/theme";

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fallback Mock Data
  const data = {
    type: "expense",
    amount: 1240.0,
    category: "Grocery Store",
    account: "Personal Savings",
    date: "20 Oct, 2023",
    time: "04:22 PM",
    note: "Weekly grocery shopping at the central mall.",
    payer: "Green Valley Mart",
    goal: "Monthly Food Budget",
  };

  const isIncome = data.type === "income";

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Details</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => setMenuOpen(!menuOpen)}
              style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
            >
              <MoreVertical size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            {menuOpen && (
              <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: `${theme.border}40`, borderBottomWidth: 1 }]}
                  onPress={() => setMenuOpen(false)}
                >
                  <Text style={[styles.menuText, { color: theme.textPrimary }]}>Edit Transaction</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setMenuOpen(false)}
                >
                  <Text style={[styles.menuText, { color: "#ef4444" }]}>Delete Transaction</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. AMOUNT HERO SECTION */}
        <Card theme={theme} style={styles.heroCard}>
          <CardContent theme={theme} style={styles.heroContent}>
            <View style={[styles.heroIconBox, { backgroundColor: isIncome ? `${theme.brandPrimary}15` : "#f43f5e15" }]}>
              {isIncome ? (
                <ArrowDownLeft color={theme.brandPrimary} size={32} />
              ) : (
                <ArrowUpRight color="#f43f5e" size={32} />
              )}
            </View>
            <Text style={[styles.heroAmount, { color: theme.textPrimary }]}>
              ₨ {data.amount.toLocaleString()}
            </Text>
            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>
              {isIncome ? "Payment Received" : "Expense Payment"}
            </Text>
          </CardContent>
        </Card>

        {/* 2. TRANSACTION ATTRIBUTES */}
        <Card theme={theme} style={styles.detailsCard}>
          <CardContent theme={theme} style={styles.detailsContent}>
            <DetailRow icon={<Tag size={18} color={theme.brandPrimary} />} label="Category" value={data.category} theme={theme} />
            <DetailRow icon={<Wallet size={18} color={theme.textSecondary} />} label="Wallet" value={data.account} theme={theme} />
            <DetailRow icon={<Calendar size={18} color={theme.textSecondary} />} label="Date" value={data.date} theme={theme} />
            <DetailRow icon={<Clock size={18} color={theme.textSecondary} />} label="Time" value={data.time} theme={theme} />
            {data.payer && (
              <DetailRow icon={<User size={18} color={theme.textSecondary} />} label={isIncome ? "From" : "Paid To"} value={data.payer} theme={theme} />
            )}
            {data.goal && (
              <DetailRow icon={<Target size={18} color={theme.textSecondary} />} label="Budget Goal" value={data.goal} theme={theme} isLast />
            )}
          </CardContent>
        </Card>

        {/* 3. NOTES SECTION */}
        {data.note && (
          <Card theme={theme} style={styles.notesCard}>
            <CardContent theme={theme} style={styles.notesContent}>
              <View style={styles.notesTitleRow}>
                <FileText size={16} color={theme.textSecondary} />
                <Text style={[styles.notesTitle, { color: theme.textSecondary }]}>Notes & Remarks</Text>
              </View>
              <Text style={[styles.notesText, { color: theme.textPrimary }]}>{data.note}</Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailRow = ({ icon, label, value, theme, isLast }: any) => (
  <View style={[styles.detailRow, !isLast && { borderBottomWidth: 1, borderBottomColor: `${theme.border}40` }]}>
    <View style={styles.detailLeft}>
      <View style={[styles.detailIconBox, { backgroundColor: theme.background }]}>{icon}</View>
      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
  </View>
);

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
  dropdown: {
    position: "absolute",
    right: 0,
    top: 54,
    width: 200,
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: { padding: 16 },
  menuText: { fontSize: 14, fontWeight: "700" },
  scrollContent: { padding: 24, paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' },
  heroCard: { borderRadius: 32, marginBottom: 24 },
  heroContent: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  heroIconBox: { width: 72, height: 72, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  heroAmount: { fontSize: 38, fontWeight: "900", letterSpacing: -1.5 },
  heroLabel: { marginTop: 12, fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 1.2, opacity: 0.7 },
  detailsCard: { borderRadius: 24 },
  detailsContent: { paddingHorizontal: 20, paddingVertical: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 18 },
  detailLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  detailIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  detailLabel: { fontSize: 13, fontWeight: "700" },
  detailValue: { fontSize: 15, fontWeight: "800" },
  notesCard: { borderRadius: 24, marginTop: 24 },
  notesContent: { padding: 20 },
  notesTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  notesTitle: { fontSize: 11, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 },
  notesText: { fontSize: 15, fontWeight: "600", lineHeight: 24, opacity: 0.9 },
});
