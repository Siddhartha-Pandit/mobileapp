import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Landmark, Info, ShieldCheck, Briefcase, Percent, Clock } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

// Components
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { FormDatePicker } from "../../components/FormDatePicker";
import { ToggleSwitch } from "../../components/ToggleSwitch";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddLoanScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [provider, setProvider] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [autoDeduct, setAutoDeduct] = useState(true);
  const [dueDate, setDueDate] = useState(new Date());
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
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="New Loan"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PRINCIPAL AMOUNT HERO */}
        <AmountInput
          theme={theme}
          label="Principal Amount"
          value={principal}
          onChangeText={setPrincipal}
        />

        {/* LOAN INFO */}
        <SectionHeader theme={theme} title="Loan Terms" icon={<Landmark size={18} color={theme.textSecondary} />} marginBottom={16} />
        <View style={styles.termsGroup}>
          <FormInput
            label="Provider Name"
            value={provider}
            onChangeText={setProvider}
            theme={theme}
            placeholder="e.g. Nabil Bank"
            icon={<Briefcase />}
          />

          <View style={styles.row}>
            <FormInput
              label="Interest (%)"
              value={rate}
              onChangeText={setRate}
              theme={theme}
              placeholder="12.5"
              keyboardType="numeric"
              icon={<Percent />}
              containerStyle={{ flex: 1 }}
            />
            <FormInput
              label="Tenure (Mo)"
              value={tenure}
              onChangeText={setTenure}
              theme={theme}
              placeholder="24"
              keyboardType="numeric"
              icon={<Clock />}
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>

        {/* EMI PREVIEW CARD */}
        <Card theme={theme} style={styles.emiCard}>
          <CardHeader theme={theme} style={styles.emiHeader}>
            <View style={styles.emiLabelRow}>
              <Info size={16} color={theme.brandPrimary} />
              <CardTitle theme={theme} style={[styles.emiTitle, { color: theme.brandPrimary }]}>EMI ESTIMATION</CardTitle>
            </View>
          </CardHeader>
          <CardContent theme={theme} style={styles.emiContent}>
            <View style={styles.emiMainRow}>
              <View>
                <Text style={[styles.emiLabel, { color: theme.textSecondary }]}>Monthly Installment</Text>
                <Text style={[styles.emiAmount, { color: theme.textPrimary }]}>
                  ₨ {emi.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View style={styles.paybackBox}>
                 <Text style={[styles.emiLabel, { color: theme.textSecondary }]}>Total Payback</Text>
                 <Text style={[styles.paybackAmount, { color: theme.textPrimary }]}>
                   ₨ {(emi * (parseFloat(tenure) || 0)).toLocaleString("en-NP", { maximumFractionDigits: 0 })}
                 </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* REPAYMENT SETTINGS */}
        <SectionHeader theme={theme} title="Repayment" icon={<ShieldCheck size={18} color={theme.textSecondary} />} marginBottom={16} />
        <View style={styles.repaymentGroup}>
          <FormDatePicker
            label="First EMI Due Date"
            value={dueDate}
            onChange={setDueDate}
            theme={theme}
          />

          <View style={[styles.toggleBox, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
            <View>
              <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Auto-Deduct</Text>
              <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>Automatic monthly payment</Text>
            </View>
            <ToggleSwitch checked={autoDeduct} onChange={setAutoDeduct} theme={theme} />
          </View>
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton 
          theme={theme} 
          title="Activate Loan" 
          onPress={() => router.back()}
          disabled={!provider || !principal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 220, 
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  termsGroup: { marginBottom: 32 },
  row: { flexDirection: 'row', gap: 16 },
  emiCard: { 
    backgroundColor: 'rgba(17, 82, 212, 0.05)', 
    borderColor: 'rgba(17, 82, 212, 0.2)', 
    borderWidth: 1.5, 
    borderRadius: 28,
    marginBottom: 40,
    borderStyle: 'dashed',
  },
  emiHeader: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 },
  emiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emiTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  emiContent: { paddingHorizontal: 24, paddingBottom: 24 },
  emiMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  emiLabel: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  emiAmount: { fontSize: 30, fontWeight: "900", letterSpacing: -1 },
  paybackBox: { alignItems: 'flex-end' },
  paybackAmount: { fontSize: 16, fontWeight: "800" },
  repaymentGroup: { gap: 12 },
  toggleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  toggleTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  toggleSubtitle: { fontSize: 12, fontWeight: "600" },
  footer: { 
    position: "absolute", 
    bottom: 72, 
    left: 0, 
    right: 0, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
  },
});
