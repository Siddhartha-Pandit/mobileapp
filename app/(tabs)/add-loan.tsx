import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Landmark, Info, CreditCard, ShieldCheck } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";

// Components
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function AddLoanScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [provider, setProvider] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [autoDeduct, setAutoDeduct] = useState(true);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [emi, setEmi] = useState(0);

  // --- LOGIC: SIMPLE EMI CALCULATION ---
  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (p && r && n) {
      const emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(emiCalc);
    } else {
      setEmi(0);
    }
  }, [principal, rate, tenure]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* ================= HEADER BAR ================= */}
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>New Loan</Text>}
        rightContent={<View style={{ width: 44 }} />}
      />

      {/* ================= CONTENT ================= */}
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* LOAN INFO CARD */}
        <SectionHeader theme={theme} title="Loan Details" icon={<Landmark size={18} color={theme.textSecondary} />} marginBottom={16} />
        <Card theme={theme} style={{ marginBottom: 24, borderRadius: 24 }}>
          <CardContent theme={theme} style={{ paddingTop: 24 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.labelStyle(theme)}>Provider Name</Text>
              <TextInput 
                style={styles.modernInputStyle(theme)} 
                value={provider}
                onChangeText={setProvider}
                placeholder="e.g. Nabil Bank" 
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={styles.labelStyle(theme)}>Principal Amount</Text>
              <View style={{ justifyContent: 'center' }}>
                <TextInput 
                  style={[styles.modernInputStyle(theme), { paddingLeft: 40 }]} 
                  keyboardType="numeric"
                  value={principal}
                  onChangeText={setPrincipal}
                  placeholder="0.00" 
                  placeholderTextColor={theme.textSecondary}
                />
                <Text style={{ position: "absolute", left: 16, color: theme.brandPrimary, fontWeight: "700" }}>₨</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelStyle(theme)}>Interest (%)</Text>
                <TextInput 
                  style={styles.modernInputStyle(theme)} 
                  keyboardType="numeric"
                  value={rate}
                  onChangeText={setRate}
                  placeholder="12.5" 
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelStyle(theme)}>Tenure (Mo)</Text>
                <TextInput 
                  style={styles.modernInputStyle(theme)} 
                  keyboardType="numeric"
                  value={tenure}
                  onChangeText={setTenure}
                  placeholder="24" 
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* EMI PREVIEW HERO */}
        <Card theme={theme} style={{ backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}40`, borderWidth: 1, borderStyle: 'dashed', marginBottom: 32, borderRadius: 24 }}>
          <CardHeader theme={theme} style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Info size={16} color={theme.brandPrimary} />
              <CardTitle theme={theme} style={{ fontSize: 12, textTransform: 'uppercase', color: theme.brandPrimary }}>EMI Calculation</CardTitle>
            </View>
          </CardHeader>
          <CardContent theme={theme} style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ fontSize: 13, color: theme.textSecondary, fontWeight: "600" }}>Monthly Installment</Text>
                <Text style={{ marginTop: 4, fontSize: 28, fontWeight: "900", color: theme.textPrimary }}>
                  ₨ {emi.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: "600" }}>Total Payback</Text>
                 <Text style={{ fontSize: 15, fontWeight: "700", color: theme.textPrimary }}>
                   ₨ {(emi * (parseFloat(tenure) || 0)).toLocaleString("en-NP", { maximumFractionDigits: 0 })}
                 </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* REPAYMENT SETTINGS */}
        <SectionHeader theme={theme} title="Repayment" icon={<CreditCard size={18} color={theme.textSecondary} />} marginBottom={16} />
        <Card theme={theme} style={{ borderRadius: 24 }}>
          <CardContent theme={theme} style={{ paddingTop: 24 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.labelStyle(theme)}>Due Date</Text>
              <TextInput 
                  style={styles.modernInputStyle(theme)} 
                  value={dueDate} 
                  onChangeText={setDueDate}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: theme.background, padding: 16, borderRadius: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color={theme.brandPrimary} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary }}>Auto-Deduct</Text>
                </View>
                <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 2 }}>Automatic monthly payment</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setAutoDeduct(!autoDeduct)}
                style={{ 
                  width: 44, height: 24, borderRadius: 20, 
                  backgroundColor: autoDeduct ? theme.brandPrimary : theme.border,
                  justifyContent: 'center'
                }}
              >
                <View style={{ 
                  width: 18, height: 18, borderRadius: 9, backgroundColor: "#FFF",
                  position: "absolute", left: autoDeduct ? 23 : 3,
                  shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
                }} />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* ================= FIXED FOOTER ================= */}
      <View style={{ 
        position: 'absolute', bottom: 72, paddingHorizontal: 24, paddingVertical: 20, backgroundColor: theme.background, 
        borderTopWidth: 1, borderTopColor: `${theme.border}40`, width: '100%', maxWidth: 500, alignSelf: 'center'
      }}>
        <PrimaryButton 
          theme={theme} 
          title="Activate Loan" 
          fullWidth 
          onPress={() => {
            console.log("Loan Created");
            router.back();
          }}
          disabled={!provider || !principal}
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = {
  modernInputStyle: (theme: AppTheme) => ({
    width: "100%" as const, height: 52, borderRadius: 14, borderWidth: 1, borderColor: theme.border,
    paddingHorizontal: 16, fontSize: 16, fontWeight: "600" as const,
    backgroundColor: theme.background, color: theme.textPrimary,
  }),
  labelStyle: (theme: AppTheme) => ({
    fontSize: 12, fontWeight: "800" as const, color: theme.textSecondary,
    textTransform: "uppercase" as const, letterSpacing: 0.5, marginBottom: 8,
  }),
  iconBtn: (theme: AppTheme) => ({
    width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  })
};
