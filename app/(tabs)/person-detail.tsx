import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, MoreVertical, History } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card, CardContent } from "../../components/Card";
import type { AppTheme } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  // Mock Data
  const personInfo = {
    name: "Anish Magar",
    avatar: "AM",
    netBalance: 15000, 
  };

  const transactionHistory = [
    { id: 101, date: "Oct 24, 2025", note: "Lunch Split", amount: 1200, type: "gave" },
    { id: 102, date: "Oct 20, 2025", note: "Cash Loan", amount: 20000, type: "gave" },
    { id: 103, date: "Oct 15, 2025", note: "Partial Repayment", amount: 5000, type: "got" },
    { id: 104, date: "Sept 28, 2025", note: "Bike Petrol", amount: 1200, type: "got" },
  ];

  const isReceivable = personInfo.netBalance >= 0;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* ================= TOP NAVIGATION ================= */}
        <View style={{ padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtnStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>Settlement</Text>
          <TouchableOpacity style={styles.headerIconBtnStyle(theme)}>
            <MoreVertical size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ================= NET AMOUNT SUMMARY CARD ================= */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Card theme={theme} style={{ borderRadius: 24 }}>
            <CardContent theme={theme} style={{ paddingVertical: 32, paddingHorizontal: 24, alignItems: "center" }}>
              <View style={{ 
                width: 60, height: 60, borderRadius: 18, backgroundColor: theme.brandPrimary + "15", 
                marginBottom: 16, alignItems: "center", justifyContent: "center",
                borderWidth: 1, borderColor: `${theme.brandPrimary}20`
              }}>
                <Text style={{ fontSize: 18, fontWeight: "800", color: theme.brandPrimary }}>{personInfo.avatar}</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "800", color: theme.textPrimary, marginBottom: 8 }}>{personInfo.name}</Text>
              
              <Text style={{ fontSize: 11, fontWeight: "800", color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                {isReceivable ? "You are owed" : "You owe"}
              </Text>
              <Text style={{ fontSize: 34, fontWeight: "900", color: isReceivable ? theme.brandPrimary : "#ef4444", letterSpacing: -0.5 }}>
                NPR {Math.abs(personInfo.netBalance).toLocaleString()}
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* ================= TRANSACTION HISTORY ================= */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16, paddingLeft: 4 }}>
            <History size={16} color={theme.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: "800", color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}>Activity Log</Text>
          </View>

          <View style={{ gap: 12 }}>
            {transactionHistory.map((trx) => (
              <Card key={trx.id} theme={theme} style={{ borderRadius: 20 }}>
                <CardContent theme={theme} style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <TouchableOpacity 
                    onPress={() => router.push("/transaction-detail")}
                    style={{ 
                      width: 44, height: 44, borderRadius: 14, 
                      backgroundColor: trx.type === "gave" ? "#ef444415" : `${theme.brandPrimary}15`,
                      alignItems: "center", justifyContent: "center"
                    }}
                  >
                    {trx.type === "gave" ? <ArrowUpRight size={20} color="#ef4444" /> : <ArrowDownLeft size={20} color={theme.brandPrimary} />}
                  </TouchableOpacity>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: theme.textPrimary, marginBottom: 2 }}>{trx.note}</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>{trx.date}</Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: trx.type === "gave" ? "#ef4444" : theme.brandPrimary }}>
                      {trx.type === "gave" ? "-" : "+"} {trx.amount.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: "800", textTransform: "uppercase", color: theme.textSecondary, marginTop: 2 }}>
                      {trx.type === "gave" ? "Gave" : "Got"}
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ================= ACTION BUTTONS ================= */}
      <View style={{ 
        position: "absolute", bottom: 94, width: "100%", maxWidth: 500, alignSelf: 'center',
        flexDirection: "row", gap: 16, paddingHorizontal: 20, zIndex: 20
      }}>
        <TouchableOpacity style={[styles.actionBtnStyle, { backgroundColor: "#ef4444", shadowColor: "#ef4444" }]}>
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "800" }}>I Gave</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtnStyle, { backgroundColor: theme.brandPrimary, shadowColor: theme.brandPrimary }]}>
          <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "800" }}>I Got</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = {
  headerIconBtnStyle: (theme: AppTheme) => ({
    width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  }),
  actionBtnStyle: {
    flex: 1, paddingVertical: 20, borderRadius: 22, alignItems: "center" as const, justifyContent: "center" as const,
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 25, elevation: 8
  }
};
