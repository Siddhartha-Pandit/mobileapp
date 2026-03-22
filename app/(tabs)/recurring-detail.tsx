import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ChevronLeft, MoreVertical, Calendar, Clock, CreditCard, History, PauseCircle, Trash2, ExternalLink, ShieldCheck } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Types & Components
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import { Card, CardContent } from "../../components/Card";

export default function RecurringDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  // Mock data
  const data = {
    id: id,
    title: "Netflix Premium",
    amount: 1500,
    frequency: "Monthly",
    nextBilling: "02 March, 2026",
    paymentMethod: "HBL Visa Card •••• 4242",
    category: "Entertainment",
    status: "Active",
    startedDate: "Jan 02, 2024",
    totalPaid: "₨ 36,000"
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* ================= HEADER ================= */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn(theme)}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary }}>Subscription Detail</Text>
          <TouchableOpacity style={styles.iconBtn(theme)}>
            <MoreVertical size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={{ padding: 20, gap: 24 }}>
          
          {/* ================= MAIN VISUAL CARD ================= */}
          <Card theme={theme} style={{ borderRadius: 32, overflow: 'hidden' }}>
            <CardContent theme={theme} style={{ paddingVertical: 40, paddingHorizontal: 20, alignItems: "center" }}>
              {/* Decorative Background Icon */}
              <View style={{ position: "absolute", top: -10, right: -10, opacity: 0.05 }}>
                <ShieldCheck size={120} color={theme.brandPrimary} />
              </View>

              <View style={styles.logoWrapper(theme)}>
                <CreditCard size={32} color={theme.brandPrimary} />
              </View>
              
              <Text style={{ fontSize: 24, fontWeight: "900", color: theme.textPrimary, marginBottom: 8 }}>{data.title}</Text>
              
              <View style={styles.statusBadge}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#10B981" }} />
                <Text style={{ color: "#10B981", fontSize: 12, fontWeight: "800" }}>{data.status}</Text>
              </View>

              <Text style={{ fontSize: 38, fontWeight: "900", color: theme.textPrimary, marginTop: 24 }}>
                 ₨ {data.amount.toLocaleString()} 
                 <Text style={{ fontSize: 16, color: theme.textSecondary, fontWeight: "600" }}>/{data.frequency.toLowerCase().replace('ly', '')}</Text>
              </Text>
            </CardContent>
          </Card>

          {/* ================= BILLING INFO LIST ================= */}
          <Card theme={theme} style={{ borderRadius: 24 }}>
            <CardContent theme={theme} style={{ paddingHorizontal: 20, paddingVertical: 4 }}>
              <InfoRow icon={<Calendar size={18} color={theme.textSecondary} />} label="Next Billing" value={data.nextBilling} theme={theme} />
              <InfoRow icon={<Clock size={18} color={theme.textSecondary} />} label="Cycle" value={data.frequency} theme={theme} />
              <InfoRow icon={<CreditCard size={18} color={theme.textSecondary} />} label="Method" value="Visa •••• 4242" theme={theme} />
              <InfoRow icon={<ExternalLink size={18} color={theme.textSecondary} />} label="Category" value={data.category} theme={theme} isLast />
            </CardContent>
          </Card>

          {/* ================= QUICK STATS ================= */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Card theme={theme} style={{ flex: 1, borderRadius: 20 }}>
              <CardContent theme={theme} style={{ padding: 16 }}>
                <Text style={styles.statLabel(theme)}>Started</Text>
                <Text style={styles.statValue(theme)}>{data.startedDate}</Text>
              </CardContent>
            </Card>
            <Card theme={theme} style={{ flex: 1, borderRadius: 20 }}>
              <CardContent theme={theme} style={{ padding: 16 }}>
                <Text style={styles.statLabel(theme)}>Total Spent</Text>
                <Text style={styles.statValue(theme)}>{data.totalPaid}</Text>
              </CardContent>
            </Card>
          </View>

          {/* ================= RECENT ACTIVITY ================= */}
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: "900", color: theme.textPrimary }}>Recent Activity</Text>
              <TouchableOpacity onPress={() => router.push("/transaction-detail")}>
                <History size={18} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <Card theme={theme} style={{ borderRadius: 20 }}>
              <CardContent theme={theme} style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>February Payment</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: "600", marginTop: 2 }}>Paid on Feb 02, 2026</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "900", color: theme.textPrimary }}>₨ 1,500</Text>
              </CardContent>
            </Card>
          </View>

          {/* ================= ACTIONS ================= */}
          <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
               <PauseCircle size={18} color={theme.textPrimary} />
               <Text style={{ marginLeft: 8, fontWeight: "800", color: theme.textPrimary }}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { flex: 1, backgroundColor: "#EF444415", borderColor: "#EF444430", borderWidth: 1 }]}>
               <Trash2 size={18} color="#EF4444" />
               <Text style={{ marginLeft: 8, fontWeight: "800", color: "#EF4444" }}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= SUB-COMPONENTS ================= */

const InfoRow = ({ icon, label, value, theme, isLast }: any) => (
  <View style={{ 
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", 
    paddingVertical: 18, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: `${theme.border}60` 
  }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      {icon}
      <Text style={{ fontSize: 14, fontWeight: "600", color: theme.textSecondary }}>{label}</Text>
    </View>
    <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>{value}</Text>
  </View>
);

/* ================= STYLES ================= */

const styles = {
  iconBtn: (theme: AppTheme) => ({
    width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const,
  }),
  logoWrapper: (theme: AppTheme) => ({
    width: 72, height: 72, backgroundColor: theme.brandPrimary + "15", borderRadius: 24, 
    alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 16
  }),
  statusBadge: {
    flexDirection: "row" as const, alignItems: "center" as const, gap: 6, paddingHorizontal: 14, paddingVertical: 6, 
    backgroundColor: "#10B98115", borderRadius: 100
  },
  statLabel: (theme: AppTheme) => ({
    fontSize: 11, color: theme.textSecondary, fontWeight: "800" as const, textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 4
  }),
  statValue: (theme: AppTheme) => ({
    fontSize: 15, fontWeight: "800" as const, color: theme.textPrimary
  }),
  actionBtn: {
    paddingVertical: 18, borderRadius: 20, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const
  }
};
