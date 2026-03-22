import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Info, TrendingUp, Calendar, Banknote, Percent } from "lucide-react-native";

import type { AppTheme } from "../../constants/theme";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { useTheme } from "../../hooks/useTheme";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function CalculatorScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // State for calculation
  const [amount, setAmount] = useState<string>("500000");
  const [rate, setRate] = useState<string>("12");
  const [tenure, setTenure] = useState<string>("24");
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // EMI Calculation Logic
  useEffect(() => {
    const p = Number(amount);
    const r = Number(rate);
    const t = Number(tenure);

    if (p > 0 && r > 0 && t > 0) {
      const monthlyRate = r / 12 / 100;
      const emiCalc = (p * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1);
      const totalPayable = emiCalc * t;
      
      setEmi(Math.round(emiCalc));
      setTotalInterest(Math.round(totalPayable - p));
    } else {
      setEmi(0);
      setTotalInterest(0);
    }
  }, [amount, rate, tenure]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* HEADER BAR */}
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>EMI Calculator</Text>}
        rightContent={<View style={{ width: 44 }} />}
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* RESULT CARD (High Contrast) */}
        <View style={{ 
          backgroundColor: theme.brandNavy, borderRadius: 28, paddingHorizontal: 24, paddingVertical: 28, 
          marginTop: 20, marginBottom: 24, overflow: "hidden",
          shadowColor: theme.brandNavy, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 8
        }}>
          <View style={{ position: "relative", zIndex: 2 }}>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700", marginBottom: 6, textAlign: "center", letterSpacing: 1 }}>
              MONTHLY EMI
            </Text>
            <Text style={{ color: "#FFF", fontSize: 36, fontWeight: "900", textAlign: "center", marginBottom: 24 }}>
              NPR {emi.toLocaleString()}
            </Text>
            
            <View style={{ 
              paddingTop: 20, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)",
              flexDirection: "row"
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700", marginBottom: 4, textTransform: "uppercase" }}>Total Interest</Text>
                <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>₨ {totalInterest.toLocaleString()}</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700", marginBottom: 4, textTransform: "uppercase" }}>Total Payable</Text>
                <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>₨ {(Number(amount) + totalInterest).toLocaleString()}</Text>
              </View>
            </View>
          </View>
          
          {/* Decorative Circle */}
          <View style={{ position: "absolute", right: -20, bottom: -20, width: 120, height: 120, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 60 }} />
        </View>

        {/* INPUT CONTROLS USING CARD COMPONENT */}
        <Card theme={theme} style={{ marginBottom: 16, borderRadius: 24 }}>
          <CardContent theme={theme} style={{ padding: 20 }}>
            <View style={styles.labelStyle(theme)}>
              <Banknote size={16} color={theme.textSecondary} /> 
              <Text style={{ fontSize: 12, fontWeight: "800", color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginLeft: 8 }}>Principal Amount</Text>
            </View>
            <View style={styles.inputWrapperStyle}>
              <View style={styles.iconPrefixStyle(theme)}>
                <Text style={{ fontSize: 11, fontWeight: "900", color: theme.brandPrimary }}>NPR</Text>
              </View>
              <TextInput 
                keyboardType="numeric" 
                value={amount}
                onChangeText={setAmount}
                style={styles.fieldStyle(theme)}
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </CardContent>
        </Card>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
          {/* Interest Card */}
          <Card theme={theme} style={{ flex: 1, borderRadius: 20 }}>
            <CardContent theme={theme} style={{ padding: 16 }}>
              <View style={styles.labelStyle(theme)}>
                <Percent size={14} color={theme.textSecondary} /> 
                <Text style={{ fontSize: 12, fontWeight: "800", color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginLeft: 8 }}>Rate (%)</Text>
              </View>
              <View style={styles.inputWrapperStyle}>
                <View style={styles.iconPrefixStyle(theme)}>
                  <TrendingUp size={14} color={theme.brandPrimary} />
                </View>
                <TextInput 
                  keyboardType="numeric" 
                  value={rate}
                  onChangeText={setRate}
                  style={[styles.fieldStyle(theme), { fontSize: 16 }]}
                  placeholder="0.0"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </CardContent>
          </Card>

          {/* Tenure Card */}
          <Card theme={theme} style={{ flex: 1, borderRadius: 20 }}>
            <CardContent theme={theme} style={{ padding: 16 }}>
              <View style={styles.labelStyle(theme)}>
                <Calendar size={14} color={theme.textSecondary} /> 
                <Text style={{ fontSize: 12, fontWeight: "800", color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginLeft: 8 }}>Months</Text>
              </View>
              <View style={styles.inputWrapperStyle}>
                <View style={styles.iconPrefixStyle(theme)}>
                  <Text style={{ fontSize: 10, fontWeight: "900", color: theme.brandPrimary }}>MO.</Text>
                </View>
                <TextInput 
                  keyboardType="numeric" 
                  value={tenure}
                  onChangeText={setTenure}
                  style={[styles.fieldStyle(theme), { fontSize: 16 }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Info Box */}
        <View style={{ 
          flexDirection: "row", gap: 12, backgroundColor: `${theme.brandPrimary}08`, 
          padding: 16, borderRadius: 18, borderWidth: 1, borderColor: `${theme.brandPrimary}15`
        }}>
          <Info size={16} color={theme.brandPrimary} style={{ marginTop: 2 }} />
          <Text style={{ flex: 1, fontSize: 11, color: theme.textSecondary, lineHeight: 16, fontWeight: "500" }}>
            Calculations are estimates. Real loan terms may vary based on bank processing fees and compound interest methods.
          </Text>
        </View>

      </ScrollView>

      <View style={{ position: "absolute", bottom: 72, padding: 24, width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: `${theme.border}40` }}>
        <PrimaryButton 
          theme={theme}
          title="Apply for this Loan"
          onPress={() => router.push('/add-loan')}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = {
  labelStyle: (theme: AppTheme) => ({
    flexDirection: "row" as const, alignItems: "center" as const, marginBottom: 12,
  }),
  inputWrapperStyle: {
    justifyContent: "center" as const,
  },
  fieldStyle: (theme: AppTheme) => ({
    width: "100%" as const, height: 50, backgroundColor: theme.background, borderRadius: 14, borderWidth: 1, borderColor: `${theme.border}60`,
    paddingRight: 16, paddingLeft: 54, fontSize: 18, fontWeight: "800" as const, color: theme.textPrimary
  }),
  iconPrefixStyle: (theme: AppTheme) => ({
    position: "absolute" as const, left: 14, zIndex: 1,
    borderRightWidth: 1, borderRightColor: `${theme.border}60`, paddingRight: 10,
    height: 20, justifyContent: "center" as const, alignItems: "center" as const
  }),
  headerButtonStyle: (theme: AppTheme) => ({
    width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  })
};
