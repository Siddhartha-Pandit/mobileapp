import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Trash2, Plus, ArrowLeftRight, Wallet } from "lucide-react-native";
import { Card, CardContent } from "../../components/Card";
import HeaderBar from "../../components/HeaderBar";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import { GrowthLineChart } from "../../components/charts/GrowthLineChart";

export default function AccountDetailPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const account = {
    name: "Personal Savings",
    type: "Bank Account",
    balance: 45680,
    color: "#1152d4",
    includeInTotal: true,
    notes: "Emergency fund & long term savings account.",
  };

  // Chart Data format for GrowthLineChart
  const chartData = [
    { value: 350 }, { value: 380 }, { value: 360 },
    { value: 420 }, { value: 400 }, { value: 456 }, { value: 456 }
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Account Details</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={<View style={{ width: 44 }} />}
      />

      {/* Subtitle */}
      <View style={styles.subtitleBox}>
        <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
          Overview of your {account.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= BALANCE CARD ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>CURRENT BALANCE</Text>
              <Text style={[styles.balanceStyle, { color: theme.textPrimary }]}>
                ₨ {account.balance.toLocaleString()}
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* ================= QUICK ACTIONS ================= */}
        <View style={styles.actionContainer}>
          <ActionButton
            theme={theme}
            icon={<Plus size={20} />}
            label="Add Money"
            onPress={() => router.push("/add-money" as any)}
          />
          <ActionButton
            theme={theme}
            icon={<Wallet size={20} />}
            label="Expense"
            onPress={() => router.push("/add-expense" as any)}
          />
          <ActionButton
            theme={theme}
            icon={<ArrowLeftRight size={20} />}
            label="Transfer"
            onPress={() => router.push("/transfer" as any)}
          />
        </View>

        {/* ================= TREND (Custom Mock Chart) ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>BALANCE TREND</Text>
              <View style={styles.chartArea}>
                <GrowthLineChart
                  theme={theme}
                  data={chartData}
                  color={account.color}
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* ================= DETAILS ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>STATISTICS & INFO</Text>

              <DetailRow theme={theme} label="Account Name" value={account.name} />
              <DetailRow theme={theme} label="Account Type" value={account.type} />

              <View style={styles.rowStyle}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Theme Color</Text>
                <View style={styles.colorIndicatorBox}>
                  <View style={[styles.colorCircle, { backgroundColor: account.color }]} />
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{account.color}</Text>
                </View>
              </View>

              <DetailRow theme={theme} label="Included in Total" value={account.includeInTotal ? "Yes" : "No"} />

              <View style={[styles.rowStyle, { flexDirection: "column", alignItems: "flex-start", gap: 8 }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Notes</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary, fontWeight: "500", lineHeight: 22 }]}>
                  {account.notes}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* ================= DELETE ================= */}
        <View style={styles.deleteSection}>
          <TouchableOpacity style={[styles.deleteBtn, { borderColor: `${theme.danger || '#EF4444'}40` }]}>
            <Trash2 size={20} color={theme.danger || "#EF4444"} />
            <Text style={[styles.deleteText, { color: theme.danger || "#EF4444" }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

const ActionButton = ({ theme, icon, label, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={[styles.actionIconBox, { backgroundColor: `${theme.brandPrimary}15` }]}>
      {React.cloneElement(icon, { color: theme.brandPrimary })}
    </View>
    <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{label}</Text>
  </TouchableOpacity>
);

const DetailRow = ({ theme, label, value }: any) => (
  <View style={styles.rowStyle}>
    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
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
  subtitleBox: { paddingHorizontal: 24, paddingBottom: 16 },
  subtitleText: { fontSize: 13, fontWeight: "600" },
  scrollContent: { paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' },
  sectionWrap: { paddingHorizontal: 24, marginBottom: 24 },
  cardPadding: { padding: 24 },
  labelStyle: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  balanceStyle: { fontSize: 34, fontWeight: "900", marginTop: 12 },
  
  actionContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 24, gap: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  actionLabel: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },

  chartArea: { height: 160, marginTop: 24 },

  rowStyle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  detailLabel: { fontSize: 13, fontWeight: "600" },
  detailValue: { fontSize: 15, fontWeight: "700" },
  colorIndicatorBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  colorCircle: { width: 14, height: 14, borderRadius: 7 },

  deleteSection: { paddingHorizontal: 24, marginBottom: 40 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  deleteText: { fontSize: 16, fontWeight: "800" },
});
