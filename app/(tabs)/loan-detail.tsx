import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, CheckCircle2, Clock, Lock, Wallet, Download, MoreVertical, Edit2, Trash2 } from "lucide-react-native";

import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/Card";
import { useTheme } from "../../hooks/useTheme";
import { PrimaryButton } from "../../components/PrimaryButton";
import { HeaderActionMenu } from "../../components/HeaderActionMenu";
import { CircularProgress } from "../../components/charts/CircularProgress";
import type { AppTheme } from "../../constants/theme";

export default function LoanDetailsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const paidPercent = 65;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>Loan Details</Text>}
        rightContent={
          <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.iconBtn(theme)}>
            <MoreVertical size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 220, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* ================= PROGRESS VISUALIZATION ================= */}
        <View style={{ marginTop: 24 }}>
          <SectionHeader theme={theme} title="Principal vs Interest" marginBottom={12} />
          
          <Card theme={theme} style={{ borderRadius: 24 }}>
            <CardContent theme={theme} style={{ paddingVertical: 32, paddingHorizontal: 20, alignItems: "center" }}>
              <CircularProgress 
                theme={theme}
                percentage={paidPercent}
                size={160}
                strokeWidth={10}
                centerLabel={`${paidPercent}%`}
                centerSubLabel="Paid"
              />

              <View style={{ marginTop: 24, flexDirection: "row", justifyContent: 'space-around', width: "100%" }}>
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.brandPrimary }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: theme.textSecondary }}>Principal</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary }}>NPR 15,750</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.border }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: theme.textSecondary }}>Interest</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary }}>NPR 4,250</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* ================= 2x2 STATISTICS GRID ================= */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginHorizontal: -6 }}>
          {[
            { label: "Interest Paid", value: "NPR 4,250" },
            { label: "Remaining", value: "NPR 15,750" },
            { label: "Next EMI Date", value: "Oct 15" },
            { label: "End Date", value: "Dec 2025" }
          ].map((stat, i) => (
            <View key={i} style={{ width: '50%', padding: 6 }}>
              <Card theme={theme} style={{ borderRadius: 16 }}>
                <CardHeader theme={theme} style={{ padding: 16 }}>
                  <CardDescription theme={theme} style={{ fontSize: 11, fontWeight: "600", textTransform: "uppercase" }}>
                    {stat.label}
                  </CardDescription>
                  <CardTitle theme={theme} style={{ fontSize: 16 }}>{stat.value}</CardTitle>
                </CardHeader>
              </Card>
            </View>
          ))}
        </View>

        {/* ================= PAYMENT HISTORY ================= */}
        <View style={{ marginTop: 32 }}>
          <SectionHeader 
            theme={theme} 
            title="History & Schedule" 
            rightComponent={
              <TouchableOpacity>
                <Text style={{ color: theme.brandPrimary, fontWeight: "700", fontSize: 13 }}>View All</Text>
              </TouchableOpacity>
            }
            marginBottom={12}
          />
          
          <View style={{ gap: 10 }}>
            {/* Paid Item */}
            <Card theme={theme} style={{ borderRadius: 16 }}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${theme.brandPrimary}15`, alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={18} color={theme.brandPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary }}>Installment #14</Text>
                  <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Paid on Sept 15</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>NPR 1,200</Text>
                  <Text style={{ fontSize: 9, fontWeight: "800", color: theme.brandPrimary, textTransform: "uppercase", marginTop: 2 }}>Paid</Text>
                </View>
              </View>
            </Card>

            {/* Pending Item */}
            <Card theme={theme} style={{ backgroundColor: `${theme.brandPrimary}05`, borderColor: `${theme.brandPrimary}40`, borderWidth: 1, borderRadius: 16 }}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.brandPrimary, alignItems: "center", justifyContent: "center" }}>
                  <Clock size={18} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary }}>Installment #15</Text>
                  <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Due on Oct 15</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>NPR 1,200</Text>
                  <View style={{ backgroundColor: `${theme.brandPrimary}15`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 2 }}>
                    <Text style={{ fontSize: 9, fontWeight: "800", color: theme.brandPrimary }}>PENDING</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Locked Item */}
            <Card theme={theme} style={{ opacity: 0.6, borderRadius: 16 }}>
              <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.border, alignItems: "center", justifyContent: "center" }}>
                  <Lock size={18} color={theme.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary }}>Installment #16</Text>
                  <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Due on Nov 15</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>NPR 1,200</Text>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* ================= FOOTER ACTIONS ================= */}
      <View style={{ 
        position: "absolute", bottom: 72, width: "100%", 
        backgroundColor: theme.background, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, 
        borderTopWidth: 1, borderTopColor: `${theme.border}80`, flexDirection: "row", gap: 12, zIndex: 10 
      }}>
        <PrimaryButton theme={theme} title="Pre-pay Principal" onPress={() => {}} style={{ flex: 1, height: 52, borderRadius: 14 }} />
        
        <TouchableOpacity style={{ 
          width: 52, height: 52, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, 
          borderRadius: 14, alignItems: "center", justifyContent: "center"
        }}>
          <Download size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <HeaderActionMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        theme={theme}
        items={[
          {
            label: "Edit Loan",
            icon: <Edit2 size={18} color={theme.textPrimary} />,
            onPress: () => {}
          },
          {
            label: "Delete Loan",
            icon: <Trash2 size={18} color={theme.danger} />,
            isDestructive: true,
            onPress: () => {}
          }
        ]}
        anchorPosition={{ top: 70, right: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = {
  iconBtn: (theme: AppTheme) => ({
    width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  })
};
