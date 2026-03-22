import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ChevronLeft, Wallet, Tag, Zap, CheckCircle2, Clock, ArrowUpCircle, ArrowDownCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useTheme } from "../../hooks/useTheme";
import { SegmentTabs } from "../../components/SegmentTabs";

export default function AddRecurringScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [isAuto, setIsAuto] = useState(true);
  const [account, setAccount] = useState("Global IME Bank");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* ================= HEADER ================= */}
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>Add Recurring</Text>}
        rightContent={<View style={{ width: 44 }} />}
      />

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        <Text style={{ fontSize: 28, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>
          Transaction Plan
        </Text>
        <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: "500", marginTop: 4, marginBottom: 24 }}>
          Manage your automated cash flow
        </Text>

        {/* ================= TABS ================= */}
        <View style={{ marginBottom: 32 }}>
          <SegmentTabs
            theme={theme}
            tabs={["Expense", "Income"]}
            active={activeTab}
            onChange={(tab) => setActiveTab(tab as "Expense" | "Income")}
          />
        </View>

        {/* ================= AMOUNT CARD ================= */}
        <Card theme={theme} style={{ marginBottom: 32, borderRadius: 24 }}>
          <CardContent theme={theme} style={{ padding: 32, alignItems: 'center' }}>
             <SectionHeader theme={theme} title={`Plan ${activeTab} Amount`} variant="label" marginBottom={0} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 }}>
              <Text style={{ fontSize: 32, fontWeight: "800", color: activeTab === "Expense" ? theme.danger : theme.brandPrimary, marginRight: 8 }}>₨</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
                value={amount}
                onChangeText={setAmount}
                style={{ fontSize: 48, fontWeight: "800", color: theme.textPrimary, minWidth: 120, textAlign: 'center' }}
              />
            </View>
          </CardContent>
        </Card>

        {/* ================= FORM FIELDS ================= */}
        <View style={{ gap: 24, marginBottom: 32 }}>
          <View>
            <SectionHeader theme={theme} title="Transaction Title" icon={<Tag size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput 
              placeholder={activeTab === "Expense" ? "e.g. Netflix Subscription" : "e.g. Monthly Salary"} 
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
              style={styles.inputStyle(theme)} 
            />
          </View>

          <View>
            <SectionHeader theme={theme} title={activeTab === "Expense" ? "Pay From" : "Deposit To"} icon={<Wallet size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            {/* Simple TextInput mock for Select */}
            <TextInput 
              value={account}
              onChangeText={setAccount}
              style={styles.inputStyle(theme)} 
            />
          </View>
        </View>

        {/* ================= SCHEDULE CARD ================= */}
        <SectionHeader theme={theme} title="Schedule Details" icon={<Clock size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
        <Card theme={theme} style={{ marginBottom: 32, borderRadius: 24 }}>
          <CardContent theme={theme} style={{ padding: 24 }}>
            <View style={{ flexDirection: "row", gap: 16, marginBottom: 24 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.miniLabelStyle(theme)}>Frequency</Text>
                    <TextInput 
                        value={frequency} 
                        onChangeText={setFrequency}
                        style={styles.innerInputStyle(theme)}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.miniLabelStyle(theme)}>Starting</Text>
                    <TextInput value={startDate} onChangeText={setStartDate} style={styles.innerInputStyle(theme)} />
                </View>
            </View>

            {/* AUTO-EXECUTE TOGGLE */}
            <View style={{ 
              paddingTop: 20, borderTopWidth: 1, borderTopColor: `${theme.border}30`, 
              flexDirection: "row", alignItems: "center", justifyContent: "space-between" 
            }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Zap size={14} fill={theme.brandPrimary} color={theme.brandPrimary} />
                    <Text style={{ fontSize: 14, fontWeight: "800", color: theme.textPrimary }}>Auto-Execute</Text>
                </View>
                <Text style={{ fontSize: 11, color: theme.textSecondary, lineHeight: 16 }}>
                  System will process this {frequency.toLowerCase()} automatically.
                </Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setIsAuto(!isAuto)}
                style={{ 
                  width: 50, height: 28, borderRadius: 20, 
                  backgroundColor: isAuto ? theme.brandPrimary : theme.border, 
                  justifyContent: "center"
                }}
              >
                <View style={{ 
                  width: 22, height: 22, backgroundColor: "#fff", borderRadius: 11, 
                  position: "absolute", left: isAuto ? 25 : 3,
                  shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
                }} />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={{ 
        position: 'absolute', bottom: 72, width: '100%', maxWidth: 500, alignSelf: 'center', zIndex: 10,
        paddingHorizontal: 24, paddingVertical: 20, backgroundColor: theme.background, 
        borderTopWidth: 1, borderTopColor: `${theme.border}30`
      }}>
        <PrimaryButton
          theme={theme}
          title={`Save ${activeTab} Plan`}
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = {
  miniLabelStyle: (theme: any) => ({
    fontSize: 10, fontWeight: "800" as const, color: theme.textSecondary,
    textTransform: "uppercase" as const, marginBottom: 8, paddingLeft: 4
  }),
  inputStyle: (theme: any) => ({
    width: "100%" as const, paddingHorizontal: 20, height: 56, borderRadius: 18, backgroundColor: theme.surface,
    borderWidth: 1, borderColor: `${theme.border}80`, color: theme.textPrimary, fontSize: 15, fontWeight: "600" as const,
  }),
  innerInputStyle: (theme: any) => ({
    width: "100%" as const, paddingHorizontal: 16, height: 48, borderRadius: 14, backgroundColor: theme.background,
    borderWidth: 1, borderColor: `${theme.border}50`, color: theme.textPrimary, fontSize: 14, fontWeight: "700" as const,
  }),
  headerButtonStyle: (theme: any) => ({
    width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  }),

  confirmButtonStyle: (theme: any) => ({
    width: "100%" as const, paddingVertical: 20, borderRadius: 20, backgroundColor: theme.brandPrimary,
    flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const,
    shadowColor: theme.brandPrimary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4
  })
};
